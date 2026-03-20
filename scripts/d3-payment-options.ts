import { config } from "dotenv";
config({ path: ".env.local" });

const TLDS = ["com", "xyz", "ai", "io", "net", "cc", "land", "world", "cash", "live"];

interface PaymentOption {
  chainName?: string;
  networkId?: string | number;
  contractAddress?: string;
  tokenAddress?: string;
  symbol?: string;
}

async function fetchOptions(label: string, apiUrl: string, apiKey: string) {
  console.log(`=== ${label} ===`);
  const base = apiUrl.replace(/\/+$/, "");

  for (const tld of TLDS) {
    const url = `${base}/v1/partner/payment/options?tld=${tld}`;
    const res = await fetch(url, { headers: { "Api-Key": apiKey } });
    const data = (await res.json()) as { options?: PaymentOption[] };
    const opts = data.options ?? [];
    if (opts.length === 0) {
      console.log(`  .${tld}: (none)`);
      continue;
    }
    // Only show Doma chain options for brevity
    const domaOpts = opts.filter((o) => o.chainName?.toLowerCase().includes("doma"));
    if (domaOpts.length > 0) {
      for (const o of domaOpts) {
        console.log(
          `  .${tld}: ${o.chainName} (${o.networkId}) contract=${o.contractAddress} token=${o.tokenAddress} symbol=${o.symbol}`,
        );
      }
    } else {
      console.log(`  .${tld}: ${opts.length} options (no Doma chain)`);
      for (const o of opts) {
        console.log(
          `    ${o.chainName} (${o.networkId}) contract=${o.contractAddress} token=${o.tokenAddress} symbol=${o.symbol}`,
        );
      }
    }
  }
}

async function main() {
  await fetchOptions(
    "TESTNET",
    process.env.DOMA_TESTNET_API_URL!,
    process.env.DOMA_TESTNET_API_KEY!,
  );
  console.log();
  await fetchOptions(
    "MAINNET",
    process.env.DOMA_MAINNET_API_URL!,
    process.env.DOMA_MAINNET_API_KEY!,
  );
}
main().catch(console.error);
