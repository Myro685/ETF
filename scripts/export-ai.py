"""Export visible conversation messages from explicitly selected local Codex rollouts.

No model reconstruction. No system/developer messages, reasoning or raw tool payloads.
Source files remain untouched. Public exports redact emails and credential patterns.
"""
import argparse
import collections
import datetime
import hashlib
import json
import re
from pathlib import Path

PROJECT = Path(__file__).resolve().parents[1]
PATTERNS = [
    ("email", re.compile(r"[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+")),
    ("credential", re.compile(r"(?:sb_secret_|sb_publishable_|GOCSPX-|ghp_|github_pat_|sk_live_|sk_test_)[A-Za-z0-9_\-]{12,}")),
    ("refresh_token", re.compile(r"1//[A-Za-z0-9_\-]{20,}")),
    ("jwt", re.compile(r"eyJ[A-Za-z0-9_\-]{12,}\.[A-Za-z0-9_\-]{12,}\.[A-Za-z0-9_\-]{12,}")),
    ("oauth_query", re.compile(r"(?i)([?&](?:code|state|ticket|access_token|refresh_token|client_secret|key)=)[^\s<>\"&]+")),
    ("private_key", re.compile(r"-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----[\s\S]*?-----END (?:RSA |EC |OPENSSH )?PRIVATE KEY-----")),
]


def secrets():
    values = set()
    for file in PROJECT.glob(".env*.local"):
        for line in file.read_text(encoding="utf-8-sig").splitlines():
            if "=" not in line or line.lstrip().startswith("#"):
                continue
            key, value = line.split("=", 1)
            value = value.strip().strip("\"'")
            if any(word in key.upper() for word in ("SECRET", "TOKEN", "API_KEY")) and len(value) >= 12:
                values.add(value)
    return sorted(values, key=len, reverse=True)


def redact(text, values, counts):
    for value in values:
        count = text.count(value)
        if count:
            counts["known_secret"] += count
            text = text.replace(value, "[REDACTED:known_secret]")
    for name, pattern in PATTERNS:
        text, count = pattern.subn("[REDACTED:" + name + "]", text)
        counts[name] += count
    # Application-injected ambient browser state is not a human instruction.
    text, count = re.subn(r"<in-app-browser-context[\s\S]*?</in-app-browser-context>",
                          "[Vynechaný automatický kontext prohlížeče]", text)
    counts["ambient_browser_context"] += count
    text, count = re.subn(r"<(?:environment_context|external_codex_apps_open_page)>[\s\S]*?</(?:environment_context|external_codex_apps_open_page)>", "", text)
    counts["automatic_context"] += count
    return text


def export(source, label, values, destination):
    raw = source.read_bytes()
    redactions, excluded = collections.Counter(), collections.Counter()
    messages = []
    for line_number, line in enumerate(raw.decode("utf-8").splitlines(), 1):
        item = json.loads(line)
        payload = item.get("payload", {})
        if item.get("type") != "response_item" or payload.get("type") != "message":
            excluded[item.get("type", "unknown")] += 1
            continue
        role = payload.get("role")
        if role not in ("user", "assistant") or (role == "assistant" and payload.get("phase") not in ("commentary", "final", "final_answer")):
            excluded["non_public_message"] += 1
            continue
        parts = []
        for part in payload.get("content", []):
            if part.get("type") in ("input_text", "output_text", "text"):
                parts.append(part.get("text", ""))
            else:
                parts.append("[Příloha: " + str(part.get("type", "unknown")) + "; binární obsah není v textovém exportu.]")
        content = redact("\n".join(parts), values, redactions)
        if not content.strip():
            excluded["automatic_context_only"] += 1
            continue
        messages.append({"timestamp": item.get("timestamp"), "role": role,
                         "phase": payload.get("phase"), "source_line": line_number, "text": content})
    output = destination / (label + ".md")
    text = "# Export konverzace: " + label + "\n\n"
    text += "Skutečné uložené textové zprávy, nikoli souhrn nebo rekonstrukce. Redakce a rozsah: viz README a manifest.\n\n"
    for index, message in enumerate(messages, 1):
        text += f"## {index}. {message['role']} · {message['timestamp']}\n\n{message['text']}\n\n"
    output.write_text(text, encoding="utf-8")
    json_file = destination / (label + ".jsonl")
    json_file.write_text("".join(json.dumps(message, ensure_ascii=False) + "\n" for message in messages), encoding="utf-8")
    return {"label": label, "source_file": source.name, "source_sha256": hashlib.sha256(raw).hexdigest(),
            "source_bytes": len(raw), "messages": len(messages), "roles": dict(collections.Counter(m["role"] for m in messages)),
            "first_message": messages[0]["timestamp"] if messages else None,
            "last_message": messages[-1]["timestamp"] if messages else None,
            "redactions": {key: value for key, value in redactions.items() if value}, "excluded_records": dict(excluded),
            "outputs": {file.name: hashlib.sha256(file.read_bytes()).hexdigest() for file in (output, json_file)}}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", action="append", required=True, help="label=absolute-path; repeat for selected project sessions")
    args = parser.parse_args()
    destination = PROJECT / "ai-log" / "exports"
    destination.mkdir(parents=True, exist_ok=True)
    values = secrets()
    manifest = {"exported_at_utc": datetime.datetime.now(datetime.timezone.utc).isoformat(),
                "method": "scripts/export-ai.py; visible user/assistant response_item messages; no reconstruction",
                "scope": "Point-in-time redacted text export; excludes tools, internal instructions, reasoning, event duplicates, images and later messages.",
                "sources": []}
    for argument in args.source:
        label, path = argument.split("=", 1)
        if not re.fullmatch(r"[a-z0-9-]+", label):
            raise ValueError("Invalid export label")
        manifest["sources"].append(export(Path(path), label, values, destination))
    (destination / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"exported_sources": len(manifest["sources"]), "messages": sum(s["messages"] for s in manifest["sources"]),
                      "redactions": sum(sum(s["redactions"].values()) for s in manifest["sources"])}, ensure_ascii=False))


if __name__ == "__main__":
    main()
