"use client";

import { useState, useCallback, useRef } from "react";
import { createWalletClient, createPublicClient, http, formatUnits } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { tempoModerato } from "viem/chains";
import { Mppx, tempo } from "mppx/client";
import { CopyButton } from "@/components/CopyButton";
import { Card, CardInner } from "@/components/Card";
import { Button } from "@/components/Button";
import { DomaLogo } from "@/components/DomaLogo";
import { MppLogo } from "@/components/MppLogo";

interface TraceStep {
  label: string;
  timestamp: number;
  type: "request" | "response" | "challenge" | "credential" | "error";
  data: unknown;
}

interface ClientInfo {
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

const DEFAULT_PRIVATE_KEY = process.env.NEXT_PUBLIC_TEST_PRIVATE_KEY_1 || "";

function createProxiedFetch() {
  const originalFetch = globalThis.fetch;

  return async function proxiedFetch(
    input: RequestInfo | URL,
    init?: RequestInit,
  ): Promise<Response> {
    const url = typeof input === "string" ? input : input.toString();

    if (url.startsWith("https://mpp.dev/")) {
      const proxyUrl = `/api/vercel-proxy?url=${encodeURIComponent(url)}`;
      return originalFetch(proxyUrl, init);
    }

    return originalFetch(input, init);
  };
}

export default function Home() {
  const [privateKey, setPrivateKey] = useState<string>(DEFAULT_PRIVATE_KEY);
  const [accountAddress, setAccountAddress] = useState<string>("");
  const [isInitialized, setIsInitialized] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [trace, setTrace] = useState<TraceStep[]>([]);
  const [clientInfo, setClientInfo] = useState<ClientInfo | null>(null);
  const [testnetDomain, setTestnetDomain] = useState("");
  const [mainnetDomain, setMainnetDomain] = useState("");
  const mppxRef = useRef<ReturnType<typeof Mppx.create> | null>(null);
  const traceRef = useRef<TraceStep[]>([]);

  const isValidDomain = (value: string) =>
    /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z]{2,})+$/.test(value.trim());

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

      const proxiedFetch = createProxiedFetch();

      // Wrap fetch to trace requests and responses
      const tracingFetch = async (
        input: RequestInfo | URL,
        init?: RequestInit,
      ): Promise<Response> => {
        const url = typeof input === "string" ? input : input.toString();
        const hasAuth = !!(init?.headers && new Headers(init.headers).get("Authorization"));

        addTrace({
          label: hasAuth ? "Retry with credential" : "Initial request",
          timestamp: Date.now(),
          type: "request",
          data: {
            url,
            method: init?.method || "GET",
            ...(hasAuth && { authorization: new Headers(init!.headers).get("Authorization") }),
          },
        });

        const response = await proxiedFetch(input, init);

        // Clone so the body can still be read downstream
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
            },
          });

          const credential = await createCredential();

          addTrace({
            label: "Credential created",
            timestamp: Date.now(),
            type: "credential",
            data: {
              credential,
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <a
              href="https://doma.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer">
              <DomaLogo className="h-10 w-auto text-zinc-400" />
            </a>
            <svg
              className="w-6 h-6 text-zinc-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            <a
              href="https://mpp.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer">
              <MppLogo className="h-8 w-auto" />
            </a>
          </div>
          <p className="text-zinc-500 text-lg font-medium">Domain Registration with MPP (Demo)</p>
        </header>

        <Card className="mb-8">
          <h2 className="text-2xl font-semibold mb-6">1. Init Client</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Private Key</label>
              <input
                type="text"
                value={privateKey}
                onChange={(e) => {
                  setPrivateKey(e.target.value);
                  setIsInitialized(false);
                }}
                placeholder="0x..."
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <Button
              onClick={initializeClient}
              disabled={!privateKey || isInitialized}
              variant="blue"
              className="w-full py-3 font-semibold">
              {isInitialized ? "✓ Client Initialized" : "Initialize MPP Client"}
            </Button>

            {accountAddress && clientInfo && (
              <CardInner className="space-y-2">
                <div>
                  <p className="text-sm text-zinc-400">Account Address:</p>
                  <div className="flex items-center gap-2">
                    <a
                      href={`https://explore.tempo.xyz/address/${accountAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-lg text-green-400 hover:underline break-all">
                      {accountAddress}
                    </a>
                    <CopyButton value={accountAddress} />
                  </div>
                  <p className="text-sm text-zinc-500 mt-1">{clientInfo.chain.name}</p>
                </div>
                <details className="group">
                  <summary className="text-xs text-zinc-500 cursor-pointer hover:text-zinc-400 transition-colors select-none">
                    Client details
                  </summary>
                  <pre className="font-mono text-sm text-zinc-300 whitespace-pre-wrap break-all mt-2">
                    {JSON.stringify(clientInfo, null, 2)}
                  </pre>
                </details>
              </CardInner>
            )}
          </div>
        </Card>

        <Card className="mb-8">
          <h2 className="text-2xl font-semibold mb-6">2. Endpoints</h2>

          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-base font-bold text-zinc-300 uppercase tracking-wider">
                Testing
              </h3>

              <CardInner className="flex items-center justify-between">
                <div>
                  <p className="font-mono text-sm">mpp.dev/api/ping/paid</p>
                  <p className="text-sm text-zinc-500 mt-1">
                    Official MPP test endpoint (external)
                  </p>
                </div>
                <Button
                  onClick={() => makeRequest("ping-external", "https://mpp.dev/api/ping/paid")}
                  disabled={!isInitialized}
                  loading={loadingId === "ping-external"}
                  className="ml-4">
                  Send ($0.10)
                </Button>
              </CardInner>

              <CardInner className="flex items-center justify-between">
                <div>
                  <p className="font-mono text-sm">/api/test-paid</p>
                  <p className="text-sm text-zinc-500 mt-1">Local server endpoint</p>
                </div>
                <Button
                  onClick={() => makeRequest("ping-local", "/api/test-paid")}
                  disabled={!isInitialized}
                  loading={loadingId === "ping-local"}
                  className="ml-4">
                  Send ($0.10)
                </Button>
              </CardInner>

              <CardInner className="flex items-center justify-between">
                <div>
                  <p className="font-mono text-sm">/api/test-overpay</p>
                  <p className="text-sm text-zinc-500 mt-1">
                    Insufficient funds (requests $999,999,999)
                  </p>
                </div>
                <Button
                  onClick={() => makeRequest("ping-overpay", "/api/test-overpay")}
                  disabled={!isInitialized}
                  loading={loadingId === "ping-overpay"}
                  className="ml-4">
                  Send ($999M)
                </Button>
              </CardInner>
            </div>

            <div className="space-y-4">
              <h3 className="text-base font-bold text-zinc-300 uppercase tracking-wider">
                Domain Registration
              </h3>

              <CardInner>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-mono text-sm">Register (DOMA Testnet)</p>
                    <p className="text-sm text-zinc-500 mt-1">Register a domain on DOMA Testnet</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <input
                    type="text"
                    value={testnetDomain}
                    onChange={(e) => setTestnetDomain(e.target.value)}
                    placeholder="example.com"
                    className="flex-1 bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 font-mono text-sm focus:outline-none focus:border-blue-500"
                  />
                  <Button
                    onClick={() =>
                      makeRequest(
                        "register-testnet",
                        `/api/register/testnet?domain=${encodeURIComponent(testnetDomain.trim())}`,
                      )
                    }
                    disabled={!isInitialized || !isValidDomain(testnetDomain)}
                    loading={loadingId === "register-testnet"}
                    variant="blue">
                    Register ($12.88)
                  </Button>
                </div>
              </CardInner>

              <CardInner>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-mono text-sm">Register (DOMA Mainnet)</p>
                    <p className="text-sm text-zinc-500 mt-1">Register a domain on DOMA Mainnet</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <input
                    type="text"
                    value={mainnetDomain}
                    onChange={(e) => setMainnetDomain(e.target.value)}
                    placeholder="example.com"
                    className="flex-1 bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 font-mono text-sm focus:outline-none focus:border-blue-500"
                  />
                  <Button
                    onClick={() =>
                      makeRequest(
                        "register-mainnet",
                        `/api/register/mainnet?domain=${encodeURIComponent(mainnetDomain.trim())}`,
                      )
                    }
                    disabled={!isInitialized || !isValidDomain(mainnetDomain)}
                    loading={loadingId === "register-mainnet"}
                    variant="blue">
                    Register ($12.88)
                  </Button>
                </div>
              </CardInner>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-2xl font-semibold mb-6">3. Request Flow</h2>

          {loadingId && trace.length === 0 && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-3 text-zinc-400">Starting request...</span>
            </div>
          )}

          {trace.length > 0 && (
            <div className="space-y-0">
              {trace.map((step, i) => {
                const colors = {
                  request: "border-blue-500 text-blue-400",
                  response:
                    step.data && typeof step.data === "object" && "status" in step.data
                      ? (step.data as { status: number }).status === 402
                        ? "border-yellow-500 text-yellow-400"
                        : (step.data as { status: number }).status === 200
                          ? "border-green-500 text-green-400"
                          : "border-red-500 text-red-400"
                      : "border-zinc-500 text-zinc-400",
                  challenge: "border-purple-500 text-purple-400",
                  credential: "border-cyan-500 text-cyan-400",
                  error: "border-red-500 text-red-400",
                };
                const color = colors[step.type];
                const borderColor = color.split(" ")[0];
                const textColor = color.split(" ")[1];
                const isLast = i === trace.length - 1;

                const showLine = !isLast || !!loadingId;

                return (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center pt-1">
                      <div
                        className={`w-3 h-3 rounded-full border-2 ${borderColor} bg-zinc-900 shrink-0`}
                      />
                      {showLine && <div className="w-px flex-1 bg-zinc-700 mt-2" />}
                    </div>
                    <div className="flex-1 pb-5">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-sm font-semibold ${textColor}`}>{step.label}</span>
                        {i > 0 && (
                          <span className="text-xs text-zinc-600">
                            +{step.timestamp - trace[0].timestamp}ms
                          </span>
                        )}
                      </div>
                      <CardInner>
                        <pre className="font-mono text-xs text-zinc-300 whitespace-pre-wrap break-all">
                          {JSON.stringify(step.data, null, 2)}
                        </pre>
                      </CardInner>
                    </div>
                  </div>
                );
              })}
              {loadingId && (
                <div className="flex gap-4">
                  <div className="flex flex-col items-center pt-1">
                    <div className="w-3 h-3 rounded-full border-2 border-zinc-500 bg-zinc-900 shrink-0 animate-pulse" />
                  </div>
                  <div className="flex-1 pb-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm text-zinc-500 animate-pulse">Processing...</span>
                    </div>
                    <CardInner>
                      <div className="space-y-2">
                        <div className="h-3 bg-zinc-700/50 rounded animate-pulse w-3/4" />
                        <div className="h-3 bg-zinc-700/50 rounded animate-pulse w-1/2" />
                        <div className="h-3 bg-zinc-700/50 rounded animate-pulse w-2/3" />
                      </div>
                    </CardInner>
                  </div>
                </div>
              )}
            </div>
          )}

          {!loadingId && trace.length === 0 && (
            <div className="text-center py-12 text-zinc-500">
              <p>Initialize the client and click an endpoint to test</p>
            </div>
          )}
        </Card>

        <footer className="mt-12 text-center text-zinc-500 text-sm">
          <p>
            Built with{" "}
            <a
              href="https://doma.xyz"
              className="text-blue-400 hover:underline"
              target="_blank"
              rel="noopener noreferrer">
              DOMA
            </a>
            {" and "}
            <a
              href="https://mpp.dev"
              className="text-blue-400 hover:underline"
              target="_blank"
              rel="noopener noreferrer">
              MPP
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
