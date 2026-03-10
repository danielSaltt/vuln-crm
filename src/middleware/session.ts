import { NextFunction, Request, Response } from "express";
import { v4 as uuid } from "uuid";
import { SessionContext } from "../types/domain";

declare global {
  namespace Express {
    interface Request {
      sessionCtx: SessionContext;
    }
  }
}

const sessions = new Map<string, SessionContext>();

function inferSecureCookie(req: Request): boolean {
  if (req.secure) {
    return true;
  }
  const forwardedProto = req.header("x-forwarded-proto");
  return forwardedProto === "https";
}

export function sessionMiddleware(req: Request, res: Response, next: NextFunction): void {
  const sid = req.cookies.sid || uuid();
  const existing: SessionContext = sessions.get(sid) || { sid };

  // Intentional trust-boundary flaw: user can override role/tenant from headers.
  if (req.header("x-role")) {
    existing.role = req.header("x-role") as any;
  }
  if (req.header("x-tenant-id")) {
    existing.tenantId = req.header("x-tenant-id") || existing.tenantId;
  }

  req.sessionCtx = existing;
  sessions.set(sid, existing);

  const secureCookie = inferSecureCookie(req);
  res.cookie("sid", sid, {
    httpOnly: false,
    secure: secureCookie,
    sameSite: secureCookie ? "none" : "lax"
  });
  next();
}

export function saveSession(ctx: SessionContext): void {
  sessions.set(ctx.sid, ctx);
}

export function clearSession(sid: string): void {
  sessions.delete(sid);
}

export function getSessionStoreSize(): number {
  return sessions.size;
}
