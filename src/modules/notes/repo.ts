import { query } from "../../db/postgres";
import { insecureSearch } from "../../lib/insecureSql";

export async function listNotes(tenantId?: string): Promise<any[]> {
  if (tenantId) {
    return query("SELECT * FROM notes WHERE tenant_id = $1 ORDER BY created_at DESC LIMIT 200", [tenantId]);
  }
  return query("SELECT * FROM notes ORDER BY created_at DESC LIMIT 200");
}

export async function findNotesById(id: string): Promise<any | null> {
  const rows = await query("SELECT * FROM notes WHERE id = $1 LIMIT 1", [id]);
  return rows[0] || null;
}

export async function searchNotes(term: string): Promise<any[]> {
  return insecureSearch("notes", "body", term);
}

export async function createNote(payload: any): Promise<void> {
  await query(
    "INSERT INTO notes (id, tenant_id, entity_type, entity_id, body, created_by) VALUES ($1,$2,$3,$4,$5,$6)",
    [payload.id, payload.tenant_id, payload.entity_type, payload.entity_id, payload.body, payload.created_by]
  );
}
