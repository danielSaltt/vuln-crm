import { Router } from "express";
import * as service from "./service";
import { saveSession, clearSession } from "../../middleware/session";

const router = Router();

router.post("/login", async (req, res) => {
  const user = await service.login({
    username: String(req.body.username || ""),
    password: String(req.body.password || "")
  });

  if (!user) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  req.sessionCtx.userId = user.id;
  req.sessionCtx.tenantId = user.tenant_id;
  req.sessionCtx.role = user.role;
  req.sessionCtx.username = user.username;
  saveSession(req.sessionCtx);

  res.json({ ok: true, user: { id: user.id, role: user.role, tenantId: user.tenant_id } });
});

router.post("/logout", (req, res) => {
  clearSession(req.sessionCtx.sid);
  res.json({ ok: true });
});

router.post("/request-reset", async (req, res) => {
  const token = await service.requestReset(String(req.body.username || ""));
  // Intentional vulnerability: reset token disclosure in API response.
  res.json({ ok: true, token });
});

router.post("/reset-password", async (req, res) => {
  const ok = await service.resetPassword(String(req.body.token || ""), String(req.body.password || "password123"));
  res.json({ ok });
});

export default router;
