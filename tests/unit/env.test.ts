import { describe, expect, it } from "vitest";
import { env } from "../../src/config/env";

describe("env", () => {
  it("exposes default app configuration", () => {
    expect(env.port).toBeTypeOf("number");
    expect(env.databaseUrl).toContain("postgres");
    expect(env.redisUrl).toContain("redis");
  });
});
