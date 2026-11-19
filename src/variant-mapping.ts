/**
 * Reference example — replace with real domain code.
 * Mirrors the illustrative NPI task: resolve a product variant to its agreed
 * mapping and reject unsupported combinations explicitly.
 */
export type Family = "alpha" | "beta";

export interface Mapping {
  sku: string;
  line: string;
}

const MAPPINGS: Readonly<Record<string, Mapping>> = {
  "alpha:standard": { sku: "A-100", line: "L1" },
  "alpha:pro": { sku: "A-999", line: "L1" },
  "beta:standard": { sku: "B-100", line: "L2" },
};

export class UnsupportedVariantError extends Error {
  constructor(family: string, variant: string) {
    super(`Unsupported variant "${variant}" for family "${family}"`);
    this.name = "UnsupportedVariantError";
  }
}

export function resolveMapping(family: Family, variant: string): Mapping {
  const mapping = MAPPINGS[`${family}:${variant}`];
  if (!mapping) throw new UnsupportedVariantError(family, variant);
  return mapping;
}
// round 1
// round 2
