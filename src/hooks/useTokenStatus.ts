"use client";

import { useEffect, useReducer, useRef } from "react";

interface State {
  status: Record<string, unknown> | null;
  loading: boolean;
}

type Action =
  | { type: "start" }
  | { type: "done"; status: Record<string, unknown> };

function reducer(_state: State, action: Action): State {
  switch (action.type) {
    case "start":
      return { status: null, loading: true };
    case "done":
      return { status: action.status, loading: false };
  }
}

export function useTokenStatus(
  domain: string | null,
  network: "testnet" | "mainnet",
) {
  const [state, dispatch] = useReducer(reducer, { status: null, loading: false });
  const lastDomainRef = useRef<string | null>(null);

  useEffect(() => {
    if (!domain || domain === lastDomainRef.current) return;
    lastDomainRef.current = domain;

    const dot = domain.indexOf(".");
    if (dot === -1) return;
    const sld = domain.slice(0, dot);
    const tld = domain.slice(dot + 1);

    dispatch({ type: "start" });

    let interval: ReturnType<typeof setInterval> | null = null;
    let cancelled = false;

    const poll = async () => {
      try {
        const res = await fetch(
          `/api/token-status?sld=${encodeURIComponent(sld)}&tld=${encodeURIComponent(tld)}&network=${network}`,
        );
        if (cancelled) return;
        if (res.ok) {
          const data = await res.json();
          if (data.status === "registered" || data.status === "waiting_for_finalization") {
            dispatch({ type: "done", status: data });
            if (interval) clearInterval(interval);
            interval = null;
          }
        }
      } catch {
        // keep polling
      }
    };

    poll();
    interval = setInterval(poll, 3000);

    return () => {
      cancelled = true;
      if (interval) clearInterval(interval);
    };
  }, [domain, network]);

  return { tokenStatus: state.status, tokenStatusLoading: state.loading };
}
