import { Mppx, tempo } from "mppx/nextjs";

function createMppx(testnet: boolean) {
  return Mppx.create({
    methods: [
      tempo({
        currency: "0x20c0000000000000000000000000000000000000",
        recipient: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        testnet,
      }),
    ],
  });
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const network = url.searchParams.get("network");
  const mppx = createMppx(network !== "mainnet");

  return mppx.charge({ amount: "0.10" })(() =>
    Response.json({
      success: true,
      message: "Payment received! You paid $0.10 for this request.",
      timestamp: new Date().toISOString(),
    }),
  )(request);
}
