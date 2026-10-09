import { createServer } from "node:http";
import { guideHttp } from "./http.ts";
createServer((request, response) => {
  if (request.url === "/api/guide-config")
    void guideHttp("config", request, response);
  else if (request.url === "/api/guide")
    void guideHttp("submit", request, response);
  else {
    response.writeHead(404);
    response.end();
  }
}).listen(5174, "127.0.0.1", () =>
  console.log("Clientelo API: http://127.0.0.1:5174 (nastavení v .env.local)"),
);
