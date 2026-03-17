import { NextRequest } from "next/server";

let cachedJwt: string | null = null;
let jwtExpiry: number = 0;

async function getVercelJwt(): Promise<string> {
  if (cachedJwt && Date.now() < jwtExpiry) {
    return cachedJwt;
  }

  const password = process.env.VERCEL_AUTH_KEY;
  if (!password) {
    throw new Error("VERCEL_AUTH_KEY not configured");
  }

  const response = await fetch("https://mpp.dev/", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `_vercel_password=${encodeURIComponent(password)}`,
    redirect: "manual",
  });

  const setCookie = response.headers.get("set-cookie");
  if (!setCookie) {
    throw new Error("Failed to authenticate with Vercel");
  }

  const jwtMatch = setCookie.match(/_vercel_jwt=([^;]+)/);
  if (!jwtMatch) {
    throw new Error("JWT not found in response");
  }

  cachedJwt = jwtMatch[1];
  jwtExpiry = Date.now() + 7 * 24 * 60 * 60 * 1000; // Cache for 7 days

  return cachedJwt;
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return Response.json({ error: "URL parameter required" }, { status: 400 });
  }

  if (!url.startsWith("https://mpp.dev/")) {
    return Response.json({ error: "Only mpp.dev URLs are allowed" }, { status: 400 });
  }

  try {
    const jwt = await getVercelJwt();

    const headers = new Headers();
    headers.set("Cookie", `_vercel_jwt=${jwt}`);

    const authHeader = request.headers.get("Authorization");
    if (authHeader) {
      headers.set("Authorization", authHeader);
    }

    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    const responseHeaders = new Headers();
    response.headers.forEach((value, key) => {
      if (!["set-cookie", "transfer-encoding", "content-encoding"].includes(key.toLowerCase())) {
        responseHeaders.set(key, value);
      }
    });

    const body = await response.text();

    return new Response(body, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Proxy error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return Response.json({ error: "URL parameter required" }, { status: 400 });
  }

  if (!url.startsWith("https://mpp.dev/")) {
    return Response.json({ error: "Only mpp.dev URLs are allowed" }, { status: 400 });
  }

  try {
    const jwt = await getVercelJwt();

    const headers = new Headers();
    headers.set("Cookie", `_vercel_jwt=${jwt}`);

    const authHeader = request.headers.get("Authorization");
    if (authHeader) {
      headers.set("Authorization", authHeader);
    }

    const contentType = request.headers.get("Content-Type");
    if (contentType) {
      headers.set("Content-Type", contentType);
    }

    const body = await request.text();

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: body || undefined,
    });

    const responseHeaders = new Headers();
    response.headers.forEach((value, key) => {
      if (!["set-cookie", "transfer-encoding", "content-encoding"].includes(key.toLowerCase())) {
        responseHeaders.set(key, value);
      }
    });

    const responseBody = await response.text();

    return new Response(responseBody, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Proxy error" },
      { status: 500 },
    );
  }
}
