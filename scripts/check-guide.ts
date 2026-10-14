import { readFile } from "node:fs/promises";
import { checkGuideReadiness } from "../server/guide-readiness.ts";

const checks = checkGuideReadiness(process.env);
let pdfReady = false;
try {
  const pdf = await readFile(new URL("../public/guides/pruvodce-etf-2026-10-14.pdf", import.meta.url));
  pdfReady = pdf.subarray(0, 5).toString("ascii") === "%PDF-";
} catch { /* The check reports the missing file without exposing filesystem details. */ }
checks.push({ name: "PDF v projektu", ok: pdfReady, detail: "public/guides/pruvodce-etf-2026-10-14.pdf" });
for (const check of checks) console.log(`${check.ok ? "OK" : "CHYBÍ"} | ${check.name} | ${check.detail}`);
console.log("Lokální kontrola. Účty, DNS, migrace, retence a doručení do schránky vyžadují samostatné živé ověření.");
if (checks.some((check) => !check.ok)) process.exitCode = 1;
