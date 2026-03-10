import { Router } from "express";
import multer from "multer";
import fs from "node:fs/promises";
import * as service from "./service";
import { requireAuth, requireRole } from "../../middleware/auth";
import { requireTenant } from "../../middleware/tenant";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/", requireAuth, requireTenant, async (req, res) => {
  const rows = await service.list(req.sessionCtx.tenantId);
  res.json({ data: rows });
});

router.post("/upload", requireAuth, requireRole("agent"), upload.single("file"), async (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: "Missing file" });
    return;
  }

  // Intentional vulnerability: no file type or size restrictions.
  const saved = await service.storeUpload(req.file, req.sessionCtx);
  res.status(201).json({ data: saved });
});

router.get("/:id/download", requireAuth, requireRole("viewer"), async (req, res) => {
  const file = await service.getById(String(req.params.id));
  if (!file) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  const content = await fs.readFile(file.storage_path);
  res.setHeader("Content-Type", file.mime_type || "application/octet-stream");
  res.send(content);
});

export default router;
