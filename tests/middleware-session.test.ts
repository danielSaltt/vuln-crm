import { describe, expect, it } from "vitest";
import { getSessionStoreSize } from "../src/middleware/session";

describe("session middleware helpers", () => {
  it("exposes session store size accessor", () => {
    expect(typeof getSessionStoreSize()).toBe("number");
  });
});
