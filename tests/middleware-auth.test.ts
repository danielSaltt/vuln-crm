import { describe, expect, it } from "vitest";
import { requireAuth, requireRole } from "../src/middleware/auth";

describe("auth middleware exports", () => {
  it("provides auth guards", () => {
    expect(typeof requireAuth).toBe("function");
    expect(typeof requireRole("viewer")).toBe("function");
  });
});
