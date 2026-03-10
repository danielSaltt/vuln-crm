import { describe, expect, it } from "vitest";
import router from "../src/modules/users/routes";

describe("module users route surface", () => {
  it("exposes route handlers", () => {
    const stack = (router as any).stack || [];
    expect(stack.length).toBeGreaterThan(0);
  });
});
