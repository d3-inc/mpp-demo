"use client";

import { useState, useMemo } from "react";

import { Loader2, ChevronRight, CircleCheck, Globe, Info, ExternalLink, Gem } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { SUPPORTED_TLDS, DEFAULT_CONTACT, type RegistrantContact } from "@/lib/registrar";
import { CopyButton } from "@/components/CopyButton";
import { DomaLogo } from "@/components/DomaLogo";
import { MppLogo } from "@/components/MppLogo";
import { useMppClient } from "@/hooks/useMppClient";
import { useTokenStatus } from "@/hooks/useTokenStatus";

const DEFAULT_PRIVATE_KEY = process.env.NEXT_PUBLIC_TESTNET_TEMPO_KEY_1 || "";

export default function Home() {
  const [privateKey, setPrivateKey] = useState(DEFAULT_PRIVATE_KEY);
  const [domainName, setDomainName] = useState("");
  const [domainTld, setDomainTld] = useState("com");
  const [network, setNetwork] = useState<"testnet" | "mainnet">("testnet");
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [testingOpen, setTestingOpen] = useState(false);
  const [contact, setContact] = useState<RegistrantContact>({ ...DEFAULT_CONTACT });

  const {
    accountAddress,
    isInitialized,
    loadingId,
    trace,
    clientInfo,
    initializeClient,
    makeRequest,
    resetInitialized,
  } = useMppClient(privateKey);

  // Derive registered domain from trace
  const registeredDomain = useMemo(() => {
    if (loadingId || trace.length === 0) return null;
    const lastResponse = [...trace].reverse().find(
      (s) =>
        s.type === "response" &&
        s.data &&
        typeof s.data === "object" &&
        "status" in s.data &&
        (s.data as { status: number }).status === 200 &&
        "body" in s.data &&
        (s.data as { body?: { txHash?: string } }).body?.txHash,
    );
    if (!lastResponse) return null;
    return (lastResponse.data as { body: { domain: string } }).body.domain;
  }, [loadingId, trace]);

  const { tokenStatus, tokenStatusLoading } = useTokenStatus(registeredDomain, network);

  const isValidSld = (value: string) =>
    /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?$/.test(value.trim());

  return (
    <div className="min-h-screen bg-linear-to-b from-zinc-900 to-black">
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
              className="w-6 h-6 text-muted-foreground"
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
          <p className="text-muted-foreground text-lg font-medium">
            Domain Registration with MPP (Demo)
          </p>
        </header>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">1. Init Client</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="private-key">Private Key</Label>
              <Input
                id="private-key"
                type="password"
                value={privateKey}
                onChange={(e) => {
                  setPrivateKey(e.target.value);
                  resetInitialized();
                }}
                placeholder="0x..."
                className="font-mono"
              />
            </div>

            <Button
              onClick={initializeClient}
              disabled={!privateKey || isInitialized}
              variant={isInitialized ? "secondary" : "default"}
              className="w-full"
              size="lg">
              {isInitialized ? "Client Initialized" : "Initialize MPP Client"}
            </Button>

            {accountAddress && clientInfo && (
              <div className="rounded-lg border border-green-500/50 bg-green-500/5 p-4 space-y-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <CircleCheck className="h-4 w-4 text-green-500 shrink-0" />
                    <p className="text-sm text-green-500 font-medium">Client Initialized</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={`https://explore.tempo.xyz/address/${accountAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-lg text-primary hover:underline break-all">
                      {accountAddress}
                    </a>
                    <CopyButton value={accountAddress} />
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{clientInfo.chain.name}</p>
                </div>
                <Collapsible open={detailsOpen} onOpenChange={setDetailsOpen}>
                  <CollapsibleTrigger className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer select-none">
                    <ChevronRight
                      className={`h-3 w-3 transition-transform ${detailsOpen ? "rotate-90" : ""}`}
                    />
                    Client details
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <pre className="font-mono text-sm text-muted-foreground whitespace-pre-wrap break-all mt-2">
                      {JSON.stringify(clientInfo, null, 2)}
                    </pre>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">2. Endpoints</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Collapsible open={testingOpen} onOpenChange={setTestingOpen}>
              <CollapsibleTrigger className="flex items-center gap-1.5 text-sm font-bold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors cursor-pointer select-none">
                <ChevronRight
                  className={`h-3.5 w-3.5 transition-transform ${testingOpen ? "rotate-90" : ""}`}
                />
                Testing
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="space-y-4 mt-4">
                  <div className="rounded-lg border bg-muted/50 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <p className="font-mono text-sm">mpp.dev/api/ping/paid</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Official MPP test endpoint — $0.10
                      </p>
                    </div>
                    <Button
                      onClick={() => makeRequest("ping-external", "https://mpp.dev/api/ping/paid")}
                      disabled={!isInitialized || !!loadingId}
                      className="shrink-0">
                      {loadingId === "ping-external" ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" /> Send
                        </>
                      ) : (
                        "Send"
                      )}
                    </Button>
                  </div>

                  <div className="rounded-lg border bg-muted/50 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <p className="font-mono text-sm">/api/test-paid</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Local server endpoint — $0.10
                      </p>
                    </div>
                    <Button
                      onClick={() => makeRequest("ping-local", "/api/test-paid")}
                      disabled={!isInitialized || !!loadingId}
                      className="shrink-0">
                      {loadingId === "ping-local" ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" /> Send
                        </>
                      ) : (
                        "Send"
                      )}
                    </Button>
                  </div>

                  <div className="rounded-lg border bg-muted/50 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <p className="font-mono text-sm">/api/test-insufficient-funds</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Insufficient funds test — $999,999,999
                      </p>
                    </div>
                    <Button
                      onClick={() =>
                        makeRequest("ping-insufficient", "/api/test-insufficient-funds")
                      }
                      disabled={!isInitialized || !!loadingId}
                      className="shrink-0">
                      {loadingId === "ping-insufficient" ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" /> Send
                        </>
                      ) : (
                        "Send"
                      )}
                    </Button>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                Domain Registration
              </h3>

              <div className="rounded-lg border bg-muted/50 p-4 space-y-4">
                <div>
                  <p className="font-mono text-sm">/api/register</p>
                  <p className="text-sm text-muted-foreground mt-1">Register a domain on DOMA</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-3">
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label>DOMA Network</Label>
                    <Select
                      value={network}
                      onValueChange={(v) => v && setNetwork(v as "testnet" | "mainnet")}>
                      <SelectTrigger className="w-full">
                        <SelectValue>
                          {network === "testnet" ? "TESTNET" : "MAINNET"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="testnet">TESTNET</SelectItem>
                        <SelectItem value="mainnet">MAINNET</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label>Domain</Label>
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        value={domainName}
                        onChange={(e) => setDomainName(e.target.value)}
                        placeholder="example"
                        className="flex-1 font-mono"
                      />
                      <Select value={domainTld} onValueChange={(v) => v && setDomainTld(v)}>
                        <SelectTrigger className="font-mono">
                          <SelectValue>
                            .{domainTld}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {SUPPORTED_TLDS.map((tld) => (
                            <SelectItem key={tld} value={tld}>
                              .{tld}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={contact.firstName}
                      onChange={(e) => setContact({ ...contact, firstName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={contact.lastName}
                      onChange={(e) => setContact({ ...contact, lastName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2 sm:col-start-1 sm:row-start-2">
                    <Label htmlFor="organization">Organization</Label>
                    <Input
                      id="organization"
                      value={contact.organization}
                      onChange={(e) => setContact({ ...contact, organization: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5 sm:col-start-1 sm:row-start-3">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={contact.email}
                      onChange={(e) => setContact({ ...contact, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5 sm:col-start-2 sm:row-start-3">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={contact.phone}
                      onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2 sm:col-start-3 sm:row-start-1">
                    <Label htmlFor="street">Street</Label>
                    <Input
                      id="street"
                      value={contact.street}
                      onChange={(e) => setContact({ ...contact, street: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5 sm:col-start-3 sm:row-start-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={contact.city}
                      onChange={(e) => setContact({ ...contact, city: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5 sm:col-start-4 sm:row-start-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={contact.state}
                      onChange={(e) => setContact({ ...contact, state: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5 sm:col-start-3 sm:row-start-3">
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input
                      id="postalCode"
                      value={contact.postalCode}
                      onChange={(e) => setContact({ ...contact, postalCode: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5 sm:col-start-4 sm:row-start-3">
                    <Label htmlFor="countryCode">Country</Label>
                    <Input
                      id="countryCode"
                      value={contact.countryCode}
                      onChange={(e) => setContact({ ...contact, countryCode: e.target.value })}
                    />
                  </div>
                </div>

                <Button
                  onClick={() =>
                    makeRequest(
                      `register-${network}`,
                      `/api/register?domain=${encodeURIComponent(domainName.trim() + "." + domainTld)}&network=${network}&address=${encodeURIComponent(accountAddress)}&contact=${encodeURIComponent(JSON.stringify(contact))}`,
                    )
                  }
                  disabled={!isInitialized || !isValidSld(domainName) || !!loadingId}
                  className="w-full"
                  size="lg">
                  {loadingId === `register-${network}` ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Register
                    </>
                  ) : (
                    "Register"
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">3. Request Flow</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingId && trace.length === 0 && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-3 text-muted-foreground">Starting request...</span>
              </div>
            )}

            {trace.length > 0 && (
              <div className="space-y-0">
                {trace.map((step, i) => {
                  const colorMap: Record<string, string> = {
                    request: "text-blue-400 border-blue-500",
                    challenge: "text-purple-400 border-purple-500",
                    credential: "text-cyan-400 border-cyan-500",
                    error: "text-red-400 border-red-500",
                  };
                  const responseColor =
                    step.data && typeof step.data === "object" && "status" in step.data
                      ? (step.data as { status: number }).status === 402
                        ? "text-yellow-400 border-yellow-500"
                        : (step.data as { status: number }).status === 200
                          ? "text-green-400 border-green-500"
                          : "text-red-400 border-red-500"
                      : "text-muted-foreground border-muted-foreground";

                  const colors =
                    step.type === "response"
                      ? responseColor
                      : colorMap[step.type] || "text-muted-foreground border-muted-foreground";

                  const borderColor = colors.split(" ")[1];
                  const textColor = colors.split(" ")[0];

                  const isLast = i === trace.length - 1;
                  const showLine = !isLast || !!loadingId;

                  return (
                    <div key={i} className="flex gap-4">
                      <div className="flex flex-col items-center pt-1.5">
                        <div
                          className={`w-3 h-3 rounded-full border-2 ${borderColor} bg-card shrink-0`}
                        />
                        {showLine && <div className="w-px flex-1 bg-border mt-2" />}
                      </div>
                      <div className="flex-1 pb-5">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-base font-semibold ${textColor}`}>
                            {step.label}
                          </span>
                          {i > 0 && (
                            <span className="text-sm text-muted-foreground">
                              +{step.timestamp - trace[0].timestamp}ms
                            </span>
                          )}
                        </div>
                        <div className="rounded-lg border bg-muted/50 p-3">
                          <pre className="font-mono text-xs text-muted-foreground whitespace-pre-wrap break-all">
                            {JSON.stringify(step.data, null, 2)}
                          </pre>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {loadingId && (
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center pt-1">
                      <div className="w-3 h-3 rounded-full border-2 border-muted-foreground bg-card shrink-0 animate-pulse" />
                    </div>
                    <div className="flex-1 pb-5">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm text-muted-foreground animate-pulse">
                          Processing...
                        </span>
                      </div>
                      <div className="rounded-lg border bg-muted/50 p-3 space-y-2">
                        <div className="h-3 bg-muted rounded animate-pulse w-3/4" />
                        <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
                        <div className="h-3 bg-muted rounded animate-pulse w-2/3" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {!loadingId && trace.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <p>The MPP request/response flow will appear here after sending a request.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-2xl">4. Domain Token Status</CardTitle>
          </CardHeader>
          <CardContent>
            {!tokenStatusLoading && !tokenStatus && (
              <div className="text-center py-12 text-muted-foreground">
                <p>After a successful registration, domain tokenization status will appear here.</p>
              </div>
            )}
            {tokenStatusLoading && (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  <span className="text-muted-foreground">
                    Waiting for token to be minted for{" "}
                    <span className="font-mono text-foreground">{registeredDomain}</span>...
                  </span>
                </div>
                <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
                  <div className="h-3 bg-muted rounded animate-pulse w-1/3" />
                  <div className="h-3 bg-muted rounded animate-pulse w-2/3" />
                  <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
                  <div className="h-3 bg-muted rounded animate-pulse w-3/4" />
                  <div className="h-3 bg-muted rounded animate-pulse w-1/4" />
                </div>
              </div>
            )}
            {tokenStatus && registeredDomain && (() => {
              const appBase = network === "mainnet" ? "https://app.doma.xyz" : "https://app-testnet.doma.xyz";
              const explorerBase = network === "mainnet" ? "https://explorer.doma.xyz" : "https://explorer-testnet.doma.xyz";
              const domainUrl = `${appBase}/domain/${registeredDomain}`;
              const tokenId = tokenStatus.tokenId as string | undefined;
              const contractAddress = tokenStatus.contractAddress as string | undefined;
              const explorerUrl = tokenId && contractAddress
                ? `${explorerBase}/token/${contractAddress}/instance/${tokenId}`
                : null;

              return (
                <div className="space-y-3">
                  <div className="flex items-center gap-x-8 flex-wrap">
                    <div className="flex items-center gap-2">
                      <CircleCheck className="h-5 w-5 text-green-500" />
                      <span className="text-green-500 font-medium">Domain Tokenized</span>
                    </div>
                    <a
                      href={domainUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm text-primary underline">
                      <Gem className="h-4 w-4 shrink-0" />
                      View on Doma
                      <ExternalLink className="h-3 w-3 shrink-0" />
                    </a>
                    {explorerUrl && (
                      <a
                        href={explorerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground underline">
                        <Info className="h-4 w-4 shrink-0" />
                        View on Explorer
                        <ExternalLink className="h-3 w-3 shrink-0" />
                      </a>
                    )}
                    <a
                      href={`https://${registeredDomain}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground underline">
                      <Globe className="h-4 w-4 shrink-0" />
                      Visit Domain
                      <ExternalLink className="h-3 w-3 shrink-0" />
                    </a>
                  </div>
                  <div className="rounded-lg border bg-muted/50 p-4">
                    <pre className="font-mono text-sm text-muted-foreground whitespace-pre-wrap break-all">
                      {JSON.stringify(tokenStatus, null, 2)}
                    </pre>
                  </div>
                </div>
              );
            })()}
          </CardContent>
        </Card>

        <footer className="mt-12 text-center text-muted-foreground text-sm">
          <p>
            Built with{" "}
            <a
              href="https://doma.xyz"
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer">
              DOMA
            </a>
            {" and "}
            <a
              href="https://mpp.dev"
              className="text-primary hover:underline"
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
