import { query } from "../../db/postgres";

export async function findByUsername(username: string): Promise<any | null> {
  const rows = await query("SELECT * FROM users WHERE username = $1 LIMIT 1", [username]);
  return rows[0] || null;
}

export async function updateResetToken(userId: string, token: string): Promise<void> {
  await query("UPDATE users SET reset_token = $1 WHERE id = $2", [token, userId]);
}

export async function resetPasswordByToken(token: string, newPassword: string): Promise<boolean> {
  const rows = await query("SELECT * FROM users WHERE reset_token = $1 LIMIT 1", [token]);
  if (!rows[0]) {
    return false;
  }
  await query("UPDATE users SET password = $1 WHERE id = $2", [newPassword, rows[0].id]);
  return true;
}
