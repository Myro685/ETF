import type { IncomingMessage, ServerResponse } from "node:http";
import { guideHttp } from "../server/http.ts";
export default function handler(
  request: IncomingMessage & { body?: unknown },
  response: ServerResponse,
) {
  return guideHttp("submit", request, response);
}
