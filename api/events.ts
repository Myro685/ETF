import type { IncomingMessage, ServerResponse } from "node:http";
import { eventsHttp } from "../server/analytics-http.ts";
export default function handler(request: IncomingMessage & { body?: unknown }, response: ServerResponse) {
  return eventsHttp(request, response);
}
