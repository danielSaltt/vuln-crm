#!/usr/bin/env bash
set -euo pipefail

modules=(
  auth tenants users contacts accounts deals notes files apikeys audits admin
  tasks tickets campaigns invoices activities webhooks workflows reports
  products subscriptions contracts quotes forecasts segments playbooks escalations
  onboardings integrations notifications announcements
)

for m in "${modules[@]}"; do
  cat > "tests/module-${m}.test.ts" <<TS
import { describe, expect, it } from "vitest";
import router from "../src/modules/${m}/routes";

describe("module ${m} route surface", () => {
  it("exposes route handlers", () => {
    const stack = (router as any).stack || [];
    expect(stack.length).toBeGreaterThan(0);
  });
});
TS
done

cat > tests/middleware-session.test.ts <<'TS'
import { describe, expect, it } from "vitest";
import { getSessionStoreSize } from "../src/middleware/session";

describe("session middleware helpers", () => {
  it("exposes session store size accessor", () => {
    expect(typeof getSessionStoreSize()).toBe("number");
  });
});
TS

cat > tests/middleware-auth.test.ts <<'TS'
import { describe, expect, it } from "vitest";
import { requireAuth, requireRole } from "../src/middleware/auth";

describe("auth middleware exports", () => {
  it("provides auth guards", () => {
    expect(typeof requireAuth).toBe("function");
    expect(typeof requireRole("viewer")).toBe("function");
  });
});
TS

cat > tests/middleware-tenant.test.ts <<'TS'
import { describe, expect, it } from "vitest";
import { requireTenant } from "../src/middleware/tenant";

describe("tenant middleware exports", () => {
  it("provides tenant guard", () => {
    expect(typeof requireTenant).toBe("function");
  });
});
TS

cat > tests/middleware-rate-limit.test.ts <<'TS'
import { describe, expect, it } from "vitest";
import { weakRateLimit } from "../src/middleware/rateLimit";

describe("rate limit middleware exports", () => {
  it("provides rate limiter", () => {
    expect(typeof weakRateLimit).toBe("function");
  });
});
TS

cat > tests/middleware-audit.test.ts <<'TS'
import { describe, expect, it } from "vitest";
import { auditTrail } from "../src/middleware/audit";

describe("audit middleware exports", () => {
  it("provides audit handler", () => {
    expect(typeof auditTrail).toBe("function");
  });
});
TS

cat > tests/middleware-error.test.ts <<'TS'
import { describe, expect, it } from "vitest";
import { errorMiddleware } from "../src/middleware/error";

describe("error middleware exports", () => {
  it("provides error middleware", () => {
    expect(typeof errorMiddleware).toBe("function");
  });
});
TS
