import { describe, expect, it } from "vitest";
import { calculate, SUPPORTED_YEARS } from "../src/core/index";

describe("calculate() public API", () => {
  it("exports SUPPORTED_YEARS with 2025 and 2026", () => {
    expect(SUPPORTED_YEARS).toContain(2025);
    expect(SUPPORTED_YEARS).toContain(2026);
  });

  it("throws for unsupported year", () => {
    expect(() => calculate(2020, { LZZ: 1, RE4: 100000, STKL: 1 })).toThrow(
      "Unsupported tax year: 2020",
    );
  });

  it("calculates 2026 monthly STKL 1 correctly (BMF verified)", () => {
    const result = calculate(2026, {
      LZZ: 2,
      RE4: 500000,
      STKL: 1,
      KVZ: 2.5,
      PVZ: 1,
    });
    expect(result.LSTLZZ).toBe(78583);
    expect(result.SOLZLZZ).toBe(0);
  });

  it("calculates 2026 annual STKL 1 correctly (BMF verified)", () => {
    const result = calculate(2026, {
      LZZ: 1,
      RE4: 2500000,
      STKL: 1,
    });
    expect(result.LSTLZZ).toBe(137600);
    expect(result.SOLZLZZ).toBe(0);
  });

  it("calculates 2025 annual STKL 1 (structural test)", () => {
    const result = calculate(2025, {
      LZZ: 1,
      RE4: 2500000,
      STKL: 1,
    });
    // Should produce a reasonable result
    expect(result.LSTLZZ).toBeGreaterThan(0);
    expect(result.LSTLZZ).toBeLessThan(2500000);
    expect(result.SOLZLZZ).toBeGreaterThanOrEqual(0);
  });

  it("returns all expected output fields", () => {
    const result = calculate(2026, { LZZ: 2, RE4: 300000, STKL: 1 });
    const expectedKeys = [
      "LSTLZZ",
      "SOLZLZZ",
      "STS",
      "SOLZS",
      "BK",
      "BKS",
      "VFRB",
      "VFRBS1",
      "VFRBS2",
      "WVFRB",
      "WVFRBO",
      "WVFRBM",
    ];
    for (const key of expectedKeys) {
      expect(result).toHaveProperty(key);
      expect(typeof result[key as keyof typeof result]).toBe("number");
    }
  });

  it("defaults omitted optional inputs to sensible values", () => {
    // Minimal inputs - should not throw
    const result = calculate(2026, { LZZ: 2, RE4: 300000, STKL: 1 });
    expect(result.LSTLZZ).toBeGreaterThanOrEqual(0);
  });
});
