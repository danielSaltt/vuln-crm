import { describe, expect, it } from "vitest";
import { buildApp } from "../../src/app";

describe("app bootstrap", () => {
  it("builds express app instance", async () => {
    const app = await buildApp();
    expect(app).toBeDefined();
    expect(typeof app.use).toBe("function");
  });
});
