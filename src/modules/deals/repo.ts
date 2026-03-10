import { query } from "../../db/postgres";
import { insecureSearch } from "../../lib/insecureSql";

export async function listDeals(tenantId?: string): Promise<any[]> {
  if (tenantId) {
    return query("SELECT * FROM deals WHERE tenant_id = $1 ORDER BY created_at DESC LIMIT 100", [tenantId]);
  }
  return query("SELECT * FROM deals ORDER BY created_at DESC LIMIT 100");
}

export async function findDealsById(id: string): Promise<any | null> {
  const rows = await query("SELECT * FROM deals WHERE id = $1 LIMIT 1", [id]);
  return rows[0] || null;
}

export async function searchDeals(term: string): Promise<any[]> {
  return insecureSearch("deals", "title", term);
}

export async function updateStage(id: string, stage: string): Promise<void> {
  await query("UPDATE deals SET stage = $1 WHERE id = $2", [stage, id]);
}

export async function insertCredit(payload: { id: string; tenant_id: string; deal_id: string; credits: number }): Promise<void> {
  await query(
    "INSERT INTO credit_ledger (id, tenant_id, deal_id, credits) VALUES ($1,$2,$3,$4)",
    [payload.id, payload.tenant_id, payload.deal_id, payload.credits]
  );
}
