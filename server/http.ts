import type { IncomingMessage, ServerResponse } from "node:http";
import { handleGuide } from "./guide.ts";
export async function guideHttp(
  kind: "config" | "submit",
  request: IncomingMessage & { body?: unknown },
  response: ServerResponse,
) {
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
        if (size > 2048) {
          response.writeHead(413);
          response.end(JSON.stringify({ code: "invalid_body" }));
          return;
        }
        chunks.push(Buffer.from(chunk));
      }
      try {
        body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
      } catch {
        body = null;
      }
    }
    if (body !== undefined && Buffer.byteLength(JSON.stringify(body)) > 2048) {
      response.writeHead(413);
      response.end(JSON.stringify({ code: "invalid_body" }));
      return;
    }
    const result = await handleGuide(
      {
        kind,
        method: request.method || "GET",
        body,
        origin: request.headers.origin,
        contentType: request.headers["content-type"],
      },
      process.env,
    );
    if (result.status === 405)
      response.setHeader("Allow", kind === "config" ? "GET" : "POST");
    if (result.status === 429) response.setHeader("Retry-After", "3600");
    response.writeHead(result.status);
    response.end(JSON.stringify(result.body));
  } catch {
    response.writeHead(500);
    response.end(JSON.stringify({ code: "unexpected" }));
  }
}
