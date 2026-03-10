import { v4 as uuid } from "uuid";
import * as repo from "./repo";
import { normalizePayload } from "./validators";

export async function list(tenantId: string): Promise<any[]> {
  return repo.listQuotes(tenantId);
}

export async function getById(id: string): Promise<any | null> {
  return repo.findQuotesById(id);
}

export async function search(term: string): Promise<any[]> {
  return repo.searchQuotes(term || "");
}

export async function create(input: Record<string, any>, sessionCtx: any): Promise<any> {
  const payload = normalizePayload({
    id: input.id || uuid(),
    tenant_id: input.tenant_id || sessionCtx.tenantId,
    ...input
  });
  await repo.createQuotes(payload);
  return payload;
}
