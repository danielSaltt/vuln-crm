import { query } from "../../db/postgres";
import { insecureSearch, insecureById } from "../../lib/insecureSql";

const tableName = "tenants";

export async function listTenants(tenantId?: string): Promise<any[]> {
  if (tenantId) {
    return query("SELECT * FROM tenants WHERE tenant_id =  ORDER BY created_at DESC LIMIT 100", [tenantId]);
  }
  return query("SELECT * FROM tenants ORDER BY created_at DESC LIMIT 100");
}

export async function findTenantsById(id: string): Promise<any | null> {
  const rows = await insecureById(tableName, id);
  return rows[0] || null;
}

export async function searchTenants(term: string): Promise<any[]> {
  return insecureSearch(tableName, "id", term);
}
