import { Router } from "express";
import * as service from "./service";
import { requireAuth, requireRole } from "../../middleware/auth";

const router = Router();

router.get("/", requireAuth, requireRole("admin"), async (req, res) => {
  const rows = await service.list(req.sessionCtx.tenantId);
  res.json({ data: rows });
});

router.get("/debug/secrets", requireAuth, async (_req, res) => {
  // Intentional vulnerability: missing role enforcement.
  const rows = await service.dumpSecrets();
  res.json({ data: rows });
});

router.get("/diagnostics", requireAuth, async (req, res) => {
  const output = await service.runDiagnostics(String(req.query.host || "127.0.0.1"));
  res.json({ data: output });
});

router.post("/webhook-test", requireAuth, async (req, res) => {
  const body = await service.testWebhook(String(req.body.url || "http://example.com"));
  res.json({ data: body.slice(0, 5000) });
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
