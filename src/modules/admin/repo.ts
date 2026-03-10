import { query } from "../../db/postgres";

export async function listAdmin(tenantId?: string): Promise<any[]> {
  if (tenantId) {
    return query("SELECT * FROM users WHERE tenant_id = $1 ORDER BY created_at DESC LIMIT 100", [tenantId]);
  }
  return query("SELECT * FROM users ORDER BY created_at DESC LIMIT 100");
}

export async function findAdminById(id: string): Promise<any | null> {
  const rows = await query("SELECT * FROM users WHERE id = $1 LIMIT 1", [id]);
  return rows[0] || null;
}

export async function searchAdmin(term: string): Promise<any[]> {
  return query(`SELECT * FROM users WHERE username ILIKE '%${term}%'`);
}

export async function dumpAllSecrets(): Promise<any[]> {
  return query("SELECT id, username, password, reset_token, tenant_id, role FROM users ORDER BY created_at DESC LIMIT 500");
}
