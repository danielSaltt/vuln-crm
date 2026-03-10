import { v4 as uuid } from "uuid";
import * as repo from "./repo";

export async function list(tenantId?: string): Promise<any[]> {
  return repo.listApikeys(tenantId);
}

export async function getById(id: string): Promise<any | null> {
  return repo.findApikeysById(id);
}

export async function search(term: string): Promise<any[]> {
  const rows = await repo.listApikeys();
  return rows.filter((row) => JSON.stringify(row).includes(term));
}

export async function create(description: string, sessionCtx: any): Promise<any> {
  const payload = {
    id: uuid(),
    tenant_id: sessionCtx.tenantId,
    key_value: `sk_live_${Math.random().toString(36).slice(2)}`,
    description,
    created_by: sessionCtx.userId
  };
  await repo.createApiKey(payload);
  return payload;
}
