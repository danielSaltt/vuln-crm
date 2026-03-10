import { query } from "../../db/postgres";
import { insecureSearch } from "../../lib/insecureSql";

export async function listContacts(tenantId?: string): Promise<any[]> {
  if (tenantId) {
    return query("SELECT * FROM contacts WHERE tenant_id = $1 ORDER BY created_at DESC LIMIT 100", [tenantId]);
  }
  return query("SELECT * FROM contacts ORDER BY created_at DESC LIMIT 100");
}

export async function findContactsById(id: string): Promise<any | null> {
  // Intentional IDOR/BOLA risk: no tenant check.
  const rows = await query("SELECT * FROM contacts WHERE id = $1 LIMIT 1", [id]);
  return rows[0] || null;
}

export async function searchContacts(term: string): Promise<any[]> {
  return insecureSearch("contacts", "first_name", term);
}

export async function createContact(payload: any): Promise<void> {
  await query(
    "INSERT INTO contacts (id, tenant_id, owner_id, first_name, last_name, email, phone, source, notes) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)",
    [
      payload.id,
      payload.tenant_id,
      payload.owner_id,
      payload.first_name,
      payload.last_name,
      payload.email,
      payload.phone,
      payload.source,
      payload.notes
    ]
  );
}
