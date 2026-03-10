import { describe, expect, it } from "vitest";
import { errorMiddleware } from "../src/middleware/error";

describe("error middleware exports", () => {
  it("provides error middleware", () => {
    expect(typeof errorMiddleware).toBe("function");
  });
});
