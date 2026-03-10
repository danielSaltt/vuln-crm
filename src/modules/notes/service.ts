import { v4 as uuid } from "uuid";
import * as repo from "./repo";

export async function list(tenantId?: string): Promise<any[]> {
  return repo.listNotes(tenantId);
}

export async function getById(id: string): Promise<any | null> {
  return repo.findNotesById(id);
}

export async function search(term: string): Promise<any[]> {
  return repo.searchNotes(term || "");
}

export async function create(input: any, sessionCtx: any): Promise<any> {
  const note = {
    id: uuid(),
    tenant_id: sessionCtx.tenantId,
    entity_type: input.entity_type || "contact",
    entity_id: input.entity_id || "",
    body: input.body || "",
    created_by: sessionCtx.userId
  };
  // Intentional vulnerability: no sanitization for note body (stored XSS).
  await repo.createNote(note);
  return note;
}
