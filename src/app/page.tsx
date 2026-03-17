"use client";

import { useState, useCallback, useRef } from "react";
import { createWalletClient, createPublicClient, http, formatUnits } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { tempoModerato } from "viem/chains";
import { Mppx, tempo } from "mppx/client";
import { CopyButton } from "@/components/CopyButton";

interface RequestResult {
  status: number;
  data: unknown;
  error?: string;
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
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RequestResult | null>(null);
  const [clientInfo, setClientInfo] = useState<ClientInfo | null>(null);
  const [testnetDomain, setTestnetDomain] = useState("");
  const [mainnetDomain, setMainnetDomain] = useState("");
  const mppxRef = useRef<ReturnType<typeof Mppx.create> | null>(null);

  const isValidDomain = (value: string) =>
    /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z]{2,})+$/.test(value.trim());

  const initializeClient = useCallback(async () => {
    if (!privateKey || !privateKey.startsWith("0x")) {
      alert("Please enter a valid private key starting with 0x");
      return;
    }

    try {
      const account = privateKeyToAccount(privateKey as `0x${string}`);

      const proxiedFetch = createProxiedFetch();

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
        fetch: proxiedFetch,
        methods: [
          tempo({
            account,
            getClient: () => walletClient,
          }),
        ],
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
      setResult(null);
    } catch (error) {
      alert(`Error initializing client: ${error}`);
    }
  }, [privateKey]);

  const makeRequest = useCallback(
    async (url: string) => {
      if (!isInitialized || !mppxRef.current) {
        alert("Please initialize the MPP client first");
        return;
      }

      setLoading(true);
      setResult(null);

      try {
        const response = await mppxRef.current.fetch(url);
        const text = await response.text();

        let data: unknown;
        try {
          data = JSON.parse(text);
        } catch {
          data = text;
        }

        setResult({
          status: response.status,
          data,
        });
      } catch (error) {
        setResult({
          status: 0,
          data: null,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      } finally {
        setLoading(false);
      }
    },
    [isInitialized],
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            MPP Demo
          </h1>
          <p className="text-zinc-400 text-lg">Machine Payments Protocol - Client & Server Demo</p>
        </header>

        <section className="bg-zinc-800/50 rounded-2xl p-8 mb-8 border border-zinc-700">
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

            <button
              onClick={initializeClient}
              disabled={!privateKey || isInitialized}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-700 disabled:text-zinc-500 rounded-lg font-semibold transition-colors">
              {isInitialized ? "✓ Client Initialized" : "Initialize MPP Client"}
            </button>

            {accountAddress && clientInfo && (
              <div className="bg-zinc-900 rounded-lg p-4 space-y-3">
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
                </div>
                <pre className="bg-zinc-950 rounded-lg p-4 overflow-x-auto text-sm">
                  <code className="text-zinc-300">{JSON.stringify(clientInfo, null, 2)}</code>
                </pre>
              </div>
            )}
          </div>
        </section>

        <section className="bg-zinc-800/50 rounded-2xl p-8 mb-8 border border-zinc-700">
          <h2 className="text-2xl font-semibold mb-6">2. Endpoints</h2>

          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Ping Tests</h3>

              <div className="flex items-center justify-between bg-zinc-900 rounded-lg p-4">
                <div>
                  <p className="font-mono text-sm">mpp.dev/api/ping/paid</p>
                  <p className="text-xs text-zinc-500 mt-1">Official MPP test endpoint (external)</p>
                </div>
                <button
                  onClick={() => makeRequest("https://mpp.dev/api/ping/paid")}
                  disabled={!isInitialized || loading}
                  className="px-4 py-2 bg-green-600 hover:bg-green-500 disabled:bg-zinc-700 disabled:text-zinc-500 rounded-lg text-sm font-medium transition-colors cursor-pointer shrink-0 ml-4">
                  Send ($0.01)
                </button>
              </div>

              <div className="flex items-center justify-between bg-zinc-900 rounded-lg p-4">
                <div>
                  <p className="font-mono text-sm">/api/test</p>
                  <p className="text-xs text-zinc-500 mt-1">Local server endpoint ($0.01/request)</p>
                </div>
                <button
                  onClick={() => makeRequest("/api/test")}
                  disabled={!isInitialized || loading}
                  className="px-4 py-2 bg-green-600 hover:bg-green-500 disabled:bg-zinc-700 disabled:text-zinc-500 rounded-lg text-sm font-medium transition-colors cursor-pointer shrink-0 ml-4">
                  Send ($0.01)
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Domain Registration</h3>

              <div className="bg-zinc-900 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-mono text-sm">Register (Testnet)</p>
                    <p className="text-xs text-zinc-500 mt-1">Register a domain on DOMA Testnet</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <input
                    type="text"
                    value={testnetDomain}
                    onChange={(e) => setTestnetDomain(e.target.value)}
                    placeholder="example.com"
                    className="flex-1 bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 font-mono text-sm focus:outline-none focus:border-blue-500 max-w-xs"
                  />
                  <button
                    onClick={() => alert(`domain to register: ${testnetDomain.trim()}`)}
                    disabled={!isInitialized || loading || !isValidDomain(testnetDomain)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-700 disabled:text-zinc-500 rounded-lg text-sm font-medium transition-colors cursor-pointer shrink-0">
                    Register ($12.88)
                  </button>
                </div>
              </div>

              <div className="bg-zinc-900 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-mono text-sm">Register (Mainnet)</p>
                    <p className="text-xs text-zinc-500 mt-1">Register a domain on DOMA Mainnet</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <input
                    type="text"
                    value={mainnetDomain}
                    onChange={(e) => setMainnetDomain(e.target.value)}
                    placeholder="example.com"
                    className="flex-1 bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 font-mono text-sm focus:outline-none focus:border-blue-500 max-w-xs"
                  />
                  <button
                    onClick={() => alert(`domain to register: ${mainnetDomain.trim()}`)}
                    disabled={!isInitialized || loading || !isValidDomain(mainnetDomain)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-700 disabled:text-zinc-500 rounded-lg text-sm font-medium transition-colors cursor-pointer shrink-0">
                    Register ($12.88)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-zinc-800/50 rounded-2xl p-8 border border-zinc-700">
          <h2 className="text-2xl font-semibold mb-6">3. Response</h2>

          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-3 text-zinc-400">Processing payment...</span>
            </div>
          )}

          {!loading && result && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    result.status === 200
                      ? "bg-green-600/30 text-green-400"
                      : result.status === 402
                        ? "bg-yellow-600/30 text-yellow-400"
                        : "bg-red-600/30 text-red-400"
                  }`}>
                  Status: {result.status}
                </span>
              </div>

              <pre className="bg-zinc-900 rounded-lg p-4 overflow-x-auto text-sm">
                <code className="text-zinc-300">
                  {JSON.stringify(result.data || result.error, null, 2)}
                </code>
              </pre>
            </div>
          )}

          {!loading && !result && (
            <div className="text-center py-12 text-zinc-500">
              <p>Initialize the client and click an endpoint to test</p>
            </div>
          )}
        </section>

        <footer className="mt-12 text-center text-zinc-500 text-sm">
          <p>
            MPP Demo • Built with Next.js and{" "}
            <a
              href="https://mpp.dev"
              className="text-blue-400 hover:underline"
              target="_blank"
              rel="noopener noreferrer">
              mppx
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
