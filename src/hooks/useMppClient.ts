"use client";

import { useState, useCallback, useRef } from "react";
import { createWalletClient, createPublicClient, http, formatUnits } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { tempoModerato } from "viem/chains";
import { Mppx, tempo } from "mppx/client";
import { Credential } from "mppx";

export interface TraceStep {
  label: string;
  timestamp: number;
  type: "request" | "response" | "challenge" | "credential" | "error";
  data: unknown;
}

export interface ClientInfo {
  chain: {
    name: string;
    id: number;
    nativeCurrency: { name: string; symbol: string; decimals: number };
    rpcUrl: string;
  };
  account: {
    address: string;
    balance: string;
  };
  tempo: {
    account: string;
    mode: string;
    autoSwap: boolean;
  };
}

export function useMppClient(privateKey: string) {
  const [accountAddress, setAccountAddress] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [trace, setTrace] = useState<TraceStep[]>([]);
  const [clientInfo, setClientInfo] = useState<ClientInfo | null>(null);
  const mppxRef = useRef<ReturnType<typeof Mppx.create> | null>(null);
  const traceRef = useRef<TraceStep[]>([]);

  const addTrace = useCallback((step: TraceStep) => {
    traceRef.current = [...traceRef.current, step];
    setTrace([...traceRef.current]);
  }, []);

  const initializeClient = useCallback(async () => {
    if (!privateKey || !privateKey.startsWith("0x")) {
      alert("Please enter a valid private key starting with 0x");
      return;
    }

    try {
      const account = privateKeyToAccount(privateKey as `0x${string}`);

      const tracingFetch = async (
        input: RequestInfo | URL,
        init?: RequestInit,
      ): Promise<Response> => {
        const url = typeof input === "string" ? input : input.toString();
        const hasAuth = !!(init?.headers && new Headers(init.headers).get("Authorization"));

        let order: unknown;
        if (hasAuth) {
          try {
            const authHeader = new Headers(init!.headers).get("Authorization")!;
            const parsed = Credential.deserialize(authHeader);
            order = parsed.challenge.opaque;
          } catch { /* ignore parse errors */ }
        }

        addTrace({
          label: hasAuth ? "Retry with credential" : "Initial request",
          timestamp: Date.now(),
          type: "request",
          data: {
            url,
            method: init?.method || "GET",
            ...(hasAuth && { authorization: new Headers(init!.headers).get("Authorization") }),
            ...(order != null && { order }),
          },
        });

        const fetchUrl = url.startsWith("https://mpp.dev/")
          ? `/api/vercel-proxy?url=${encodeURIComponent(url)}`
          : input;
        const response = await globalThis.fetch(fetchUrl, init);

        const clone = response.clone();
        let body: unknown;
        try {
          body = await clone.json();
        } catch {
          try {
            body = await clone.text();
          } catch {
            body = null;
          }
        }

        addTrace({
          label: response.status === 402 ? "402 Payment Required" : `${response.status} Response`,
          timestamp: Date.now(),
          type: "response",
          data: {
            status: response.status,
            ...(response.status === 402 && {
              wwwAuthenticate: response.headers.get("WWW-Authenticate"),
            }),
            ...(response.status !== 402 && body != null && { body }),
          },
        });

        return response;
      };

      const walletClient = createWalletClient({
        account,
        chain: tempoModerato,
        transport: http(),
      });

      const publicClient = createPublicClient({
        chain: tempoModerato,
        transport: http(),
      });

      const mppx = Mppx.create({
        polyfill: false,
        fetch: tracingFetch,
        methods: [
          tempo({
            account,
            getClient: () => walletClient,
          }),
        ],
        onChallenge: async (challenge, { createCredential }) => {
          addTrace({
            label: "Challenge received",
            timestamp: Date.now(),
            type: "challenge",
            data: {
              id: challenge.id,
              realm: challenge.realm,
              method: challenge.method,
              intent: challenge.intent,
              request: challenge.request,
              ...(challenge.description && { description: challenge.description }),
              ...(challenge.expires && { expires: challenge.expires }),
              ...(challenge.opaque && { order: challenge.opaque }),
            },
          });

          const credential = await createCredential();

          const parsed = Credential.deserialize(credential);
          addTrace({
            label: "Payment sent",
            timestamp: Date.now(),
            type: "credential",
            data: {
              challengeId: parsed.challenge.id,
              method: parsed.challenge.method,
              payload: parsed.payload,
              ...(parsed.source && { source: parsed.source }),
            },
          });

          return credential;
        },
      });

      mppxRef.current = mppx;

      const balance = await publicClient.getBalance({ address: account.address });

      setAccountAddress(account.address);
      setClientInfo({
        chain: {
          name: tempoModerato.name,
          id: tempoModerato.id,
          nativeCurrency: tempoModerato.nativeCurrency,
          rpcUrl: tempoModerato.rpcUrls.default.http[0],
        },
        account: {
          address: account.address,
          balance: `${formatUnits(balance, tempoModerato.nativeCurrency.decimals)} ${tempoModerato.nativeCurrency.symbol}`,
        },
        tempo: {
          account: account.address,
          mode: "pull",
          autoSwap: false,
        },
      });
      setIsInitialized(true);
      setTrace([]);
      traceRef.current = [];
    } catch (error) {
      alert(`Error initializing client: ${error}`);
    }
  }, [privateKey, addTrace]);

  const makeRequest = useCallback(
    async (id: string, url: string) => {
      if (!isInitialized || !mppxRef.current || loadingId) {
        return;
      }

      setLoadingId(id);
      setTrace([]);
      traceRef.current = [];

      try {
        await mppxRef.current.fetch(url);
      } catch (error) {
        addTrace({
          label: "Error",
          timestamp: Date.now(),
          type: "error",
          data: { error: error instanceof Error ? error.message : "Unknown error" },
        });
      } finally {
        setLoadingId(null);
      }
    },
    [isInitialized, loadingId, addTrace],
  );

  const resetInitialized = useCallback(() => {
    setIsInitialized(false);
  }, []);

  return {
    accountAddress,
    isInitialized,
    loadingId,
    trace,
    clientInfo,
    initializeClient,
    makeRequest,
    resetInitialized,
  };
}
