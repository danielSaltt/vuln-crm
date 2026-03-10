#!/usr/bin/env bash
set -euo pipefail

base_url="${1:-http://localhost:4000}"

curl -sf "$base_url/health" >/dev/null
curl -sf "$base_url/api/v1/tenants" >/dev/null

echo "smoke checks passed"
