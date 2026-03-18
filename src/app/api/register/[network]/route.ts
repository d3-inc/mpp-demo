import { Mppx, tempo } from "mppx/nextjs";

const mppx = Mppx.create({
  methods: [
    tempo({
      currency: "0x20c0000000000000000000000000000000000000",
      recipient: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      testnet: true,
    }),
  ],
});

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const GET = mppx.charge({ amount: "12.88" })(async (request: Request) => {
  const url = new URL(request.url);

  // Extract network from path: /api/register/[network]
  const segments = url.pathname.split("/");
  const network = segments[segments.length - 1];

  if (network !== "mainnet" && network !== "testnet") {
    return Response.json({ error: "Invalid network. Use 'mainnet' or 'testnet'." }, { status: 400 });
  }

  const domain = url.searchParams.get("domain");

  if (!domain) {
    return Response.json({ error: "Missing 'domain' query parameter." }, { status: 400 });
  }

  // Simulate registration work
  await sleep(5000);

  const expiration = new Date();
  expiration.setFullYear(expiration.getFullYear() + 1);

  // Generate a fake token ID from the domain name
  const encoder = new TextEncoder();
  const hashBuffer = await crypto.subtle.digest("SHA-256", encoder.encode(domain));
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const tokenId = BigInt("0x" + hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")).toString();

  const contractAddress =
    network === "mainnet"
      ? "0x424bDf2E8a6F52Bd2c1C81D9437b0DC0309DF90f"
      : "0x424bDf2E8a6F52Bd2c1C81D9437b0DC0309DF90f";

  const domaBase =
    network === "mainnet" ? "https://app.doma.xyz" : "https://app-testnet.doma.xyz";

  const explorerBase =
    network === "mainnet" ? "https://explorer.doma.xyz" : "https://explorer-testnet.doma.xyz";

  return Response.json({
    success: true,
    domain,
    network,
    tokenId,
    contractAddress,
    expiresAt: expiration.toISOString(),
    url: `${domaBase}/domain/${domain}`,
    explorerUrl: `${explorerBase}/token/${contractAddress}/instance/${tokenId}`,
  });
});
