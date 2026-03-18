export const SUPPORTED_TLDS = [
  "com",
  "xyz",
  "ai",
  "io",
  "net",
  "cc",
  "land",
  "world",
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
  id: string;
  domain: string;
  amount: string;
  registrantContact: RegistrantContact;
}

interface AvailabilityResult {
  available: boolean;
  order?: Order;
}

interface RegistrationResult {
  success: true;
  domain: string;
  network: string;
  tokenId: string;
  contractAddress: string;
  expiresAt: string;
  url: string;
  explorerUrl: string;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getPricingAvailability(
  domain: string,
  registrantContact: RegistrantContact,
): Promise<AvailabilityResult> {
  // Simulate pricing lookup
  await sleep(5000);

  // TODO: check real availability
  // if (!available) return { available: false };

  // Random price between $5.01 and $25.99
  const price = 5.01 + Math.random() * 20.98;
  const order: Order = {
    id: crypto.randomUUID(),
    domain,
    amount: price.toFixed(2),
    registrantContact,
  };

  return { available: true, order };
}

/** Reconstruct an Order from HMAC-verified challenge meta. */
export function orderFromMeta(
  meta: Record<string, string>,
  registrantContact: RegistrantContact,
): Order {
  return {
    id: meta.orderId,
    domain: meta.domain,
    amount: meta.amount,
    registrantContact,
  };
}

export async function processRegistration(
  order: Order,
  network: "testnet" | "mainnet",
): Promise<RegistrationResult> {
  // Simulate registration work
  await sleep(5000);

  const expiration = new Date();
  expiration.setFullYear(expiration.getFullYear() + 1);

  const encoder = new TextEncoder();
  const hashBuffer = await crypto.subtle.digest("SHA-256", encoder.encode(order.domain));
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const tokenId = BigInt(
    "0x" + hashArray.map((b) => b.toString(16).padStart(2, "0")).join(""),
  ).toString();

  const contractAddress = "0x424bDf2E8a6F52Bd2c1C81D9437b0DC0309DF90f";

  const domaBase =
    network === "mainnet" ? "https://app.doma.xyz" : "https://app-testnet.doma.xyz";
  const explorerBase =
    network === "mainnet" ? "https://explorer.doma.xyz" : "https://explorer-testnet.doma.xyz";

  return {
    success: true,
    domain: order.domain,
    network,
    tokenId,
    contractAddress,
    expiresAt: expiration.toISOString(),
    url: `${domaBase}/domain/${order.domain}`,
    explorerUrl: `${explorerBase}/token/${contractAddress}/instance/${tokenId}`,
  };
}
