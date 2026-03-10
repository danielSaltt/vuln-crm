import { describe, expect, it } from "vitest";
import { requireTenant } from "../src/middleware/tenant";

describe("tenant middleware exports", () => {
  it("provides tenant guard", () => {
    expect(typeof requireTenant).toBe("function");
  });
});
