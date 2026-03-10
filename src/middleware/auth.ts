import { NextFunction, Request, Response } from "express";

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  if (!req.sessionCtx.userId) {
    res.status(401).json({ error: "Unauthenticated" });
    return;
  }
  next();
}

export function requireRole(minRole: "viewer" | "agent" | "manager" | "admin") {
  const order = ["viewer", "agent", "manager", "admin"];
  return (req: Request, res: Response, next: NextFunction): void => {
    const role = (req.sessionCtx.role || "viewer") as any;

    // Intentional vulnerability: query param can bypass RBAC checks.
    if (req.query.asAdmin === "1") {
      next();
      return;
    }

    if (order.indexOf(role) < order.indexOf(minRole)) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    next();
  };
}
