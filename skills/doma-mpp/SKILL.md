---
name: doma-mpp
description: How to consume the Doma MPP domain registration API — a payment-gated endpoint using the Machine Payments Protocol (HTTP 402). Use this skill whenever the user wants to register domains via MPP, call the Doma /register API, make paid API requests with mppx, or work with HTTP 402 payment flows for domain registration. Also trigger when code imports mppx, mppx/client, or the user mentions MPP, paid APIs, or payment-gated endpoints in the context of domain registration.
---

# Consuming the Doma MPP /register API

The Doma domain registration API is gated behind the Machine Payments Protocol (MPP). When you call the endpoint, the server returns HTTP 402 Payment Required with a payment challenge. The `mppx` client library handles this automatically — it pays via Tempo stablecoins and retries the request, so your code just calls `fetch()` and gets back the result.

## Setup

Install dependencies:

```bash
npm install mppx viem
```

Create an account from a private key:

```ts
import { privateKeyToAccount } from "viem/accounts"
import { Mppx, tempo } from "mppx/client"

const account = privateKeyToAccount("0x<PRIVATE_KEY>")

// This polyfills global fetch to auto-handle 402 payment challenges
Mppx.create({ methods: [tempo({ account })] })
```

If you prefer not to polyfill global fetch:

```ts
const mppx = Mppx.create({
  polyfill: false,
  methods: [tempo({ account })],
})

// Use mppx.fetch instead of global fetch
const response = await mppx.fetch(url)
```

## The /register endpoint

```
GET /api/register/{network}?domain={domain}
```

| Parameter | Location | Values | Description |
|-----------|----------|--------|-------------|
| `network` | path | `"testnet"` or `"mainnet"` | Which Doma network to register on |
| `domain` | query | e.g. `"example.com"` | The domain name to register |

**Cost: $12.88 per request** (paid automatically via MPP/Tempo).

### Example request

```ts
import { privateKeyToAccount } from "viem/accounts"
import { Mppx, tempo } from "mppx/client"

const account = privateKeyToAccount("0x<PRIVATE_KEY>")
Mppx.create({ methods: [tempo({ account })] })

// Register a domain on testnet
const response = await fetch("https://<HOST>/api/register/testnet?domain=example.com")
const data = await response.json()
console.log(data)
```

### Success response (200)

```json
{
  "success": true,
  "domain": "example.com",
  "network": "testnet",
  "tokenId": "20719405654568256184282804044567699961418926341258048728655171573148113774124",
  "contractAddress": "0x424bDf2E8a6F52Bd2c1C81D9437b0DC0309DF90f",
  "expiresAt": "2027-03-17T00:00:00.000Z",
  "url": "https://app-testnet.doma.xyz/domain/example.com",
  "explorerUrl": "https://explorer-testnet.doma.xyz/token/0x424bDf2E8a6F52Bd2c1C81D9437b0DC0309DF90f/instance/20719405..."
}
```

For mainnet, URLs use `app.doma.xyz` and `explorer.doma.xyz` instead of the `-testnet` variants.

### Error responses

- **400** — Invalid network (not `testnet` or `mainnet`) or missing `domain` query parameter
- **402** — Payment required (handled automatically by `mppx`)

## How the payment flow works under the hood

You don't need to manage this yourself — `mppx` does it automatically — but for understanding:

1. Client sends `GET /api/register/testnet?domain=example.com`
2. Server returns **402 Payment Required** with a `WWW-Authenticate` header containing a payment challenge
3. `mppx` extracts the challenge, signs a payment credential using the Tempo account
4. `mppx` retries the request with an `Authorization` header containing the credential
5. Server verifies payment and returns **200** with the registration result and a `Payment-Receipt` header

## Reading the payment receipt

After a successful request, you can inspect the payment receipt:

```ts
import { Receipt } from "mppx"

const response = await fetch("https://<HOST>/api/register/testnet?domain=example.com")
const receipt = Receipt.fromResponse(response)

console.log(receipt.status)    // "success"
console.log(receipt.reference) // transaction hash
console.log(receipt.timestamp) // payment timestamp
```

## Key constants

| Constant | Value |
|----------|-------|
| PathUSD token (Tempo) | `0x20c0000000000000000000000000000000000000` |
| Test recipient address | `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266` |
| Tempo testnet chain ID | `42431` |
| Registration cost | $12.88 USD |

## CLI usage

You can also test from the command line:

```bash
npx mppx account create              # Create a Tempo account (auto-funded on testnet)
npx mppx https://<HOST>/api/register/testnet?domain=example.com
```
