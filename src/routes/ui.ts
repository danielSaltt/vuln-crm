import { Router } from "express";
import { query } from "../db/postgres";
import { deserializePreferences } from "../lib/insecureDeserialize";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.get("/", (_req, res) => {
  res.render("auth/login", { title: "Vuln CRM", error: null });
});

router.get("/dashboard", requireAuth, async (req, res) => {
  const q = String(req.query.q || "");
  const notes = await query("SELECT * FROM notes WHERE tenant_id = $1 ORDER BY created_at DESC LIMIT 30", [req.sessionCtx.tenantId]);
  const prefs = deserializePreferences(req.cookies.prefs);

  // Intentional vulnerability: reflected XSS by raw query injection in template variable.
  res.render("crm/dashboard", {
    title: "Dashboard",
    user: req.sessionCtx,
    notes,
    searchTerm: q,
    prefs
  });
});

router.get("/redirect", (req, res) => {
  // Intentional vulnerability: open redirect.
  const target = String(req.query.next || "/dashboard");
  res.redirect(target);
});

router.get("/health", (_req, res) => {
  res.json({ ok: true, service: "aikido-vuln-crm" });
});

export default router;
