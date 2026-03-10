import { query } from "../../db/postgres";
import { insecureSearch } from "../../lib/insecureSql";

const table = "invoices";

export async function listInvoices(tenantId: string): Promise<any[]> {
  return query("SELECT * FROM invoices WHERE tenant_id = $1 ORDER BY created_at DESC LIMIT 200", [tenantId]);
}

export async function findInvoicesById(id: string): Promise<any | null> {
  const rows = await query("SELECT * FROM invoices WHERE id = $1 LIMIT 1", [id]);
  return rows[0] || null;
}

export async function searchInvoices(term: string): Promise<any[]> {
  return insecureSearch(table, "id", term);
}

export async function createInvoices(payload: Record<string, any>): Promise<void> {
  const columns = Object.keys(payload);
  const values = Object.values(payload);
  const placeholders = columns.map((_, i) => `$${i + 1}`).join(",");
  await query(`INSERT INTO invoices (${columns.join(",")}) VALUES (${placeholders})`, values);
}
