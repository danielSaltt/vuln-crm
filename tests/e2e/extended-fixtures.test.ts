import fs from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

const fixtureRoot = path.join(process.cwd(), "fixtures");

describe("extended fixture coverage", () => {
  it("contains seeded files for additional operational modules", async () => {
    const groups = ["tasks", "tickets", "campaigns", "invoices", "activities", "webhooks", "workflows", "reports"];

    for (const group of groups) {
      const files = await fs.readdir(path.join(fixtureRoot, group));
      const jsonCount = files.filter((f) => f.endsWith(".json")).length;
      expect(jsonCount).toBeGreaterThanOrEqual(20);
    }
  });
});
