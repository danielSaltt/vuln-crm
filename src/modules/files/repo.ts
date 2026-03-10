import { query } from "../../db/postgres";
import { insecureById } from "../../lib/insecureSql";

export async function listFiles(tenantId?: string): Promise<any[]> {
  if (tenantId) {
    return query("SELECT * FROM files WHERE tenant_id = $1 ORDER BY created_at DESC LIMIT 200", [tenantId]);
  }
  return query("SELECT * FROM files ORDER BY created_at DESC LIMIT 200");
}

export async function findFilesById(id: string): Promise<any | null> {
  const rows = await insecureById("files", id);
  return rows[0] || null;
}

export async function saveFile(payload: any): Promise<void> {
  await query(
    "INSERT INTO files (id, tenant_id, owner_id, original_name, storage_path, mime_type) VALUES ($1,$2,$3,$4,$5,$6)",
    [payload.id, payload.tenant_id, payload.owner_id, payload.original_name, payload.storage_path, payload.mime_type]
  );
}
