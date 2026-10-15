import type { IncomingMessage, ServerResponse } from "node:http";
import { handleEvent } from "./analytics.ts";

export async function eventsHttp(request: IncomingMessage & { body?: unknown }, response: ServerResponse) {
  response.setHeader("Cache-Control", "no-store");
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.setHeader("X-Content-Type-Options", "nosniff");
  try {
    let body = request.body;
    if (request.method === "POST" && body === undefined) {
      const chunks: Buffer[] = [];
      let size = 0;
      for await (const chunk of request) {
        size += Buffer.byteLength(chunk);
        if (size > 512) { response.writeHead(413); response.end('{"code":"invalid_body"}'); return; }
        chunks.push(Buffer.from(chunk));
      }
      try { body = JSON.parse(Buffer.concat(chunks).toString("utf8")); } catch { body = null; }
    }
    if (body !== undefined && Buffer.byteLength(JSON.stringify(body)) > 512) {
      response.writeHead(413); response.end('{"code":"invalid_body"}'); return;
    }
    const result = await handleEvent({ method: request.method || "GET", origin: request.headers.origin,
      contentType: request.headers["content-type"], body }, process.env);
    if (result.status === 405) response.setHeader("Allow", "POST");
    response.writeHead(result.status); response.end(JSON.stringify(result.body));
  } catch { response.writeHead(500); response.end('{"code":"unexpected"}'); }
}
