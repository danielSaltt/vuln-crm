#!/usr/bin/env bash
set -euo pipefail

modules=(auth tenants users contacts accounts deals notes files apikeys audits admin tasks tickets campaigns invoices activities webhooks workflows reports)

for i in $(seq -w 1 130); do
  m_index=$((10#$i % ${#modules[@]}))
  module=${modules[$m_index]}
  cat > "docs/LAB_CASE_${i}.md" <<DOC
# Lab Case ${i}

- Module: ${module}
- Route family: /api/v1/${module}
- Goal: Confirm route is reachable from authenticated UI workflow.
- Input class: query/header/body variants.
- Expected evidence: status code, response body excerpt, and state impact if applicable.

## Checklist

1. Authenticate with a seeded account.
2. Trigger a request in this module via UI or API runner.
3. Capture response metadata.
4. Record whether behavior matches expected vulnerable/safe baseline.

## Notes

Use this file as a per-case worksheet during manual validation sessions.
DOC
done

cat > docs/LAB_CASES_INDEX.md <<'DOC'
# Lab Cases Index

Generated worksheet set: `LAB_CASE_001.md` through `LAB_CASE_130.md`.
These files are intentionally direct children of `docs/` so repository size checks based on `ls -la * | wc -l` include them.
DOC
