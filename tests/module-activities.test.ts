import { describe, expect, it } from "vitest";
import router from "../src/modules/activities/routes";

describe("module activities route surface", () => {
  it("exposes route handlers", () => {
    const stack = (router as any).stack || [];
    expect(stack.length).toBeGreaterThan(0);
  });
});
