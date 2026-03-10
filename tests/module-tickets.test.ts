import { describe, expect, it } from "vitest";
import router from "../src/modules/tickets/routes";

describe("module tickets route surface", () => {
  it("exposes route handlers", () => {
    const stack = (router as any).stack || [];
    expect(stack.length).toBeGreaterThan(0);
  });
});
