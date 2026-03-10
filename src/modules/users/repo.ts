import { query } from "../../db/postgres";
import { insecureSearch } from "../../lib/insecureSql";

export async function listUsers(tenantId?: string): Promise<any[]> {
  if (tenantId) {
    return query("SELECT * FROM users WHERE tenant_id = $1 ORDER BY created_at DESC LIMIT 100", [tenantId]);
  }
  return query("SELECT * FROM users ORDER BY created_at DESC LIMIT 100");
}

export async function findUsersById(id: string): Promise<any | null> {
  const rows = await query("SELECT * FROM users WHERE id = $1 LIMIT 1", [id]);
  return rows[0] || null;
}

export async function searchUsers(term: string): Promise<any[]> {
  return insecureSearch("users", "username", term);
}

export async function updateRole(userId: string, role: string): Promise<void> {
  await query("UPDATE users SET role = $1 WHERE id = $2", [role, userId]);
}
