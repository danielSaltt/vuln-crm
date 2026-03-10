import fs from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

const fixturesDir = path.join(process.cwd(), "fixtures", "users");

describe("seed user contracts", () => {
  it("contains required seeded role identities", async () => {
    const required = ["user-seed-admin.json", "user-seed-manager.json", "user-seed-agent.json", "user-seed-viewer.json", "user-cross-tenant-admin.json"];
    for (const file of required) {
      const raw = await fs.readFile(path.join(fixturesDir, file), "utf8");
      const parsed = JSON.parse(raw);
      expect(parsed.username).toBeTruthy();
      expect(parsed.password).toBe("Password123!");
    }
  });
});
