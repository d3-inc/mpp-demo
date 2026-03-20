import { config } from "dotenv";
config({ path: ".env.local" });

import {
  createPublicClient,
  createWalletClient,
  http,
  formatUnits,
  parseUnits,
  erc20Abi,
} from "viem";
import { tempo } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";

const USDC_TOKEN = "0x20C000000000000000000000b9537d11c60E8b50" as const;
const RPC_URL = "https://rpc.tempo.xyz";
const EXPLORER_URL = "https://explore.mainnet.tempo.xyz";
const RESERVE = parseUnits("0.5", 6); // leave $0.50 in sender wallet
const DRY_RUN_AMOUNT = parseUnits("1", 6); // $1 for dry runs

const dryRun = process.argv.includes("--dry-run");

async function main() {
  const senderKey = process.env.TEMPO_RECIPIENT_PRIVATE_KEY;
  const senderAddress = process.env.TEMPO_RECIPIENT_ADDRESS as `0x${string}`;
  const recipientAddress = process.env.DOMA_TESTNET_FUNDER_ADDRESS as `0x${string}`;

  if (!senderKey || !senderAddress || !recipientAddress) {
    throw new Error(
      "Missing TEMPO_RECIPIENT_PRIVATE_KEY, TEMPO_RECIPIENT_ADDRESS, or DOMA_TESTNET_FUNDER_ADDRESS in .env.local",
    );
  }

  const account = privateKeyToAccount(senderKey as `0x${string}`);
  const transport = http(RPC_URL);

  const publicClient = createPublicClient({ chain: tempo, transport });
  const walletClient = createWalletClient({
    chain: tempo,
    transport,
    account,
  });

  // Get balances before transfer
  const [senderBefore, recipientBefore, decimals] = await Promise.all([
    publicClient.readContract({
      address: USDC_TOKEN,
      abi: erc20Abi,
      functionName: "balanceOf",
      args: [senderAddress],
    }),
    publicClient.readContract({
      address: USDC_TOKEN,
      abi: erc20Abi,
      functionName: "balanceOf",
      args: [recipientAddress],
    }),
    publicClient.readContract({
      address: USDC_TOKEN,
      abi: erc20Abi,
      functionName: "decimals",
    }),
  ]);

  const fmt = (v: bigint) => formatUnits(v, decimals);

  console.log("=== Before Transfer ===");
  console.log(`Sender   (${senderAddress}): ${fmt(senderBefore)} USDC`);
  console.log(`Recipient (${recipientAddress}): ${fmt(recipientBefore)} USDC`);
  console.log();

  const sweepable = senderBefore - RESERVE;
  if (sweepable <= BigInt(0)) {
    console.log(
      `Sender balance (${fmt(senderBefore)}) is at or below $0.50 reserve — nothing to sweep.`,
    );
    return;
  }

  const amount = dryRun ? DRY_RUN_AMOUNT : sweepable;
  if (amount > sweepable) {
    console.log(
      `Dry-run amount (${fmt(amount)}) exceeds sweepable balance (${fmt(sweepable)}) — nothing to sweep.`,
    );
    return;
  }

  console.log(
    `${dryRun ? "[DRY RUN] " : ""}Transferring ${fmt(amount)} USDC (leaving ${fmt(senderBefore - amount)} in sender)...`,
  );

  const hash = await walletClient.writeContract({
    address: USDC_TOKEN,
    abi: erc20Abi,
    functionName: "transfer",
    args: [recipientAddress, amount],
  });

  console.log(`Transaction submitted: ${hash}`);
  console.log(`Waiting for confirmation...`);

  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  console.log(`Confirmed in block ${receipt.blockNumber} (status: ${receipt.status})`);
  console.log();

  // Get balances after transfer
  const [senderAfter, recipientAfter] = await Promise.all([
    publicClient.readContract({
      address: USDC_TOKEN,
      abi: erc20Abi,
      functionName: "balanceOf",
      args: [senderAddress],
    }),
    publicClient.readContract({
      address: USDC_TOKEN,
      abi: erc20Abi,
      functionName: "balanceOf",
      args: [recipientAddress],
    }),
  ]);

  console.log("=== After Transfer ===");
  console.log(`Sender   (${senderAddress}): ${fmt(senderAfter)} USDC`);
  console.log(`Recipient (${recipientAddress}): ${fmt(recipientAfter)} USDC`);
  console.log();
  console.log(`Explorer: ${EXPLORER_URL}/tx/${hash}`);
}

main().catch(console.error);
