"use client";

import { privateKeyToAccount } from "viem/accounts";
import { Mppx, tempo } from "mppx/client";

let initialized = false;

export function initMppClient(privateKey?: `0x${string}`) {
  if (initialized) return;

  const key = privateKey || (process.env.NEXT_PUBLIC_MPP_PRIVATE_KEY as `0x${string}`) || undefined;

  if (!key) {
    console.warn(
      "MPP Client: No private key provided. Set NEXT_PUBLIC_MPP_PRIVATE_KEY or pass a key to initMppClient().",
    );
    return;
  }

  const account = privateKeyToAccount(key);

  Mppx.create({
    methods: [tempo({ account })],
  });

  initialized = true;
  console.log("MPP Client initialized with account:", account.address);
}

export function createMppFetch(privateKey: `0x${string}`) {
  const account = privateKeyToAccount(privateKey);

  const mppx = Mppx.create({
    polyfill: false,
    methods: [tempo({ account })],
  });

  return mppx.fetch;
}
