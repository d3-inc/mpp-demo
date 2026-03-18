import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return Response.json({ error: "URL parameter required" }, { status: 400 });
  }

  if (!url.startsWith("https://mpp.dev/")) {
    return Response.json({ error: "Only mpp.dev URLs are allowed" }, { status: 400 });
  }

  try {
    const headers = new Headers();

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
    const headers = new Headers();

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
