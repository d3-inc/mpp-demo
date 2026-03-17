<!--
Sitemap:
- [Page Not Found](/404)
- [Brand](/brand): MPP brand assets and guidelines
- [Frequently asked questions](/faq): Common questions about the Machine Payments Protocol
- [Machine Payments Protocol](/overview): The open protocol for machine-to-machine payments
- [Payment methods](/payment-methods/): Available methods and how to choose one
- [Protocol overview](/protocol/): Standardizing HTTP 402 for machine-to-machine payments
- [Quickstart](/quickstart/): Get started with MPP in minutes
- [SDKs](/sdk/): Official implementations in multiple languages
- [Build with an LLM](/guides/building-with-an-llm): Use llms-full.txt to give your agent complete MPP context.
- [Accept multiple payment methods](/guides/multiple-payment-methods): Stablecoins, cards, and Bitcoin on a single endpoint
- [Accept one-time payments](/guides/one-time-payments): Charge per request with a payment-gated API
- [Accept pay-as-you-go payments](/guides/pay-as-you-go): Session-based billing with payment channels
- [Accept streamed payments](/guides/streamed-payments): Per-token billing over Server-Sent Events
- [Charge](/intents/charge): Immediate one-time payments
- [Card](/payment-methods/card/): Card payments via encrypted network tokens
- [Custom](/payment-methods/custom): Build your own payment method
- [Lightning](/payment-methods/lightning/): Bitcoin payments over the Lightning Network
- [Stripe](/payment-methods/stripe/): Cards, wallets, and other Stripe supported payment methods
- [Tempo](/payment-methods/tempo/): Stablecoin payments on the Tempo blockchain
- [Challenges](/protocol/challenges): Server-issued payment requirements
- [Credentials](/protocol/credentials): Client-submitted payment proofs
- [HTTP 402 payment required](/protocol/http-402): The status code that signals payment is required
- [Receipts](/protocol/receipts): Server acknowledgment of successful payment
- [Transports](/protocol/transports/): HTTP and MCP bindings for payment flows
- [Use with agents](/quickstart/agent): Connect your agent to MPP-enabled services
- [Use with your app](/quickstart/client): Handle payment-gated resources automatically
- [Add payments to your API](/quickstart/server): Charge for access to protected resources
- [Python SDK](/sdk/python/): The pympp Python library
- [Rust SDK](/sdk/rust/): The mpp Rust library
- [Getting started](/sdk/typescript/): The mppx TypeScript library
- [Card charge](/payment-methods/card/charge): One-time payments using encrypted network tokens
- [Lightning charge](/payment-methods/lightning/charge): One-time payments using BOLT11 invoices
- [Lightning session](/payment-methods/lightning/session): Pay-as-you-go payments over Lightning
- [Stripe charge](/payment-methods/stripe/charge): One-time payments using Shared Payment Tokens
- [Tempo charge](/payment-methods/tempo/charge): One-time TIP-20 token transfers
- [Session](/payment-methods/tempo/session): Low-cost high-throughput payments
- [HTTP transport](/protocol/transports/http): Payment flows using standard HTTP headers
- [MCP and JSON-RPC transport](/protocol/transports/mcp): Payment flows for AI tool calls
- [Client](/sdk/python/client): Handle 402 responses automatically
- [Core Types](/sdk/python/core): Challenge, Credential, and Receipt primitives
- [Server](/sdk/python/server): Protect endpoints with payment requirements
- [Client](/sdk/rust/client): Handle 402 responses automatically
- [Core types](/sdk/rust/core): Challenge, Credential, and Receipt primitives
- [Server](/sdk/rust/server): Protect endpoints with payment requirements
- [CLI Reference](/sdk/typescript/cli): Built-in command-line tool for paid HTTP requests
- [Method.from](/sdk/typescript/Method.from): Create a payment method from a definition
- [Proxy](/sdk/typescript/proxy): Paid API proxy
- [McpClient.wrap](/sdk/typescript/client/McpClient.wrap): Payment-aware MCP client
- [stripe](/sdk/typescript/client/Method.stripe): Register all Stripe intents
- [Method.stripe.charge](/sdk/typescript/client/Method.stripe.charge): One-time payments via Shared Payment Tokens
- [tempo](/sdk/typescript/client/Method.tempo): Register all Tempo intents
- [Method.tempo.charge](/sdk/typescript/client/Method.tempo.charge): One-time payments
- [Method.tempo.session](/sdk/typescript/client/Method.tempo.session): Low-cost high-throughput payments
- [tempo.session](/sdk/typescript/client/Method.tempo.session-manager): Standalone session manager
- [Mppx.create](/sdk/typescript/client/Mppx.create): Create a payment-aware fetch client
- [Mppx.restore](/sdk/typescript/client/Mppx.restore): Restore the original global fetch
- [Transport.from](/sdk/typescript/client/Transport.from): Create a custom transport
- [Transport.http](/sdk/typescript/client/Transport.http): HTTP transport for payments
- [Transport.mcp](/sdk/typescript/client/Transport.mcp): MCP transport for payments
- [BodyDigest.compute](/sdk/typescript/core/BodyDigest.compute): Compute a body digest hash
- [BodyDigest.verify](/sdk/typescript/core/BodyDigest.verify): Verify a body digest hash
- [Challenge.deserialize](/sdk/typescript/core/Challenge.deserialize): Deserialize a Challenge from a header
- [Challenge.from](/sdk/typescript/core/Challenge.from): Create a new Challenge
- [Challenge.fromHeaders](/sdk/typescript/core/Challenge.fromHeaders): Extract a Challenge from Headers
- [Challenge.fromMethod](/sdk/typescript/core/Challenge.fromMethod): Create a Challenge from a method
- [Challenge.fromResponse](/sdk/typescript/core/Challenge.fromResponse): Extract a Challenge from a Response
- [Challenge.meta](/sdk/typescript/core/Challenge.meta): Extract correlation data from a Challenge
- [Challenge.serialize](/sdk/typescript/core/Challenge.serialize): Serialize a Challenge to a header
- [Challenge.verify](/sdk/typescript/core/Challenge.verify): Verify a Challenge HMAC
- [Credential.deserialize](/sdk/typescript/core/Credential.deserialize): Deserialize a Credential from a header
- [Credential.from](/sdk/typescript/core/Credential.from): Create a new Credential
- [Credential.fromRequest](/sdk/typescript/core/Credential.fromRequest): Extract a Credential from a Request
- [Credential.serialize](/sdk/typescript/core/Credential.serialize): Serialize a Credential to a header
- [Expires](/sdk/typescript/core/Expires): Generate relative expiration timestamps
- [Method.from](/sdk/typescript/core/Method.from): Create a payment method definition
- [Method.toClient](/sdk/typescript/core/Method.toClient): Extend a method with client logic
- [Method.toServer](/sdk/typescript/core/Method.toServer): Extend a method with server verification
- [PaymentRequest.deserialize](/sdk/typescript/core/PaymentRequest.deserialize): Deserialize a payment request
- [PaymentRequest.from](/sdk/typescript/core/PaymentRequest.from): Create a payment request
- [PaymentRequest.serialize](/sdk/typescript/core/PaymentRequest.serialize): Serialize a payment request to a string
- [Receipt.deserialize](/sdk/typescript/core/Receipt.deserialize): Deserialize a Receipt from a header
- [Receipt.from](/sdk/typescript/core/Receipt.from): Create a new Receipt
- [Receipt.fromResponse](/sdk/typescript/core/Receipt.fromResponse): Extract a Receipt from a Response
- [Receipt.serialize](/sdk/typescript/core/Receipt.serialize): Serialize a Receipt to a string
- [Elysia](/sdk/typescript/middlewares/elysia): Payment middleware for Elysia
- [Express](/sdk/typescript/middlewares/express): Payment middleware for Express
- [Hono](/sdk/typescript/middlewares/hono): Payment middleware for Hono
- [Next.js](/sdk/typescript/middlewares/nextjs): Payment middleware for Next.js
- [stripe](/sdk/typescript/server/Method.stripe): Register all Stripe intents
- [Method.stripe.charge](/sdk/typescript/server/Method.stripe.charge): One-time payments via Shared Payment Tokens
- [tempo](/sdk/typescript/server/Method.tempo): Register all Tempo intents
- [Method.tempo.charge](/sdk/typescript/server/Method.tempo.charge): One-time stablecoin payments
- [Method.tempo.session](/sdk/typescript/server/Method.tempo.session): Low-cost high-throughput payments
- [Mppx.compose](/sdk/typescript/server/Mppx.compose): Present multiple payment options
- [Mppx.create](/sdk/typescript/server/Mppx.create): Create a server-side payment handler
- [Mppx.toNodeListener](/sdk/typescript/server/Mppx.toNodeListener): Adapt payments for Node.js HTTP
- [Request.toNodeListener](/sdk/typescript/server/Request.toNodeListener): Convert Fetch handlers to Node.js
- [Response.requirePayment](/sdk/typescript/server/Response.requirePayment): Create a 402 response
- [Transport.from](/sdk/typescript/server/Transport.from): Create a custom transport
- [Transport.http](/sdk/typescript/server/Transport.http): HTTP server-side transport
- [Transport.mcp](/sdk/typescript/server/Transport.mcp): Raw JSON-RPC MCP transport
- [Transport.mcpSdk](/sdk/typescript/server/Transport.mcpSdk): MCP SDK server-side transport
-->

