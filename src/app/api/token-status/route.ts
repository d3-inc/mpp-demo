export async function GET(request: Request) {
  const url = new URL(request.url);
  const sld = url.searchParams.get("sld");
  const tld = url.searchParams.get("tld");
  const network = url.searchParams.get("network") as "testnet" | "mainnet" | null;

  if (!sld || !tld || !network) {
    return Response.json({ error: "Missing sld, tld, or network" }, { status: 400 });
  }

  const apiUrl =
    network === "mainnet"
      ? process.env.DOMA_MAINNET_API_URL
      : process.env.DOMA_TESTNET_API_URL;
  const apiKey =
    network === "mainnet"
      ? process.env.DOMA_MAINNET_API_KEY
      : process.env.DOMA_TESTNET_API_KEY;

  if (!apiUrl || !apiKey) {
    return Response.json({ error: "Missing API config" }, { status: 500 });
  }

  const res = await fetch(
    `${apiUrl.replace(/\/+$/, "")}/v1/partner/token/${encodeURIComponent(sld)}/${encodeURIComponent(tld)}`,
    { headers: { "Api-Key": apiKey } },
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { imageURL: _, ...body } = await res.json();
  return Response.json(body, { status: res.status });
}
