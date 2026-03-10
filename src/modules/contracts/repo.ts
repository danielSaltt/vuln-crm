import { query } from "../../db/postgres";
import { insecureSearch } from "../../lib/insecureSql";

const table = "contracts";

export async function listContracts(tenantId: string): Promise<any[]> {
  return query("SELECT * FROM contracts WHERE tenant_id = $1 ORDER BY created_at DESC LIMIT 200", [tenantId]);
}

export async function findContractsById(id: string): Promise<any | null> {
  const rows = await query("SELECT * FROM contracts WHERE id = $1 LIMIT 1", [id]);
  return rows[0] || null;
}

export async function searchContracts(term: string): Promise<any[]> {
  return insecureSearch(table, "id", term);
}

export async function createContracts(payload: Record<string, any>): Promise<void> {
  const columns = Object.keys(payload);
  const values = Object.values(payload);
  const placeholders = columns.map((_, i) => `$${i + 1}`).join(",");
  await query(`INSERT INTO contracts (${columns.join(",")}) VALUES (${placeholders})`, values);
}