# Use with your app \[Handle payment-gated resources automatically]

## Overview

Polyfill the global `fetch` to handle `402` responses. Your existing code works unchanged—payments happen in the background. Pick the path that suits you:

- [**Prompt mode**](#prompt-mode): paste a prompt into your coding agent for fast setup
- [**Manual mode**](#manual-mode): step-by-step setup with `mppx/client`

## Prompt mode

Paste this into your coding agent to set up your client with `mppx` in one prompt:

<ClientPrompt />

## Manual mode

::::steps

### Install dependencies

:::code-group

```bash [npm]
npm install mppx viem
```

```bash [pnpm]
pnpm add mppx viem
```

```bash [bun]
bun add mppx viem
```

:::

### Define an account

```ts twoslash
import { privateKeyToAccount } from "viem/accounts";

const account = privateKeyToAccount("0xabc…123");
```

:::tip
With Tempo, you can also use [Passkey or WebCrypto accounts](https://viem.sh/tempo/accounts).
:::

### Create payment handler

Call `Mppx.create` at startup. This polyfills the global `fetch` to automatically handle `402` payment challenges.

```ts twoslash
import { privateKeyToAccount } from "viem/accounts";
import { Mppx, tempo } from "mppx/client"; // [!code hl]

const account = privateKeyToAccount("0xabc…123");

Mppx.create({
  // [!code hl]
  methods: [tempo({ account })], // [!code hl]
}); // [!code hl]
```

:::tip
If you want to avoid polyfilling, use the bound `fetch` instead.

```ts
const mppx = Mppx.create({
  polyfill: false, // [!code hl]
  methods: [tempo({ account })],
});

const response = await mppx.fetch("https://mpp.dev/api/ping/paid"); // [!code hl]
```

:::

### Request protected resources

Use `fetch`. Payment happens when a server returns `402`.

```ts
const response = await fetch("https://mpp.dev/api/ping/paid");
```

::::

## Learn more

### Wagmi

You can inject a [Wagmi](https://wagmi.sh) connector into Mppx by passing the `getConnectorClient` function.

:::code-group

```ts twoslash [example.ts]
import { createConfig, http } from "wagmi";
import { getConnectorClient } from "wagmi/actions";
import { tempoModerato } from "viem/chains";
import { Mppx, tempo } from "mppx/client";

declare const connectors: Parameters<typeof createConfig>[0]["connectors"];
// ---cut---
const config = createConfig({
  connectors,
  chains: [tempoModerato],
  transports: {
    [tempoModerato.id]: http(),
  },
});

Mppx.create({
  methods: [
    tempo({
      getClient: (parameters) => getConnectorClient(config, parameters as any),
    }),
  ],
});
```

```ts twoslash [config.ts]
import { createConfig, http } from "wagmi";
import { webAuthn, KeyManager } from "wagmi/tempo";
import { tempoModerato } from "viem/chains";

declare const keyManager: KeyManager.KeyManager;
// ---cut---
export const config = createConfig({
  connectors: [webAuthn({ keyManager })],
  chains: [tempoModerato],
  transports: {
    [tempoModerato.id]: http(),
  },
});
```

:::

### Per-request accounts

Pass accounts on individual requests instead of at setup:

```ts twoslash
import { privateKeyToAccount } from "viem/accounts";
import { Mppx, tempo } from "mppx/client";

const mppx = Mppx.create({
  polyfill: false,
  methods: [tempo()],
});

const response = await mppx.fetch("https://mpp.dev/api/ping/paid", {
  // [!code hl:start]
  context: {
    account: privateKeyToAccount("0xabc…123"),
  },
  // [!code hl:end]
});
```

### Manual payment handling

Use `Mppx.create` for full control over the payment flow:

- Present payment UI before paying
- Implement custom retry logic
- Handle credentials manually

```ts twoslash
import { Mppx, tempo } from "mppx/client";
import { privateKeyToAccount } from "viem/accounts";

const mppx = Mppx.create({
  // [!code hl:start]
  polyfill: false,
  // [!code hl:end]
  methods: [tempo()],
});

// [!code hl:start]
const response = await fetch("https://mpp.dev/api/ping/paid");

if (response.status === 402) {
  const credential = await mppx.createCredential(response, {
    account: privateKeyToAccount("0x..."),
  });

  const paidResponse = await fetch("https://mpp.dev/api/ping/paid", {
    headers: { Authorization: credential },
  });
}
// [!code hl:end]
```

### Payment receipts

On success, the server returns a `Payment-Receipt` header:

```ts
import { Receipt } from "mppx";

const response = await fetch("https://mpp.dev/api/ping/paid");

const receipt = Receipt.fromResponse(response); // [!code hl]

console.log(receipt.status);
// @log: success
console.log(receipt.reference);
// @log: 0xtx789abc...
console.log(receipt.timestamp);
// @log: 2025-01-15T12:00:00Z
```

## Next steps

<Cards>
  <ServerQuickstartCard />

  <TempoMethodCard />

  <MppxCreateReferenceCard to="/sdk/typescript/client/Mppx.create" />
</Cards>
