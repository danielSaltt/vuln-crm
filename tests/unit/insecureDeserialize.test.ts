import { describe, expect, it } from "vitest";
import { deserializePreferences } from "../../src/lib/insecureDeserialize";

describe("deserializePreferences", () => {
  it("returns parsed object for base64 encoded object expression", () => {
    const payload = Buffer.from("({ theme: 'sunset', nav: 'compact' })", "utf8").toString("base64");
    const parsed = deserializePreferences(payload);
    expect(parsed.theme).toBe("sunset");
  });

  it("returns empty object for invalid payload", () => {
    expect(deserializePreferences("%%%invalid%%%")) .toEqual({});
  });
});
