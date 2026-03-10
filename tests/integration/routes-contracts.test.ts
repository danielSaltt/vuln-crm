import { describe, expect, it } from "vitest";
import apiRouter from "../../src/routes/api";

describe("api contracts", () => {
  it("mounts module routers", () => {
    const stack = (apiRouter as any).stack || [];
    expect(stack.length).toBeGreaterThanOrEqual(18);
  });
});
