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
GET /api/register?domain={domain}&network={network}&address={address}&contact={contact}
```

| Parameter | Location | Required | Description |
|-----------|----------|----------|-------------|
| `domain` | query | yes | Full domain including TLD (e.g. `example.com`) |
| `network` | query | yes | `"testnet"` or `"mainnet"` |
| `address` | query | yes | Caller's wallet address (domain is tokenized to this wallet) |
| `contact` | query | no | URL-encoded JSON registrant contact info (defaults to placeholder) |

**Supported TLDs:** `com`, `xyz`, `ai`, `io`, `net`, `cash`, `live`, `fyi`

**Cost:** Dynamic — the server looks up the real USD price from the D3 registrar API. Payment is handled automatically via MPP/Tempo.

### Registrant contact format

The `contact` parameter is a URL-encoded JSON object. If omitted, defaults are used. The fields are for ICANN domain registration:

```ts
interface RegistrantContact {
  firstName: string
  lastName: string
  organization: string
  email: string
  phone: string
  phoneCountryCode: string  // e.g. "+1"
  fax: string
  faxCountryCode: string
  street: string
  city: string
  state: string
  postalCode: string
  countryCode: string       // ISO 3166-1 alpha-2, e.g. "US"
}
```

### Example request

```ts
import { privateKeyToAccount } from "viem/accounts"
import { Mppx, tempo } from "mppx/client"

const account = privateKeyToAccount("0x<PRIVATE_KEY>")
Mppx.create({ methods: [tempo({ account })] })

const domain = "example.com"
const network = "testnet"
const address = account.address

const contact = JSON.stringify({
  firstName: "Jane",
  lastName: "Smith",
  organization: "Acme Inc",
  email: "jane@acme.com",
  phone: "4151234567",
  phoneCountryCode: "+1",
  fax: "4151234567",
  faxCountryCode: "+1",
  street: "123 Main St",
  city: "San Francisco",
  state: "CA",
  postalCode: "94103",
  countryCode: "US",
})

const url = `/api/register?domain=${encodeURIComponent(domain)}&network=${network}&address=${encodeURIComponent(address)}&contact=${encodeURIComponent(contact)}`

const response = await fetch(url)
const data = await response.json()
console.log(data)
```

### Success response (200)

```json
{
  "success": true,
  "domain": "example.com",
  "network": "testnet",
  "txHash": "0xabc123...",
  "paymentContract": "0x9aC6761B5A1006E09C60a0BE10cd1C9d32911e96",
  "voucherAmount": "29990000000000000000",
  "order": {
    "domain": "example.com",
    "amount": "29.99",
    "registrantContact": { ... },
    "voucher": { ... },
    "voucherSignature": "0x..."
  }
}
```

### Error responses

| Status | Meaning |
|--------|---------|
| **400** | Invalid network, missing domain, missing address, domain missing TLD, unsupported TLD, or invalid order metadata |
| **402** | Payment required (handled automatically by `mppx`) |
| **409** | Domain not available for registration |
| **500** | On-chain registration transaction failed |

## How the payment flow works under the hood

You don't need to manage this yourself — `mppx` does it automatically — but for understanding:

1. Client sends `GET /api/register?domain=example.com&network=testnet`
2. Server checks domain availability via the D3 Partner API and creates a payment order (voucher)
3. Server returns **402 Payment Required** with a `WWW-Authenticate` header containing a payment challenge. The challenge includes HMAC-signed metadata (domain, amount, voucher) so the order survives the retry.
4. `mppx` extracts the challenge, signs a payment credential using the Tempo account
5. `mppx` retries the request with an `Authorization` header containing the credential
6. Server reconstructs the order from the HMAC-verified challenge metadata, executes the on-chain payment contract (`pay()` function), waits for the transaction receipt, and returns the result

## Reading the payment receipt

After a successful request, you can inspect the payment receipt:

```ts
import { Receipt } from "mppx"

const response = await fetch("/api/register?domain=example.com&network=testnet")
const receipt = Receipt.fromResponse(response)

console.log(receipt.status)    // "success"
console.log(receipt.reference) // transaction hash
console.log(receipt.timestamp) // payment timestamp
```

## Key constants

| Constant | Value |
|----------|-------|
| PathUSD token (testnet) | `0x20c0000000000000000000000000000000000000` |
| USDC token (mainnet) | `0x20C000000000000000000000b9537d11c60E8b50` |
| Tempo recipient address | `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266` |
| Tempo testnet chain ID | `42431` |
| Doma testnet chain ID | `97476` |
| Doma mainnet chain ID | `97477` |
| Testnet payment contract | `0x9aC6761B5A1006E09C60a0BE10cd1C9d32911e96` |
| Mainnet payment contract | `0xD000000000002C74F45Adc7b59d48dCE207eAcd2` |
| D3 testnet API | `https://api-testnet.d3.app/` |
| D3 mainnet API | `https://api-public.d3.app/` |

## CLI usage

You can also test from the command line:

```bash
npx mppx account create    # Create a Tempo account (auto-funded on testnet)
npx mppx "https://<HOST>/api/register?domain=example.com&network=testnet"
```
