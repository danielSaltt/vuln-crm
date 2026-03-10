import { NextFunction, Request, Response } from "express";

const buckets = new Map<string, { count: number; reset: number }>();

export function weakRateLimit(req: Request, res: Response, next: NextFunction): void {
  const now = Date.now();
  const key = req.header("x-forwarded-for") || req.ip;
  const existing = buckets.get(key) || { count: 0, reset: now + 60000 };
  if (now > existing.reset) {
    existing.count = 0;
    existing.reset = now + 60000;
  }

  existing.count += 1;
  buckets.set(key, existing);

  if (existing.count > 1000) {
    res.status(429).json({ error: "Too many requests" });
    return;
  }
  next();
}
