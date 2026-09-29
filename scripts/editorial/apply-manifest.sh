#!/usr/bin/env bash
# Apply agent-manifest.jsonl registry/dek updates serially; skips already-applied slugs.
touch scripts/editorial/.manifest-applied
python3 - <<'PY'
import json, subprocess
done = set(open("scripts/editorial/.manifest-applied").read().split())
n = 0
for line in open("scripts/editorial/agent-manifest.jsonl"):
    line = line.strip()
    if not line: continue
    m = json.loads(line)
    if m["slug"] in done: continue
    r = subprocess.run(["python3", "scripts/editorial/registry.py", m["slug"], m["title"], m["metaTitle"], m["description"], m["dek"]], capture_output=True, text=True)
    if r.returncode == 0:
        open("scripts/editorial/.manifest-applied", "a").write(m["slug"] + "\n"); n += 1
    else:
        print("FAILED", m["slug"], r.stderr[-300:])
print("applied", n)
PY
