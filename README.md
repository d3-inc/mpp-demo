# Doma MPP

A demo application for domain registration via the [Machine Payments Protocol (MPP)](https://mpp.dev). The server exposes a payment-gated `/api/register` endpoint — clients pay with Tempo stablecoins, and the server registers domains on the Doma blockchain through the D3 registrar.

Built with Next.js, [mppx](https://www.npmjs.com/package/mppx), and [viem](https://viem.sh).

## Setup

```bash
npm install
cp .env.local.example .env.local  # fill in keys
npm run dev
```

## Claude Code Skill

The `skills/doma-mpp/SKILL.md` file is a Claude Code skill that documents how to consume the `/api/register` endpoint using `mppx`. It covers setup, request format, response format, error codes, and the payment flow. Claude Code can use this skill to help build integrations against the API.
