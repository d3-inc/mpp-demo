export const SUPPORTED_TLDS = [
  "com",
  "xyz",
  "ai",
  "io",
  "net",
  "cash",
  "live",
] as const;

export interface RegistrantContact {
  firstName: string;
  lastName: string;
  organization: string;
  email: string;
  phone: string;
  phoneCountryCode: string;
  fax: string;
  faxCountryCode: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  countryCode: string;
}

export const DEFAULT_CONTACT: RegistrantContact = {
  firstName: "John",
  lastName: "Doe",
  organization: "Example Inc",
  email: "john.doe@example.com",
  phone: "4151234567",
  phoneCountryCode: "+1",
  fax: "4151234567",
  faxCountryCode: "+1",
  street: "1234 Market St",
  city: "San Francisco",
  state: "CA",
  postalCode: "94103",
  countryCode: "US",
};

export interface Order {
  domain: string;
  amount: string; // human-readable USD (e.g. "29.99")
  registrantContact: RegistrantContact;
  voucher: D3Voucher;
  voucherSignature: string;
}

interface RegistrationResult {
  success: true;
  domain: string;
  network: string;
  txHash: string;
  paymentContract: string;
  voucherAmount: string;
}

function getD3Config(network: "testnet" | "mainnet") {
  const apiUrl =
    network === "mainnet"
      ? process.env.DOMA_MAINNET_API_URL
      : process.env.DOMA_TESTNET_API_URL;
  const apiKey =
    network === "mainnet"
      ? process.env.DOMA_MAINNET_API_KEY
      : process.env.DOMA_TESTNET_API_KEY;

  if (!apiUrl || !apiKey) {
    throw new Error(`Missing D3 API config for ${network}`);
  }

  return { apiUrl: apiUrl.replace(/\/+$/, ""), apiKey };
}

export interface D3PaymentOption {
  networkId: string;
  chainName: string;
  contractAddress: string;
  tokenAddress: string | null;
  symbol: string | null;
}

export interface D3Voucher {
  paymentId: string;
  amount: string;
  token: string;
  buyer: string;
  voucherExpiration: number;
  orderId: string;
}

export interface D3OrderResult {
  voucher: D3Voucher;
  signature: string;
}

export async function getD3PaymentOptions(
  network: "testnet" | "mainnet",
  tld?: string,
): Promise<D3PaymentOption[]> {
  const { apiUrl, apiKey } = getD3Config(network);
  const url = tld
    ? `${apiUrl}/v1/partner/payment/options?tld=${encodeURIComponent(tld)}`
    : `${apiUrl}/v1/partner/payment/options`;
  const res = await fetch(url, { headers: { "Api-Key": apiKey } });
  if (!res.ok) throw new Error(`D3 payment options failed: ${res.status}`);
  const data: { options: D3PaymentOption[] } = await res.json();
  return data.options;
}

export async function createD3Order(
  sld: string,
  tld: string,
  buyerAddress: string,
  registrantContact: RegistrantContact,
  network: "testnet" | "mainnet",
): Promise<D3OrderResult> {
  const { apiUrl, apiKey } = getD3Config(network);

  const paymentContract =
    network === "mainnet"
      ? process.env.DOMA_MAINNET_PAYMENT_CONTRACT
      : process.env.DOMA_TESTNET_PAYMENT_CONTRACT;
  const networkId = network === "mainnet" ? "eip155:97477" : "eip155:97476";

  if (!paymentContract) throw new Error(`Missing DOMA_${network.toUpperCase()}_PAYMENT_CONTRACT`);

  const res = await fetch(`${apiUrl}/v1/partner/order`, {
    method: "POST",
    headers: { "Api-Key": apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({
      paymentOptions: {
        contractAddress: paymentContract,
        networkId,
        tokenAddress: null, // native ETH
        buyerAddress,
      },
      names: [{ sld, tld, autoRenew: false, domainLength: 1 }],
      couponCode: null,
      registrantContact,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`D3 order failed: ${res.status} ${body}`);
  }

  return res.json();
}

/** Reconstruct an Order from HMAC-verified challenge meta. */
export function orderFromMeta(
  meta: Record<string, string>,
  registrantContact: RegistrantContact,
): Order {
  return {
    domain: meta.domain,
    amount: meta.amount,
    registrantContact,
    voucher: JSON.parse(meta.voucher) as D3Voucher,
    voucherSignature: meta.voucherSignature,
  };
}

const PAYMENT_CONTRACT_ABI = [
  {
    name: "pay",
    type: "function",
    stateMutability: "payable",
    inputs: [
      {
        name: "voucher",
        type: "tuple",
        components: [
          { name: "buyer", type: "address" },
          { name: "token", type: "address" },
          { name: "amount", type: "uint256" },
          { name: "voucherExpiration", type: "uint256" },
          { name: "paymentId", type: "string" },
          { name: "orderId", type: "string" },
        ],
      },
      { name: "signature", type: "bytes" },
    ],
    outputs: [],
  },
] as const;

export async function processRegistration(
  order: Order,
  network: "testnet" | "mainnet",
): Promise<RegistrationResult> {
  const paymentContract =
    network === "mainnet"
      ? process.env.DOMA_MAINNET_PAYMENT_CONTRACT
      : process.env.DOMA_TESTNET_PAYMENT_CONTRACT;
  const funderKey =
    network === "mainnet"
      ? process.env.DOMA_MAINNET_FUNDER_KEY
      : process.env.DOMA_TESTNET_FUNDER_KEY;

  if (!paymentContract || !funderKey) {
    throw new Error(`Missing payment config for ${network}`);
  }

  const { createWalletClient, createPublicClient, http } = await import("viem");
  const { privateKeyToAccount } = await import("viem/accounts");
  const { domaTestnet, doma } = await import("@/lib/chains");

  const chain = network === "mainnet" ? doma : domaTestnet;
  const account = privateKeyToAccount(funderKey as `0x${string}`);

  const walletClient = createWalletClient({
    account,
    chain,
    transport: http(),
  });

  const publicClient = createPublicClient({
    chain,
    transport: http(),
  });

  const { voucher, voucherSignature } = order;

  const txHash = await walletClient.writeContract({
    address: paymentContract as `0x${string}`,
    abi: PAYMENT_CONTRACT_ABI,
    functionName: "pay",
    args: [
      {
        buyer: voucher.buyer as `0x${string}`,
        token: voucher.token as `0x${string}`,
        amount: BigInt(voucher.amount),
        voucherExpiration: BigInt(voucher.voucherExpiration),
        paymentId: voucher.paymentId,
        orderId: voucher.orderId,
      },
      voucherSignature as `0x${string}`,
    ],
    value: BigInt(voucher.amount), // send ETH with the tx
  });

  await publicClient.waitForTransactionReceipt({ hash: txHash });

  return {
    success: true,
    domain: order.domain,
    network,
    txHash,
    paymentContract,
    voucherAmount: voucher.amount,
  };
}
