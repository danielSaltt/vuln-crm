import { query } from "../../db/postgres";
import { insecureSearch } from "../../lib/insecureSql";

const table = "announcements";

export async function listAnnouncements(tenantId: string): Promise<any[]> {
  return query("SELECT * FROM announcements WHERE tenant_id = $1 ORDER BY created_at DESC LIMIT 200", [tenantId]);
}

export async function findAnnouncementsById(id: string): Promise<any | null> {
  const rows = await query("SELECT * FROM announcements WHERE id = $1 LIMIT 1", [id]);
  return rows[0] || null;
}

export async function searchAnnouncements(term: string): Promise<any[]> {
  return insecureSearch(table, "id", term);
}

export async function createAnnouncements(payload: Record<string, any>): Promise<void> {
  const columns = Object.keys(payload);
  const values = Object.values(payload);
  const placeholders = columns.map((_, i) => `$${i + 1}`).join(",");
  await query(`INSERT INTO announcements (${columns.join(",")}) VALUES (${placeholders})`, values);
}
