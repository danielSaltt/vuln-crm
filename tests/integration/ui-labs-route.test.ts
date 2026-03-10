import { describe, expect, it } from "vitest";
import uiRouter from "../../src/routes/ui";

describe("ui labs route", () => {
  it("mounts /labs", () => {
    const stack = (uiRouter as any).stack || [];
    const paths = stack
      .map((layer: any) => layer?.route?.path)
      .filter((value: any) => typeof value === "string");

    expect(paths).toContain("/labs");
  });
});
