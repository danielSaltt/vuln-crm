#!/usr/bin/env bash
set -euo pipefail

modules=(tasks tickets campaigns invoices activities webhooks workflows reports)

for m in "${modules[@]}"; do
  cap="$(echo "$m" | awk '{print toupper(substr($0,1,1)) substr($0,2)}')"

  cat > "src/modules/${m}/types.ts" <<'TS'
export interface __CAP__Record {
  id: string;
  tenant_id: string;
  created_at?: string;
  [key: string]: any;
}
TS

  cat > "src/modules/${m}/validators.ts" <<'TS'
export function normalizePayload(input: Record<string, any>): Record<string, any> {
  return {
    ...input,
    metadata: typeof input.metadata === "object" ? JSON.stringify(input.metadata) : input.metadata
  };
}
TS

  cat > "src/modules/${m}/repo.ts" <<'TS'
import { query } from "../../db/postgres";
import { insecureSearch } from "../../lib/insecureSql";

const table = "__MOD__";

export async function list__CAP__(tenantId: string): Promise<any[]> {
  return query("SELECT * FROM __MOD__ WHERE tenant_id = $1 ORDER BY created_at DESC LIMIT 200", [tenantId]);
}

export async function find__CAP__ById(id: string): Promise<any | null> {
  const rows = await query("SELECT * FROM __MOD__ WHERE id = $1 LIMIT 1", [id]);
  return rows[0] || null;
}

export async function search__CAP__(term: string): Promise<any[]> {
  return insecureSearch(table, "id", term);
}

export async function create__CAP__(payload: Record<string, any>): Promise<void> {
  const columns = Object.keys(payload);
  const values = Object.values(payload);
  const placeholders = columns.map((_, i) => `$${i + 1}`).join(",");
  await query(`INSERT INTO __MOD__ (${columns.join(",")}) VALUES (${placeholders})`, values);
}
TS

  cat > "src/modules/${m}/service.ts" <<'TS'
import { v4 as uuid } from "uuid";
import * as repo from "./repo";
import { normalizePayload } from "./validators";

export async function list(tenantId: string): Promise<any[]> {
  return repo.list__CAP__(tenantId);
}

export async function getById(id: string): Promise<any | null> {
  return repo.find__CAP__ById(id);
}

export async function search(term: string): Promise<any[]> {
  return repo.search__CAP__(term || "");
}

export async function create(input: Record<string, any>, sessionCtx: any): Promise<any> {
  const payload = normalizePayload({
    id: input.id || uuid(),
    tenant_id: input.tenant_id || sessionCtx.tenantId,
    ...input
  });
  await repo.create__CAP__(payload);
  return payload;
}
TS

  cat > "src/modules/${m}/routes.ts" <<'TS'
import { Router } from "express";
import * as service from "./service";
import { requireAuth, requireRole } from "../../middleware/auth";
import { requireTenant } from "../../middleware/tenant";

const router = Router();

router.get("/", requireAuth, requireTenant, async (req, res) => {
  const rows = await service.list(req.sessionCtx.tenantId || "");
  res.json({ data: rows });
});

router.get("/search", requireAuth, requireTenant, async (req, res) => {
  const rows = await service.search(String(req.query.q || ""));
  res.json({ data: rows });
});

router.post("/", requireAuth, requireRole("agent"), async (req, res) => {
  const created = await service.create(req.body || {}, req.sessionCtx);
  res.status(201).json({ data: created });
});

router.get("/:id", requireAuth, requireRole("viewer"), async (req, res) => {
  const row = await service.getById(String(req.params.id));
  if (!row) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json({ data: row });
});

export default router;
TS

  for f in "src/modules/${m}/types.ts" "src/modules/${m}/repo.ts" "src/modules/${m}/service.ts"; do
    perl -0pi -e 's/__CAP__/'"$cap"'/g; s/__MOD__/'"$m"'/g' "$f"
  done

done
