import { describe, expect, it } from "vitest";
import { auditTrail } from "../src/middleware/audit";

describe("audit middleware exports", () => {
  it("provides audit handler", () => {
    expect(typeof auditTrail).toBe("function");
  });
});
