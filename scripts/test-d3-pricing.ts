import { config } from "dotenv";
import { SUPPORTED_TLDS, DEFAULT_CONTACT, getD3PaymentOptions } from "../src/lib/registrar";
config({ path: ".env.local" });

const NETWORK = "testnet" as const;
const FUNDER_ADDRESS = process.env.DOMA_TESTNET_FUNDER_ADDRESS!;

function randomSld() {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  const suffix = Array.from(
    { length: 6 },
    () => chars[Math.floor(Math.random() * chars.length)],
  ).join("");
  return `doma-testquote-${suffix}`;
}

async function main() {
  // Use CLI arg if provided (e.g. "doma.com"), otherwise random
  const arg = process.argv[2];
  let sld: string, tld: string;
  if (arg && arg.includes(".")) {
    const dot = arg.indexOf(".");
    sld = arg.slice(0, dot);
    tld = arg.slice(dot + 1);
  } else {
    tld = SUPPORTED_TLDS[Math.floor(Math.random() * SUPPORTED_TLDS.length)];
    sld = randomSld();
  }
  const domain = `${sld}.${tld}`;
  const apiUrl = process.env.DOMA_TESTNET_API_URL!.replace(/\/+$/, "");
  const apiKey = process.env.DOMA_TESTNET_API_KEY!;

  console.log(`\n--- Testing: ${domain} ---\n`);

  // 1. Search
  console.log("1. D3 search...");
  const searchRes = await fetch(
    `${apiUrl}/v1/partner/search?sld=${sld}&tld=${tld}&skip=0&limit=1`,
    {
      headers: { "Api-Key": apiKey },
    },
  );
  const searchData = await searchRes.json();
  const match = searchData.pageItems?.[0];

  console.log(`   Status: ${match?.status ?? "not found"}`);
  console.log(`   registryUsdPrice:   $${match?.registryUsdPrice}`);
  console.log(`   registryNativePrice: ${match?.registryNativePrice} ${match?.nativeCurrency}`);

  // 2. Payment options
  console.log(`\n2. Payment options for .${tld}...`);
  const options = await getD3PaymentOptions(NETWORK, tld);
  const domaUsdc = options.find((o) => o.networkId === "eip155:97476" && o.symbol === "USDC");
  if (!domaUsdc) {
    console.log("   No USDC option found for Doma Testnet");
    return;
  }
  console.log(`   Using: ${domaUsdc.chainName} USDC (${domaUsdc.networkId})`);
  console.log(`   Contract: ${domaUsdc.contractAddress}`);
  console.log(`   Token: ${domaUsdc.tokenAddress}`);

  // 3. Create order with USDC
  console.log(`\n3. Create order (USDC)...`);
  const orderRes = await fetch(`${apiUrl}/v1/partner/order`, {
    method: "POST",
    headers: { "Api-Key": apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({
      paymentOptions: {
        contractAddress: domaUsdc.contractAddress,
        networkId: domaUsdc.networkId,
        tokenAddress: domaUsdc.tokenAddress,
        buyerAddress: FUNDER_ADDRESS,
      },
      names: [{ sld, tld, autoRenew: false, domainLength: 1 }],
      couponCode: null,
      registrantContact: DEFAULT_CONTACT,
    }),
  });

  if (!orderRes.ok) {
    console.log(`   Order failed: ${orderRes.status} ${await orderRes.text()}`);
    return;
  }

  const { voucher, signature } = await orderRes.json();
  const voucherExpDate = new Date(voucher.voucherExpiration * 1000);
  const expiresIn = Math.round((voucherExpDate.getTime() - Date.now()) / 1000 / 60);
  const usdcAmount = Number(voucher.amount) / 1e6;

  console.log(`   orderId:  ${voucher.orderId}`);
  console.log(`   amount:   ${voucher.amount} (raw)`);
  console.log(`   amount:   ${usdcAmount} USDC`);
  console.log(`   token:    ${voucher.token}`);
  console.log(`   buyer:    ${voucher.buyer}`);
  console.log(`   expires:  ${voucherExpDate.toISOString()} (in ${expiresIn} min)`);
  console.log(`   sig:      ${signature.slice(0, 20)}...`);

  // 4. Compare
  console.log(`\n4. Comparison:`);
  console.log(`   Search USD price:    $${match.registryUsdPrice}`);
  console.log(`   USDC voucher:        $${usdcAmount}`);
  console.log(`   Match?               ${match.registryUsdPrice === String(usdcAmount)}`);
  console.log();
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
