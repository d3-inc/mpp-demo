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

# Getting started \[The mppx TypeScript library]

## Overview

The `mppx` TypeScript library provides a typed interface over the Machine Payments Protocol, from high-level abstractions to low-level primitives and building blocks.

<div className="flex gap-2">
  <SdkBadge.GitHub repo="wevm/mppx" />

<SdkBadge.Maintainer name="Wevm" href="https://github.com/wevm" />

</div>

## Install

:::code-group

```bash [npm]
npm install mppx
```

```bash [pnpm]
pnpm add mppx
```

```bash [bun]
bun add mppx
```

:::

## Quick start

This quick start guide shows you how to use `mppx` with the [`tempo` payment method](/payment-methods/tempo).

You can apply the same patterns to [other payment methods](/payment-methods).

<Tabs stateKey="quickstart">
  <Tab title="Client">
    <div className="space-y-4">
      ::::steps

      #### Install peer dependencies

      In this example, you use the `viem` library to instantiate an account.

      :::code-group

      ```bash [npm]
      npm install viem
      ```

      ```bash [pnpm]
      pnpm add viem
      ```

      ```bash [bun]
      bun add viem
      ```

      :::

      #### Define an account

      Next, define an account to sign payments.

      ```ts twoslash [define-account.ts]
      import { privateKeyToAccount } from 'viem/accounts'

      const account = privateKeyToAccount('0xabc…123')
      ```

      :::tip
      When using Tempo, you can also use [Passkey or WebCrypto accounts](https://viem.sh/tempo/accounts).
      :::

      #### Create payment handler

      Call `Mppx.create` at startup. This polyfills the global `fetch` to automatically handle `402` payment challenges.

      ```ts twoslash [create-paid-fetch.ts]
      import { privateKeyToAccount } from 'viem/accounts'
      import { Mppx, tempo } from 'mppx/client' // [!code hl]

      const account = privateKeyToAccount('0xabc…123')

      Mppx.create({ // [!code hl]
        methods: [tempo({ account })], // [!code hl]
      }) // [!code hl]
      ```

      :::tip
      If you want to avoid polyfilling, use the returned `fetch` instead.

      ```ts
      const mppx = Mppx.create({
        polyfill: false, // [!code hl]
        methods: [tempo({ account })]
      })

      const response = await mppx.fetch('https://mpp.dev/api/ping/paid') // [!code hl]
      ```

      :::

      #### Request protected resources

      Use `fetch`. Payment happens when a server returns `402`.

      ```ts twoslash [fetch-resource.ts]
      const response = await fetch('https://mpp.dev/api/ping/paid')
      ```

      ::::
    </div>

  </Tab>

  <Tab title="Server">
    <div className="space-y-4">
      #### Framework mode

      Use the framework-specific middleware from `mppx` to integrate payment into your server. Each middleware handles the `402` challenge/credential flow and attaches receipts automatically.

      ::::code-group

      ```ts [Next.js]
      import { Mppx, tempo } from 'mppx/nextjs'

      // [!code hl:start]
      const mppx = Mppx.create({
        methods: [tempo({
          currency: '0x20c0000000000000000000000000000000000000',
          recipient: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
        })],
      })
      // [!code hl:end]

      export const GET =
        mppx.charge({ amount: '0.1' }) // [!code hl]
        (() => Response.json({ data: '...' }))
      ```

      ```ts [Hono]
      import { Hono } from 'hono'
      import { Mppx, tempo } from 'mppx/hono'

      const app = new Hono()

      // [!code hl:start]
      const mppx = Mppx.create({
        methods: [tempo({
          currency: '0x20c0000000000000000000000000000000000000',
          recipient: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
        })],
      })
      // [!code hl:end]

      app.get(
        '/resource',
        mppx.charge({ amount: '0.1' }), // [!code hl]
        (c) => c.json({ data: '...' }),
      )
      ```

      ```ts [Elysia]
      import { Elysia } from 'elysia'
      import { Mppx, tempo } from 'mppx/elysia'

      // [!code hl:start]
      const mppx = Mppx.create({
        methods: [tempo({
          currency: '0x20c0000000000000000000000000000000000000',
          recipient: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
        })],
      })
      // [!code hl:end]

      const app = new Elysia()
        .guard(
          { beforeHandle: mppx.charge({ amount: '0.1' }) }, // [!code hl]
          (app) => app.get('/resource', () => ({ data: '...' })),
        )
      ```

      ```ts [Express]
      import express from 'express'
      import { Mppx, tempo } from 'mppx/express'

      const app = express()

      // [!code hl:start]
      const mppx = Mppx.create({
        methods: [tempo({
          currency: '0x20c0000000000000000000000000000000000000',
          recipient: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
        })],
      })
      // [!code hl:end]

      app.get(
        '/resource',
        mppx.charge({ amount: '0.1' }), // [!code hl]
        (req, res) => res.json({ data: '...' }))
      ```

      ::::

      :::tip
      You can also override `currency` and `recipient` per call if different routes need different payment configurations.

      ```ts
      mppx.charge({
        amount: '0.1',
        currency: '0x…', // [!code ++]
        recipient: '0x…', // [!code ++]
      })
      ```

      :::

      :::note
      Don't see your framework? `mppx` is designed to be framework-agnostic. See [Manual mode](#manual-mode) below.
      :::

      <div className="h-2" />

      ***

      <div className="h-px" />

      #### Manual mode

      If you prefer full control over the payment flow, use `mppx/server` directly with the Fetch API.

      ```ts twoslash
      import { Mppx, tempo } from 'mppx/server'

      const mppx = Mppx.create({
        methods: [tempo({
          currency: '0x20c0000000000000000000000000000000000000',
          recipient: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
        })],
      })

      // [!code focus:start]
      export async function handler(request: Request) {
        const response = await mppx.charge({ amount: '0.1' })(request)
        // [!code focus:end]

        // Payment required: send 402 response with challenge
        if (response.status === 402) return response.challenge

        // Payment verified: attach receipt and return resource
        return response.withReceipt(Response.json({ data: '...' }))
      }
      ```

      :::info\[Currency and recipient values]
      `currency` is the TIP-20 token contract address—`0x20c0…` is PathUSD on Tempo. `recipient` is the address that receives payment. See [Tempo payment method](/payment-methods/tempo) for supported tokens.
      :::

      The intent handler accepts a [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)-compatible request object, and returns a `Response` object.

      The Fetch API is compatible with most server frameworks, including: [Hono](https://hono.dev), [Deno](https://deno.com), [Cloudflare Workers](https://workers.dev), [Next.js](https://nextjs.org),
      [Bun](https://bun.sh), and other Fetch API-compatible frameworks.

      :::tip
      You can also override `currency` and `recipient` per call if different routes need different payment configurations.

      ```ts
      const response = await mppx.charge({
        amount: '0.1',
        currency: '0x…', // [!code ++]
        recipient: '0x…', // [!code ++]
      })(request)
      ```

      :::

      <div className="h-2" />

      ***

      <div className="h-px" />

      ## Node.js & Express compatibility

      If your framework doesn't support the **Fetch API** (for example, Express or Node.js), you're likely interfacing with the [Node.js Request Listener API](https://nodejs.org/api/http.html#httpcreateserveroptions-requestlistener).

      Use the `Mppx.toNodeListener` helper to transform the handler into a Node.js-compatible listener.

      ```ts twoslash
      import { Mppx, tempo } from 'mppx/server'

      const mppx = Mppx.create({
        methods: [tempo({
          currency: '0x20c0000000000000000000000000000000000000',
          recipient: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
        })],
      })

      type IncomingMessage = import('node:http').IncomingMessage
      type ServerResponse = import('node:http').ServerResponse
      // ---cut---
      export async function handler(req: IncomingMessage, res: ServerResponse) {
        const response = await Mppx.toNodeListener( // [!code ++]
          mppx.charge({ amount: '0.1' })
        )(req, res) // [!code ++]

        // Payment required: send 402 response with challenge
        if (response.status === 402) return response.challenge

        // Payment verified: attach receipt and return resource
        return response.withReceipt(Response.json({ data: '...' }))
      }
      ```
    </div>

  </Tab>

  <Tab title="CLI">
    <div className="space-y-4">
      The `mppx` package install automatically includes a [CLI tool](/sdk/typescript/cli) you can use to make the same request from the command line.

      ::::steps

      #### Create an account

      Create a Tempo account to sign payments. The account is auto-funded on testnet and key is stored in your system keychain.

      :::code-group

      ```bash [npm]
      $ npx mppx account create
      ```

      ```bash [pnpm]
      $ pnpm mppx account create
      ```

      ```bash [bun]
      $ bunx mppx account create
      ```

      :::

      #### Make a paid request

      Run the CLI with a URL to make a paid request. Payment is handled automatically when the server returns `402`.

      :::code-group

      ```bash [npm]
      $ npx mppx https://mpp.dev/api/ping/paid
      ```

      ```bash [pnpm]
      $ pnpm mppx https://mpp.dev/api/ping/paid
      ```

      ```bash [bun]
      $ bunx mppx https://mpp.dev/api/ping/paid
      ```

      :::

      ::::
    </div>

  </Tab>
</Tabs>
