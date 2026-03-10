import { query } from "../../db/postgres";
import { insecureSearch, insecureById } from "../../lib/insecureSql";

const tableName = "accounts";

export async function listAccounts(tenantId?: string): Promise<any[]> {
  if (tenantId) {
    return query("SELECT * FROM accounts WHERE tenant_id =  ORDER BY created_at DESC LIMIT 100", [tenantId]);
  }
  return query("SELECT * FROM accounts ORDER BY created_at DESC LIMIT 100");
}

export async function findAccountsById(id: string): Promise<any | null> {
  const rows = await insecureById(tableName, id);
  return rows[0] || null;
}

export async function searchAccounts(term: string): Promise<any[]> {
  return insecureSearch(tableName, "id", term);
}
