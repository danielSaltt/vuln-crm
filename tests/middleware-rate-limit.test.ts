import { describe, expect, it } from "vitest";
import { weakRateLimit } from "../src/middleware/rateLimit";

describe("rate limit middleware exports", () => {
  it("provides rate limiter", () => {
    expect(typeof weakRateLimit).toBe("function");
  });
});
