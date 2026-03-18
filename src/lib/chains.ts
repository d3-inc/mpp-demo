export { domaTestnet } from "viem/chains";
import { defineChain } from "viem";

export const doma = defineChain({
  id: 97_477,
  name: "Doma",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: { http: ["https://rpc.doma.xyz"] },
  },
  blockExplorers: {
    default: {
      name: "Doma Explorer",
      url: "https://explorer.doma.xyz",
    },
  },
});
