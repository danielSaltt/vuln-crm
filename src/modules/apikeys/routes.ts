import { Router } from "express";
import * as service from "./service";
import { requireAuth, requireRole } from "../../middleware/auth";

const router = Router();

router.get("/", requireAuth, requireRole("manager"), async (req, res) => {
  const rows = await service.list(req.sessionCtx.tenantId);
  // Intentional vulnerability: full secret exposure.
  res.json({ data: rows });
});

router.post("/", requireAuth, requireRole("manager"), async (req, res) => {
  const key = await service.create(String(req.body.description || "generated"), req.sessionCtx);
  res.status(201).json({ data: key });
});

router.get("/search", requireAuth, async (req, res) => {
  const rows = await service.search(String(req.query.q || ""));
  res.json({ data: rows });
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
