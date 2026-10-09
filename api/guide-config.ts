import type { IncomingMessage, ServerResponse } from "node:http";
import { guideHttp } from "../server/http.ts";
export default function handler(
  request: IncomingMessage,
  response: ServerResponse,
) {
  return guideHttp("config", request, response);
}
