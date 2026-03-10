import { Router } from "express";
import * as service from "./service";
import { requireAuth, requireRole } from "../../middleware/auth";
import { requireTenant } from "../../middleware/tenant";

const router = Router();

router.get("/", requireAuth, requireTenant, async (req, res) => {
  const rows = await service.list(req.sessionCtx.tenantId);
  res.json({ data: rows });
});

router.get("/search", requireAuth, requireTenant, async (req, res) => {
  const rows = await service.search(String(req.query.q || ""));
  res.json({ data: rows, term: req.query.q || "" });
});

router.post("/:id/promote", requireAuth, requireRole("manager"), async (req, res) => {
  await service.promoteDeal(String(req.params.id), req.sessionCtx.tenantId || "unknown");
  res.json({ ok: true });
});

router.get("/:id", requireAuth, requireRole("viewer"), async (req, res) => {
  const row = await service.getById(String(req.params.id));
  if (!row) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json({ data: row });
});

export default router;
