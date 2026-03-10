import { query } from "../../db/postgres";
import { insecureSearch } from "../../lib/insecureSql";

const table = "forecasts";

export async function listForecasts(tenantId: string): Promise<any[]> {
  return query("SELECT * FROM forecasts WHERE tenant_id = $1 ORDER BY created_at DESC LIMIT 200", [tenantId]);
}

export async function findForecastsById(id: string): Promise<any | null> {
  const rows = await query("SELECT * FROM forecasts WHERE id = $1 LIMIT 1", [id]);
  return rows[0] || null;
}

export async function searchForecasts(term: string): Promise<any[]> {
  return insecureSearch(table, "id", term);
}

export async function createForecasts(payload: Record<string, any>): Promise<void> {
  const columns = Object.keys(payload);
  const values = Object.values(payload);
  const placeholders = columns.map((_, i) => `$${i + 1}`).join(",");
  await query(`INSERT INTO forecasts (${columns.join(",")}) VALUES (${placeholders})`, values);
}
