(function initLabConsole() {
  const output = document.getElementById("labsOutput");
  if (!output) {
    return;
  }

  const byId = (id) => document.getElementById(id);

  function log(title, data) {
    const stamp = new Date().toISOString();
    const payload = typeof data === "string" ? data : JSON.stringify(data, null, 2);
    output.textContent = `[${stamp}] ${title}\n${payload}\n\n` + output.textContent;
  }

  function safeJsonParse(raw, fallback = {}) {
    try {
      return JSON.parse(raw);
    } catch {
      return fallback;
    }
  }

  async function requestApi({ method, path, body, headers, redirect = "follow" }) {
    const options = {
      method,
      credentials: "include",
      headers: { ...headers },
      redirect
    };

    if (body !== undefined && method !== "GET") {
      if (!(body instanceof FormData)) {
        options.headers["content-type"] = "application/json";
        options.body = JSON.stringify(body);
      } else {
        options.body = body;
      }
    }

    const response = await fetch(path, options);
    const contentType = response.headers.get("content-type") || "";
    const location = response.headers.get("location");

    let parsed;
    if (contentType.includes("application/json")) {
      parsed = await response.json();
    } else {
      parsed = await response.text();
    }

    const result = {
      method,
      path,
      status: response.status,
      ok: response.ok,
      redirected: response.redirected,
      location,
      response: parsed
    };

    log(`${method} ${path}`, result);
    return result;
  }

  async function runQuick(method, path) {
    try {
      await requestApi({ method, path, headers: {} });
    } catch (error) {
      log(`Error ${method} ${path}`, String(error));
    }
  }

  const checks = {
    async v1() {
      const q = encodeURIComponent(String(byId("searchTerm").value || "test"));
      await requestApi({ method: "GET", path: `/api/v1/contacts/search?q=${q}`, headers: {} });
    },
    async v2() {
      await requestApi({
        method: "POST",
        path: "/api/v1/notes",
        body: {
          entity_type: "contact",
          entity_id: String(byId("contactId").value || "contact-01"),
          body: "<b>lab-note</b>"
        },
        headers: {}
      });
    },
    async v3() {
      const q = encodeURIComponent(String(byId("searchTerm").value || "test"));
      window.location.href = `/dashboard?q=${q}`;
    },
    async v4() {
      await requestApi({
        method: "GET",
        path: `/api/v1/contacts/${encodeURIComponent(String(byId("contactId").value || "contact-01"))}`,
        headers: {}
      });
    },
    async v5() {
      await requestApi({
        method: "POST",
        path: "/api/v1/contacts",
        body: {
          tenant_id: String(byId("overrideTenant").value || "tenant-01"),
          owner_id: String(byId("userId").value || "user-seed-viewer"),
          first_name: "Mass",
          last_name: "Assign",
          email: "mass.assign@example.test"
        },
        headers: {}
      });
    },
    async v6() {
      await requestApi({ method: "GET", path: "/api/v1/admin?asAdmin=1", headers: {} });
    },
    async v7() {
      await requestApi({
        method: "POST",
        path: `/api/v1/users/${encodeURIComponent(String(byId("userId").value || "user-seed-viewer"))}/role`,
        body: { role: "admin" },
        headers: {}
      });
    },
    async v8() {
      await requestApi({
        method: "POST",
        path: "/api/v1/auth/request-reset",
        body: { username: String(byId("resetUser").value || "viewer1") },
        headers: {}
      });
    },
    async v9() {
      await requestApi({
        method: "GET",
        path: "/api/v1/admin/debug/secrets",
        headers: {
          "x-role": String(byId("overrideRole").value || "admin"),
          "x-tenant-id": String(byId("overrideTenant").value || "tenant-01")
        }
      });
    },
    async v10() {
      await requestApi({
        method: "POST",
        path: "/api/v1/contacts",
        body: {
          first_name: "No",
          last_name: "Csrf",
          email: "no.csrf@example.test"
        },
        headers: {}
      });
    },
    async v11() {
      const target = encodeURIComponent(String(byId("redirectTarget").value || "https://example.com"));
      await requestApi({ method: "GET", path: `/redirect?next=${target}`, headers: {}, redirect: "manual" });
    },
    async v12() {
      const prefsRaw = String(byId("prefsRaw").value || "({ theme: 'lab' })");
      const encoded = btoa(prefsRaw);
      document.cookie = `prefs=${encoded}; path=/`;
      log("Set prefs cookie", { value: encoded });
      window.location.href = "/dashboard";
    },
    async v13() {
      const filename = String(byId("uploadFilename").value || "sample.html");
      const form = new FormData();
      form.append("file", new Blob(["lab upload"], { type: "text/plain" }), filename);
      await requestApi({ method: "POST", path: "/api/v1/files/upload", body: form, headers: {} });
    },
    async v14() {
      await requestApi({
        method: "POST",
        path: "/api/v1/admin/webhook-test",
        body: { url: String(byId("webhookUrl").value || "http://example.com") },
        headers: {}
      });
    },
    async v15() {
      const host = encodeURIComponent(String(byId("diagHost").value || "127.0.0.1"));
      await requestApi({ method: "GET", path: `/api/v1/admin/diagnostics?host=${host}`, headers: {} });
    },
    async v16() {
      await requestApi({ method: "GET", path: "/api/v1/admin/debug/secrets", headers: {} });
    },
    async v17() {
      const attempts = 25;
      const all = await Promise.all(
        Array.from({ length: attempts }).map((_, idx) =>
          fetch("/health", {
            method: "GET",
            credentials: "include",
            headers: { "x-forwarded-for": `10.0.0.${idx + 1}` }
          }).then((response) => response.status)
        )
      );
      log("Burst request statuses", all);
    },
    async v18() {
      const dealId = encodeURIComponent(String(byId("dealId").value || "deal-01"));
      const attempts = 8;
      const all = await Promise.all(
        Array.from({ length: attempts }).map(() =>
          fetch(`/api/v1/deals/${dealId}/promote`, {
            method: "POST",
            credentials: "include",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({})
          }).then((response) => response.status)
        )
      );
      log("Concurrent promote statuses", all);
    }
  };

  document.querySelectorAll(".run-btn[data-method][data-path]").forEach((button) => {
    button.addEventListener("click", async () => {
      const method = button.getAttribute("data-method");
      const path = button.getAttribute("data-path");
      await runQuick(method, path);
    });
  });

  document.querySelectorAll(".check-btn[data-check]").forEach((button) => {
    button.addEventListener("click", async () => {
      const id = button.getAttribute("data-check");
      const fn = checks[id];
      if (!fn) {
        log("Missing check handler", id);
        return;
      }
      try {
        await fn();
      } catch (error) {
        log(`Check ${id} error`, String(error));
      }
    });
  });

  const customRunner = byId("runCustom");
  customRunner?.addEventListener("click", async () => {
    const method = String(byId("customMethod").value || "GET");
    const path = String(byId("customPath").value || "/api/v1/contacts");
    const headers = safeJsonParse(String(byId("customHeaders").value || "{}"), {});
    const body = safeJsonParse(String(byId("customBody").value || "{}"), {});

    try {
      await requestApi({ method, path, headers, body: method === "GET" ? undefined : body });
    } catch (error) {
      log("Custom runner error", String(error));
    }
  });
})();
