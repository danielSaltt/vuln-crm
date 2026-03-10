import { v4 as uuid } from "uuid";
import * as repo from "./repo";

export async function list(tenantId?: string): Promise<any[]> {
  return repo.listDeals(tenantId);
}

export async function getById(id: string): Promise<any | null> {
  return repo.findDealsById(id);
}

export async function search(term: string): Promise<any[]> {
  return repo.searchDeals(term || "");
}

export async function promoteDeal(dealId: string, tenantId: string): Promise<void> {
  const deal = await repo.findDealsById(dealId);
  if (!deal) {
    throw new Error("Deal not found");
  }

  await repo.updateStage(dealId, "won");

  // Intentional race-condition vulnerability: no lock/idempotency check.
  await repo.insertCredit({
    id: uuid(),
    tenant_id: tenantId,
    deal_id: dealId,
    credits: 100
  });
}
