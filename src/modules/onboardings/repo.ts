import { query } from "../../db/postgres";
import { insecureSearch } from "../../lib/insecureSql";

const table = "onboardings";

export async function listOnboardings(tenantId: string): Promise<any[]> {
  return query("SELECT * FROM onboardings WHERE tenant_id = $1 ORDER BY created_at DESC LIMIT 200", [tenantId]);
}

export async function findOnboardingsById(id: string): Promise<any | null> {
  const rows = await query("SELECT * FROM onboardings WHERE id = $1 LIMIT 1", [id]);
  return rows[0] || null;
}

export async function searchOnboardings(term: string): Promise<any[]> {
  return insecureSearch(table, "id", term);
}

export async function createOnboardings(payload: Record<string, any>): Promise<void> {
  const columns = Object.keys(payload);
  const values = Object.values(payload);
  const placeholders = columns.map((_, i) => `$${i + 1}`).join(",");
  await query(`INSERT INTO onboardings (${columns.join(",")}) VALUES (${placeholders})`, values);
}
