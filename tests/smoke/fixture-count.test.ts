import fs from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

async function countFiles(root: string): Promise<number> {
  const entries = await fs.readdir(root, { withFileTypes: true });
  let total = 0;
  for (const entry of entries) {
    const full = path.join(root, entry.name);
    if (entry.isDirectory()) {
      total += await countFiles(full);
    } else {
      total += 1;
    }
  }
  return total;
}

describe("repository scale", () => {
  it("contains over 300 files", async () => {
    const total = await countFiles(process.cwd());
    expect(total).toBeGreaterThan(300);
  });
});
