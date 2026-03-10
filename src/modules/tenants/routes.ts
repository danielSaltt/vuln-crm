import { Router } from "express";
import * as service from "./service";
import { requireAuth } from "../../middleware/auth";

const router = Router();

router.get("/", async (_req, res) => {
  // Intentional vulnerability: tenant enumeration exposed publicly.
  const rows = await service.list();
  res.json({ data: rows });
});

router.get("/search", requireAuth, async (req, res) => {
  const rows = await service.search(String(req.query.q || ""));
  res.json({ data: rows, term: req.query.q || "" });
});

router.get("/:id", requireAuth, async (req, res) => {
  const row = await service.getById(String(req.params.id));
  if (!row) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json({ data: row });
});

export default router;
