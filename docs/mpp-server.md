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

# `tempo` \[Register all Tempo intents]

Convenience function that creates both `tempo.charge` and `tempo.session` method intents with shared configuration.

## Usage

```ts twoslash
import { Mppx, tempo } from "mppx/server";

Mppx.create({
  methods: [
    // [!code focus:start]
    tempo(),
    // [!code focus:end]
  ],
});
```

This is equivalent to:

```ts twoslash
import { Mppx, tempo } from "mppx/server";

Mppx.create({
  methods: [tempo.charge(), tempo.session()],
});
```

## Return type

```ts
type ReturnType = readonly [Method.Server, Method.Server];
```

A tuple of `[charge, session]` methods. `Mppx.create` accepts tuples in the `methods` array and flattens them automatically.

## Parameters

Accepts the union of [`tempo.charge`](/sdk/typescript/server/Method.tempo.charge) and [`tempo.session`](/sdk/typescript/server/Method.tempo.session) parameters. The most common are listed below.

### currency (optional)

- **Type:** `Address`

Default TIP-20 token address for the payment currency.

### decimals (optional)

- **Type:** `number`
- **Default:** `6`

Decimal places for amount parsing.

### feePayer (optional)

- **Type:** `Account`

Account for sponsoring transaction fees.

### getClient (optional)

- **Type:** `(parameters: { chainId?: number }) => MaybePromise<Client>`

Function that returns a viem client for the given chain ID. Overrides the default RPC configuration.

### recipient (optional)

- **Type:** `Address`

Default recipient address for payments.

### testnet (optional)

- **Type:** `boolean`

Testnet mode. Defaults the chain ID to `42431` (Tempo testnet).
