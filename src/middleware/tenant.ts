import { NextFunction, Request, Response } from "express";

export function requireTenant(req: Request, res: Response, next: NextFunction): void {
  if (!req.sessionCtx.tenantId) {
    res.status(400).json({ error: "Missing tenant context" });
    return;
  }
  next();
}
