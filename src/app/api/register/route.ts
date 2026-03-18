import { Mppx, tempo } from "mppx/nextjs";
import { Credential, Challenge } from "mppx";
import {
  SUPPORTED_TLDS,
  createD3Order,
  orderFromMeta,
  processRegistration,
  DEFAULT_CONTACT,
  type RegistrantContact,
} from "@/lib/registrar";

const ALLOWED_MAINNET_ADDRESSES = new Set(
  (process.env.ALLOWED_DOMA_MAINNET_ADDRESSES || "")
    .split(",")
    .map((a) => a.trim().toLowerCase())
    .filter(Boolean),
);

const mppx = Mppx.create({
  methods: [
    tempo({
      currency: "0x20c0000000000000000000000000000000000000",
      recipient: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      testnet: true,
    }),
  ],
});

export async function GET(request: Request) {
  const url = new URL(request.url);

  const network = url.searchParams.get("network");

  if (network !== "mainnet" && network !== "testnet") {
    return Response.json(
      { error: "Invalid network. Use 'mainnet' or 'testnet'." },
      { status: 400 },
    );
  }

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

  // Restrict mainnet to allowed addresses (check early, before payment)
  if (network === "mainnet") {
    const address = url.searchParams.get("address")?.toLowerCase();
    if (!address || !ALLOWED_MAINNET_ADDRESSES.has(address)) {
      return Response.json(
        { error: "This account is not authorized for mainnet registration." },
        { status: 403 },
      );
    }
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

    // Verified mainnet check — credential.source is cryptographically bound to the payer's key
    if (network === "mainnet") {
      const payerAddress = credential.source?.split(":").pop()?.toLowerCase();
      if (!payerAddress || !ALLOWED_MAINNET_ADDRESSES.has(payerAddress)) {
        return Response.json(
          { error: "This account is not authorized for mainnet registration." },
          { status: 403 },
        );
      }
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
      const result = await processRegistration(order, network);
      return Response.json({ ...result, order });
    });

    return handler(request);
  }

  // Initial request — create D3 order to get voucher + USDC price, then issue 402
  const funderAddress =
    network === "mainnet"
      ? process.env.DOMA_MAINNET_FUNDER_ADDRESS!
      : process.env.DOMA_TESTNET_FUNDER_ADDRESS!;

  let d3Order;
  try {
    d3Order = await createD3Order(sld, tld, funderAddress, registrantContact, network);
  } catch {
    return Response.json(
      { error: `Domain '${domain}' is not available for registration.` },
      { status: 409 },
    );
  }

  const { voucher, signature } = d3Order;
  // TODO: charge real price — for now hardcode $10 while paying D3 in ETH
  const amount = "10.00";

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
