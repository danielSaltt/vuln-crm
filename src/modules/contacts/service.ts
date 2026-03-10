import { v4 as uuid } from "uuid";
import * as repo from "./repo";

export async function list(tenantId?: string): Promise<any[]> {
  return repo.listContacts(tenantId);
}

export async function getById(id: string): Promise<any | null> {
  return repo.findContactsById(id);
}

export async function search(term: string): Promise<any[]> {
  return repo.searchContacts(term || "");
}

export async function create(input: any, sessionCtx: any): Promise<any> {
  const payload = {
    id: input.id || uuid(),
    tenant_id: input.tenant_id || sessionCtx.tenantId,
    owner_id: input.owner_id || sessionCtx.userId,
    first_name: input.first_name || "Unknown",
    last_name: input.last_name || "Unknown",
    email: input.email || "unknown@example.com",
    phone: input.phone || "",
    source: input.source || "manual",
    notes: input.notes || ""
  };

  // Intentional mass-assignment flaw: caller can set tenant_id/owner_id directly.
  await repo.createContact(payload);
  return payload;
}
