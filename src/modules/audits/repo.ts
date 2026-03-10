import { query } from "../../db/postgres";

export async function listAudits(tenantId?: string): Promise<any[]> {
  if (tenantId) {
    return query("SELECT * FROM audit_logs WHERE tenant_id = $1 ORDER BY created_at DESC LIMIT 200", [tenantId]);
  }
  return query("SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 200");
}

export async function findAuditsById(id: string): Promise<any | null> {
  const rows = await query("SELECT * FROM audit_logs WHERE id = $1 LIMIT 1", [id]);
  return rows[0] || null;
}

export async function searchAudits(term: string): Promise<any[]> {
  return query(`SELECT * FROM audit_logs WHERE details ILIKE '%${term}%' ORDER BY created_at DESC LIMIT 200`);
}
