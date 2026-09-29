#!/usr/bin/env python3
"""Update a guide's registry entry (data/guides.ts) and dek (data/guide-deks.ts).
usage: registry.py <slug> <title> <metaTitle> <description> <dek>"""
import re, sys, json
slug, title, meta_title, desc, dek = sys.argv[1:6]
p = "data/guides.ts"; s = open(p).read()
i = s.index(f'    slug: "{slug}",')
start = s.rindex("  {\n", 0, i); end = s.index("\n  },", i)
block = s[start:end]
t_rep = "\n    title: " + json.dumps(title) + ",\n    metaTitle: " + json.dumps(meta_title) + ","
block = re.sub(r'\n    title: ".*?",(\n    metaTitle: ".*?",)?', lambda _: t_rep, block, count=1)
d_rep = "\n    description: " + json.dumps(desc) + ","
block = re.sub(r'\n    description: ".*?",', lambda _: d_rep, block, count=1)
s = s[:start] + block + s[end:]; open(p, "w").write(s)
p = "data/guide-deks.ts"; s = open(p).read()
entry = f"  {json.dumps(slug)}:\n    {json.dumps(dek)},\n"
if f'"{slug}":' in s:
    s = re.sub(rf'  "{re.escape(slug)}":\n    ".*?",\n', lambda _: entry, s)
else:
    s = s.rstrip().rstrip("};").rstrip() + "\n" + entry + "};\n"
open(p, "w").write(s)
print("registry+dek updated:", slug)
