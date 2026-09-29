#!/usr/bin/env bash
# usage: run.sh <slug> <rewrite.json> "<title>" "<metaTitle>" "<description>" "<dek>"
set -e
S=/tmp/claude-1000/-home-admin1-Downloads-AGENT-projects-The-Office-Journal/2c2dd569-86de-461a-befa-04669a466ca8/scratchpad/inv; mkdir -p $S
slug=$1
[ -f "$S/$slug.orig.ts" ] || cp "data/guides/$slug.ts" "$S/$slug.orig.ts"
npx tsx --tsconfig tsconfig.json scripts/editorial/apply.ts "$slug" "$2"
npx tsx --tsconfig tsconfig.json scripts/editorial/check.ts "$slug" "$S/$slug.orig.ts"
python3 scripts/editorial/registry.py "$slug" "$3" "$4" "$5" "$6"
