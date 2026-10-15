import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { resolve, join } from "node:path";
import { pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";
import ts from "typescript";

test("Vercel root tsconfig emits runnable API handlers without TypeScript import paths", async () => {
  const root = resolve(import.meta.dirname, "..");
  const base = join(root, "node_modules", ".tmp");
  await mkdir(base, { recursive: true });
  const out = await mkdtemp(join(base, "vercel-api-"));
  try {
    const config = ts.readConfigFile(join(root, "tsconfig.json"), ts.sys.readFile);
    assert.equal(config.error, undefined);
    const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, root);
    const program = ts.createProgram([join(root, "api/guide.ts"), join(root, "api/guide-config.ts")], {
      ...parsed.options, rootDir: root, outDir: out, noEmit: false, skipLibCheck: true,
    });
    const emit = program.emit();
    assert.equal(emit.emitSkipped, false);
    const diagnostics = ts.getPreEmitDiagnostics(program).filter(d => d.category === ts.DiagnosticCategory.Error);
    assert.deepEqual(diagnostics.map(d => ts.flattenDiagnosticMessageText(d.messageText, "\n")), []);
    await writeFile(join(out, "package.json"), JSON.stringify({ type: "module" }));
    const configUrl = pathToFileURL(join(out, "api/guide-config.js")).href;
    const guideUrl = pathToFileURL(join(out, "api/guide.js")).href;
    const result = spawnSync(process.execPath, ["--input-type=module", "-e", `
      process.env.GUIDE_ENABLED = 'false';
      const { default: handler } = await import(${JSON.stringify(configUrl)});
      await import(${JSON.stringify(guideUrl)});
      let status, body;
      await handler({ method: 'GET', headers: {} }, {
        setHeader() {}, writeHead(value) { status = value; }, end(value) { body = JSON.parse(value); }
      });
      if (status !== 200 || body.available !== false) process.exit(1);
    `], { encoding: "utf8", env: { ...process.env, GUIDE_ENABLED: "false" } });
    assert.equal(result.status, 0, result.stderr);
  } finally {
    assert.ok(resolve(out).startsWith(resolve(base) + "/") || resolve(out).startsWith(resolve(base) + "\\"), "Invalid cleanup target");
    await rm(out, { recursive: true, force: true });
  }
});
