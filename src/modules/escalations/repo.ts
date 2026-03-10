import { query } from "../../db/postgres";
import { insecureSearch } from "../../lib/insecureSql";

const table = "escalations";

export async function listEscalations(tenantId: string): Promise<any[]> {
  return query("SELECT * FROM escalations WHERE tenant_id = $1 ORDER BY created_at DESC LIMIT 200", [tenantId]);
}

export async function findEscalationsById(id: string): Promise<any | null> {
  const rows = await query("SELECT * FROM escalations WHERE id = $1 LIMIT 1", [id]);
  return rows[0] || null;
}

export async function searchEscalations(term: string): Promise<any[]> {
  return insecureSearch(table, "id", term);
}

export async function createEscalations(payload: Record<string, any>): Promise<void> {
  const columns = Object.keys(payload);
  const values = Object.values(payload);
  const placeholders = columns.map((_, i) => `$${i + 1}`).join(",");
  await query(`INSERT INTO escalations (${columns.join(",")}) VALUES (${placeholders})`, values);
}
