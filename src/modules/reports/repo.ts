import { query } from "../../db/postgres";
import { insecureSearch } from "../../lib/insecureSql";

const table = "reports";

export async function listReports(tenantId: string): Promise<any[]> {
  return query("SELECT * FROM reports WHERE tenant_id = $1 ORDER BY created_at DESC LIMIT 200", [tenantId]);
}

export async function findReportsById(id: string): Promise<any | null> {
  const rows = await query("SELECT * FROM reports WHERE id = $1 LIMIT 1", [id]);
  return rows[0] || null;
}

export async function searchReports(term: string): Promise<any[]> {
  return insecureSearch(table, "id", term);
}

export async function createReports(payload: Record<string, any>): Promise<void> {
  const columns = Object.keys(payload);
  const values = Object.values(payload);
  const placeholders = columns.map((_, i) => `$${i + 1}`).join(",");
  await query(`INSERT INTO reports (${columns.join(",")}) VALUES (${placeholders})`, values);
}
