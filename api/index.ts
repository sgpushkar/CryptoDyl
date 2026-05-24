import server from "../dist/server/server.js";

function toRequest(req: {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  url?: string;
  body?: unknown;
}) {
  const proto = req.headers["x-forwarded-proto"] ?? "https";
  const host = req.headers.host ?? "localhost";
  const url = new URL(req.url ?? "/", `${proto}://${host}`);

  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (value == null) continue;
    if (Array.isArray(value)) {
      for (const item of value) headers.append(key, item);
    } else {
      headers.set(key, value);
    }
  }

  const init: RequestInit = {
    method: req.method ?? "GET",
    headers,
  };

  if (req.body != null && req.method && !["GET", "HEAD"].includes(req.method)) {
    init.body = req.body as BodyInit;
  }

  return new Request(url, init);
}

async function sendResponse(
  response: Response,
  res: {
    statusCode: number;
    setHeader(name: string, value: string | string[]): void;
    end(chunk?: string | Buffer): void;
  },
) {
  res.statusCode = response.status;
  response.headers.forEach((value, key) => {
    if (key.toLowerCase() === "set-cookie") {
      const existing = response.headers.getSetCookie?.() ?? [value];
      res.setHeader(key, existing);
      return;
    }
    res.setHeader(key, value);
  });

  const body = await response.arrayBuffer();
  res.end(Buffer.from(body));
}

export default async function handler(
  req: {
    method?: string;
    headers: Record<string, string | string[] | undefined>;
    url?: string;
    body?: unknown;
  },
  res: {
    statusCode: number;
    setHeader(name: string, value: string | string[]): void;
    end(chunk?: string | Buffer): void;
  },
) {
  const request = toRequest(req);
  const response = await server.fetch(request, {}, {});
  await sendResponse(response, res);
}
