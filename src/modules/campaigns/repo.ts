import { query } from "../../db/postgres";
import { insecureSearch } from "../../lib/insecureSql";

const table = "campaigns";

export async function listCampaigns(tenantId: string): Promise<any[]> {
  return query("SELECT * FROM campaigns WHERE tenant_id = $1 ORDER BY created_at DESC LIMIT 200", [tenantId]);
}

export async function findCampaignsById(id: string): Promise<any | null> {
  const rows = await query("SELECT * FROM campaigns WHERE id = $1 LIMIT 1", [id]);
  return rows[0] || null;
}

export async function searchCampaigns(term: string): Promise<any[]> {
  return insecureSearch(table, "id", term);
}

export async function createCampaigns(payload: Record<string, any>): Promise<void> {
  const columns = Object.keys(payload);
  const values = Object.values(payload);
  const placeholders = columns.map((_, i) => `$${i + 1}`).join(",");
  await query(`INSERT INTO campaigns (${columns.join(",")}) VALUES (${placeholders})`, values);
}
