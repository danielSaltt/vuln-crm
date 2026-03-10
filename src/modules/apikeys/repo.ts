import { query } from "../../db/postgres";

export async function listApikeys(tenantId?: string): Promise<any[]> {
  if (tenantId) {
    return query("SELECT * FROM api_keys WHERE tenant_id = $1 ORDER BY created_at DESC LIMIT 100", [tenantId]);
  }
  return query("SELECT * FROM api_keys ORDER BY created_at DESC LIMIT 100");
}

export async function findApikeysById(id: string): Promise<any | null> {
  const rows = await query("SELECT * FROM api_keys WHERE id = $1 LIMIT 1", [id]);
  return rows[0] || null;
}

export async function createApiKey(payload: any): Promise<void> {
  await query(
    "INSERT INTO api_keys (id, tenant_id, key_value, description, created_by) VALUES ($1,$2,$3,$4,$5)",
    [payload.id, payload.tenant_id, payload.key_value, payload.description, payload.created_by]
  );
}
