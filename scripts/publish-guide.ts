import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";

// Publish only the already-public educational PDF. Never upload private-data or contacts.
async function main() {
  const origin = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!origin || !key || new URL(origin).protocol !== "https:") throw new Error("Missing setup");
  const base = origin.replace(/\/$/, "");
  const bucket = "clientelo-public";
  const filename = "pruvodce-etf-2026-10-14.pdf";
  const bytes = await readFile(new URL(`../public/guides/${filename}`, import.meta.url));
  if (bytes.subarray(0, 5).toString() !== "%PDF-") throw new Error("Invalid local PDF");
  const hash = (value: Uint8Array) => createHash("sha256").update(value).digest("hex");
  const headers: Record<string, string> = { apikey: key };
  if (key.startsWith("eyJ")) headers.Authorization = `Bearer ${key}`;
  const bucketUrl = `${base}/storage/v1/bucket/${bucket}`;
  const existing = await fetch(bucketUrl, { headers, signal: AbortSignal.timeout(10000) });
  if (existing.status === 404 || existing.status === 400) {
    // A missing bucket must be explicit. Never interpret arbitrary service errors as absence.
    const body = await existing.json() as { error?: string; message?: string };
    if (!/not found/i.test(`${body.error} ${body.message}`)) throw new Error("Bucket lookup failed");
    const created = await fetch(`${base}/storage/v1/bucket`, {
      method: "POST", headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ id: bucket, name: bucket, public: true, allowed_mime_types: ["application/pdf"], file_size_limit: 5242880 }),
      signal: AbortSignal.timeout(10000),
    });
    if (!created.ok) throw new Error("Bucket creation failed");
  } else if (!existing.ok || (await existing.json() as { public?: boolean }).public !== true) {
    throw new Error("Existing bucket is not a public document bucket; no permissions changed");
  }
  const publicUrl = `${base}/storage/v1/object/public/${bucket}/${filename}`;
  let published = await fetch(publicUrl, { signal: AbortSignal.timeout(10000) });
  if (!published.ok) {
    await published.body?.cancel();
    const upload = await fetch(`${base}/storage/v1/object/${bucket}/${filename}`, {
      method: "POST", headers: { ...headers, "Content-Type": "application/pdf", "Cache-Control": "3600", "x-upsert": "false" },
      body: bytes, signal: AbortSignal.timeout(15000),
    });
    if (!upload.ok) throw new Error("Upload failed; existing files are not overwritten");
    published = await fetch(publicUrl, { signal: AbortSignal.timeout(10000) });
  }
  if (!published.ok || !published.headers.get("content-type")?.includes("application/pdf") ||
      hash(new Uint8Array(await published.arrayBuffer())) !== hash(bytes)) throw new Error("Public PDF verification failed");
  const envFile = new URL("../.env.local", import.meta.url);
  const text = await readFile(envFile, "utf8");
  if ((text.match(/^GUIDE_DOWNLOAD_URL=/gm) || []).length !== 1) throw new Error("Invalid configuration file");
  await writeFile(envFile, text.replace(/^GUIDE_DOWNLOAD_URL=.*$/m, () => `GUIDE_DOWNLOAD_URL=${JSON.stringify(publicUrl)}`));
  console.log("Public PDF verified (MIME and SHA-256), URL saved privately:");
  console.log(publicUrl);
  console.log("Contact database permissions were not changed. No email was sent.");
}
main().catch(() => { console.error("Publikace PDF se nepodařila dokončit. Žádné klíče se nevypisují; zkontrolujte nastavení Storage."); process.exitCode = 1; });
