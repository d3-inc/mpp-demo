import { Mppx, tempo } from "mppx/nextjs";
import { Credential, Challenge } from "mppx";
import {
  SUPPORTED_TLDS,
  searchAvailability,
  createD3Order,
  orderFromMeta,
  processRegistration,
  DEFAULT_CONTACT,
  type RegistrantContact,
} from "@/lib/registrar";

// PathUSD on testnet, USDC on mainnet
const TEMPO_CURRENCY = {
  testnet: "0x20c0000000000000000000000000000000000000",
  mainnet: "0x20C000000000000000000000b9537d11c60E8b50",
} as const;

function createMppx(testnet: boolean) {
  return Mppx.create({
    methods: [
      tempo({
        currency: TEMPO_CURRENCY[testnet ? "testnet" : "mainnet"],
        recipient: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        testnet,
      }),
    ],
  });
}

export async function GET(request: Request) {
  const url = new URL(request.url);

  const network = url.searchParams.get("network");

  if (network !== "mainnet" && network !== "testnet") {
    return Response.json(
      { error: "Invalid network. Use 'mainnet' or 'testnet'." },
      { status: 400 },
    );
  }

  const mppx = createMppx(network === "testnet");

  const domain = url.searchParams.get("domain");

  if (!domain) {
    return Response.json({ error: "Missing 'domain' query parameter." }, { status: 400 });
  }

  const dotIndex = domain.indexOf(".");
  if (dotIndex === -1) {
    return Response.json(
      { error: "Domain must include a TLD (e.g. example.com)." },
      { status: 400 },
    );
  }

  const tld = domain.slice(dotIndex + 1);
  if (!(SUPPORTED_TLDS as readonly string[]).includes(tld)) {
    return Response.json(
      { error: `Unsupported TLD '${tld}'. Supported: ${SUPPORTED_TLDS.join(", ")}` },
      { status: 400 },
    );
  }

  // Parse registrant contact from query param, fall back to defaults
  let registrantContact: RegistrantContact = DEFAULT_CONTACT;
  const contactParam = url.searchParams.get("contact");
  if (contactParam) {
    try {
      registrantContact = { ...DEFAULT_CONTACT, ...JSON.parse(contactParam) };
    } catch {
      // Use defaults
    }
  }

  const sld = domain.slice(0, dotIndex);

  // On the retry, reconstruct the order from the credential's HMAC-verified meta.
  if (request.headers.has("Authorization")) {
    const credential = Credential.fromRequest(request);
    const meta = Challenge.meta(credential.challenge);

    if (!meta?.domain || !meta?.amount || !meta?.voucher) {
      return Response.json({ error: "Invalid or missing order metadata." }, { status: 400 });
    }

    const order = orderFromMeta(meta, registrantContact);

    const handler = mppx.charge({
      amount: order.amount,
      description: `Register ${domain}`,
      meta: {
        domain: order.domain,
        amount: order.amount,
        voucher: JSON.stringify(order.voucher),
        voucherSignature: order.voucherSignature,
      },
    })(async () => {
      try {
        const result = await processRegistration(order, network);
        return Response.json({ ...result, order });
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return Response.json({ error: message }, { status: 500 });
      }
    });

    return handler(request);
  }

  // Initial request — check availability + USD price, create ETH order for voucher, issue 402
  const search = await searchAvailability(sld, tld, network);
  if (!search.available || !search.usdPrice) {
    return Response.json(
      { error: `Domain '${domain}' is not available for registration.` },
      { status: 409 },
    );
  }

  // Use the MPP payer's address as the domain owner (tokenized to this wallet).
  // The funder wallet pays on-chain, but the buyer address determines ownership.
  const ownerAddress = url.searchParams.get("address");
  if (!ownerAddress) {
    return Response.json({ error: "Missing 'address' query parameter." }, { status: 400 });
  }

  let d3Order;
  try {
    d3Order = await createD3Order(sld, tld, ownerAddress, registrantContact, network);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return Response.json(
      { error: message },
      { status: 409 },
    );
  }

  const { voucher, signature } = d3Order;
  const amount = parseFloat(search.usdPrice).toFixed(2);

  const handler = mppx.charge({
    amount,
    description: `Register ${domain}`,
    meta: {
      domain,
      amount,
      voucher: JSON.stringify(voucher),
      voucherSignature: signature,
    },
  })(async () => {
    // Won't run on initial request (no credential → 402)
    return Response.json({ error: "Unexpected" }, { status: 500 });
  });

  return handler(request);
}
