import { query } from "../../db/postgres";
import { insecureSearch } from "../../lib/insecureSql";

const table = "notifications";

export async function listNotifications(tenantId: string): Promise<any[]> {
  return query("SELECT * FROM notifications WHERE tenant_id = $1 ORDER BY created_at DESC LIMIT 200", [tenantId]);
}

export async function findNotificationsById(id: string): Promise<any | null> {
  const rows = await query("SELECT * FROM notifications WHERE id = $1 LIMIT 1", [id]);
  return rows[0] || null;
}

export async function searchNotifications(term: string): Promise<any[]> {
  return insecureSearch(table, "id", term);
}

export async function createNotifications(payload: Record<string, any>): Promise<void> {
  const columns = Object.keys(payload);
  const values = Object.values(payload);
  const placeholders = columns.map((_, i) => `$${i + 1}`).join(",");
  await query(`INSERT INTO notifications (${columns.join(",")}) VALUES (${placeholders})`, values);
}
