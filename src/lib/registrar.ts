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

export async function getPricingAvailability(
  domain: string,
  registrantContact: RegistrantContact,
  network: "testnet" | "mainnet",
): Promise<AvailabilityResult> {
  const dotIndex = domain.indexOf(".");
  const sld = domain.slice(0, dotIndex);
  const tld = domain.slice(dotIndex + 1);

  const { apiUrl, apiKey } = getD3Config(network);

  const searchUrl = `${apiUrl}/v1/partner/search?sld=${encodeURIComponent(sld)}&tld=${encodeURIComponent(tld)}&skip=0&limit=1`;
  const res = await fetch(searchUrl, {
    headers: { "Api-Key": apiKey },
  });

  if (!res.ok) {
    throw new Error(`D3 search failed: ${res.status} ${res.statusText}`);
  }

  const data: { pageItems: Array<{ sld: string; tld: string; status: string; registryUsdPrice: string | null; usdPrice: string | null }> } = await res.json();
  const match = data.pageItems.find((item) => item.sld === sld && item.tld === tld);

  if (!match || match.status !== "available") {
    return { available: false };
  }

  const price = match.registryUsdPrice ?? match.usdPrice ?? "0";
  const order: Order = {
    id: crypto.randomUUID(),
    domain,
    amount: price,
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
