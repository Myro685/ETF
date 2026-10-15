"""Read-only audit of reachable Git blobs, working files and built assets.

No matched values are printed. This is a targeted audit, not proof against all leaks.
"""
import hashlib
import json
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def git(*args, data=None):
    return subprocess.check_output(["git", *args], cwd=ROOT, input=data)


known = set()
for file in ROOT.glob(".env*.local"):
    for line in file.read_text(encoding="utf-8-sig").splitlines():
        if "=" not in line or line.lstrip().startswith("#"):
            continue
        key, value = line.split("=", 1)
        value = value.strip().strip("\"'")
        if any(word in key.upper() for word in ("SECRET", "TOKEN", "API_KEY")) and len(value) >= 12:
            known.add(value.encode())

patterns = {
    "credential": re.compile(rb"(?:sb_secret_|GOCSPX-|ghp_|github_pat_|sk_live_|sk_test_)[A-Za-z0-9_\-]{16,}"),
    "refresh_token": re.compile(rb"1//[A-Za-z0-9_\-]{30,}"),
    "jwt": re.compile(rb"eyJ[A-Za-z0-9_\-]{20,}\.[A-Za-z0-9_\-]{20,}\.[A-Za-z0-9_\-]{20,}"),
    "private_key": re.compile(rb"-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----"),
}
email_pattern = re.compile(rb"[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+")
findings, reviewed_emails = [], set()
# Manually reviewed literal fixtures / Resend's documented test sender in history.
# Exact fingerprints avoid granting a blanket exception to arbitrary test addresses.
REVIEWED_FIXTURES = {
    "027b96fa59d7", "8b81bcfb1708", "377dfc9cf46a", "4e69d735baaf",
    "1feb6bfba0de", "07fbb33bd64f", "4e3f27e1e878",
}


def scan(data, path, scope):
    for name, pattern in patterns.items():
        if pattern.search(data):
            findings.append({"scope": scope, "path": path, "kind": name})
    if any(value in data for value in known):
        findings.append({"scope": scope, "path": path, "kind": "known_application_secret"})
    for value in email_pattern.findall(data):
        email = value.decode("ascii").lower()
        domain = email.rsplit("@", 1)[1]
        if hashlib.sha256(value).hexdigest()[:12] in REVIEWED_FIXTURES:
            reviewed_emails.add((path, "reviewed_fixture_or_test_sender"))
            continue
        # Public operator address explicitly approved by user; synthetic fixtures.
        if email == "miroslavgrund68@gmail.com" or domain in ("example.com", "example.cz", "email.cz", "domena.cz", "test.cz") or domain.endswith(".invalid"):
            continue
        # Upstream skill/package authors are third-party source metadata, not contacts.
        if path.startswith(".agents/skills/") or path.endswith("package-lock.json"):
            reviewed_emails.add((path, "upstream_metadata"))
            continue
        findings.append({"scope": scope, "path": path, "kind": "email_requires_review", "fingerprint": hashlib.sha256(value).hexdigest()[:12]})


objects = []
for line in git("rev-list", "--objects", "--all").decode().splitlines():
    oid, _, path = line.partition(" ")
    objects.append((oid, path))
checks = git("cat-file", "--batch-check=%(objectname) %(objecttype)", data=("\n".join(oid for oid, _ in objects) + "\n").encode()).decode().splitlines()
blobs = [(oid, path) for (oid, path), info in zip(objects, checks) if info.endswith(" blob")]
process = subprocess.Popen(["git", "cat-file", "--batch"], cwd=ROOT, stdin=subprocess.PIPE, stdout=subprocess.PIPE)
for oid, path in blobs:
    process.stdin.write((oid + "\n").encode()); process.stdin.flush()
    header = process.stdout.readline().split(); size = int(header[2])
    content = process.stdout.read(size); process.stdout.read(1)
    scan(content, path, "reachable_history")
process.stdin.close(); process.wait()
working = git("ls-files", "--cached", "--others", "--exclude-standard", "-z").decode().split("\0")
for path in working:
    file = ROOT / path
    if path and file.is_file():
        scan(file.read_bytes(), path, "working_tree")
assets = [file for file in (ROOT / "dist").rglob("*") if file.is_file()]
for file in assets:
    scan(file.read_bytes(), file.relative_to(ROOT).as_posix(), "built_assets")
unique = {json.dumps(item, sort_keys=True): item for item in findings}
report = {"head": git("rev-parse", "HEAD").decode().strip(), "reachable_commits": int(git("rev-list", "--count", "--all")),
          "history_blobs": len(blobs), "working_files": sum(bool(path) for path in working), "built_files": len(assets),
          "known_secret_values_checked": len(known), "upstream_email_paths": len(reviewed_emails), "findings": list(unique.values()),
          "limits": "Reachable refs only; credential patterns and exact current app secrets, email review. Not an exhaustive forensic guarantee."}
private = ROOT / "private-data" / "repository-audit.json"
private.parent.mkdir(exist_ok=True)
private.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
print(json.dumps(report, ensure_ascii=False))
