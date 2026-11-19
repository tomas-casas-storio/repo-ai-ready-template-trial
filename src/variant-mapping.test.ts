import { describe, expect, it } from "vitest";
import { resolveMapping, UnsupportedVariantError } from "./variant-mapping.js";

// Each acceptance criterion in the Jira spec maps to one named test.
describe("resolveMapping", () => {
  it("AC1: resolves a known variant to its agreed mapping", () => {
    expect(resolveMapping("alpha", "pro")).toEqual({
      sku: "A-200",
      line: "L1",
    });
  });

  it("AC2: keeps existing mappings unchanged", () => {
    expect(resolveMapping("alpha", "standard")).toEqual({
      sku: "A-100",
      line: "L1",
    });
    expect(resolveMapping("beta", "standard")).toEqual({
      sku: "B-100",
      line: "L2",
    });
  });

  it("AC3: rejects unsupported combinations with a validation error", () => {
    expect(() => resolveMapping("beta", "max")).toThrow(
      UnsupportedVariantError,
    );
  });
});

describe("beta pro", () => {
  it("AC4: resolves beta pro", () => {
    expect(resolveMapping("beta", "pro")).toEqual({ sku: "B-200", line: "L2" });
  });
});
