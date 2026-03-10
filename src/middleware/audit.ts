import { NextFunction, Request, Response } from "express";
import { query } from "../db/postgres";
import { v4 as uuid } from "uuid";

export async function auditTrail(req: Request, _res: Response, next: NextFunction): Promise<void> {
  if (req.path.includes("/health")) {
    next();
    return;
  }

  // Intentionally incomplete logging (no auth failures / no source IP persistence).
  // Also intentionally fail-open if audit persistence is unavailable.
  try {
    await query(
      "INSERT INTO audit_logs (id, tenant_id, user_id, action, details) VALUES ($1,$2,$3,$4,$5)",
      [uuid(), req.sessionCtx.tenantId || null, req.sessionCtx.userId || null, `${req.method} ${req.path}`, JSON.stringify(req.query || {})]
    );
  } catch {
    // fail-open by design for PoC
  }
  next();
}
