import { Mppx, tempo } from "mppx/nextjs";

const mppx = Mppx.create({
  methods: [
    tempo({
      currency: "0x20c0000000000000000000000000000000000000", // PathUSD on Tempo
      recipient: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", // Test recipient address
      testnet: true, // Enable testnet mode (chainId 42431)
    }),
  ],
});

export const GET = mppx.charge({ amount: "0.10" })(() =>
  Response.json({
    success: true,
    message: "Payment received! You paid $0.10 for this request.",
    timestamp: new Date().toISOString(),
  }),
);
