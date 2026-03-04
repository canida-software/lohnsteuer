import { describe, test, expect } from "vitest";
import { Pap2026 } from "../src/core/pap2026";
import type { LohnsteuerInputs, LohnsteuerOutputs } from "../src/core/types";
import fixtures from "./fixtures/bmf-2026.json";

function calc(inputs: LohnsteuerInputs): LohnsteuerOutputs {
  const pap = new Pap2026();
  pap.setInputs(inputs);
  pap.calculate();
  return pap.getOutputs();
}

describe("Pap2026 known test vectors", () => {
  test("yearly 25000 EUR STKL 1 -> LSTLZZ=137600", () => {
    const r = calc({ LZZ: 1, RE4: 2500000, STKL: 1 });
    expect(r.LSTLZZ).toBe(137600);
    expect(r.SOLZLZZ).toBe(0);
  });

  test("monthly 5000 EUR STKL 1 with KVZ=2.50 PVZ=1 -> LSTLZZ=78583", () => {
    const r = calc({ LZZ: 2, RE4: 500000, STKL: 1, KVZ: 2.50, PVZ: 1 });
    expect(r.LSTLZZ).toBe(78583);
    expect(r.SOLZLZZ).toBe(0);
  });

  test("zero income -> zero tax", () => {
    const r = calc({ LZZ: 2, RE4: 0, STKL: 1 });
    expect(r.LSTLZZ).toBe(0);
    expect(r.SOLZLZZ).toBe(0);
  });
});

describe("Pap2026 BMF API fixtures (207 vectors)", () => {
  const data = fixtures as Array<{
    inputs: LohnsteuerInputs;
    expected: Record<string, number>;
  }>;

  for (const { inputs, expected } of data) {
    const label = Object.entries(inputs)
      .map(([k, v]) => `${k}=${v}`)
      .join(" ");

    test(label, () => {
      const actual = calc(inputs);
      expect(actual.LSTLZZ).toBe(expected.LSTLZZ);
      expect(actual.SOLZLZZ).toBe(expected.SOLZLZZ);
      expect(actual.STS).toBe(expected.STS);
      expect(actual.SOLZS).toBe(expected.SOLZS);
      expect(actual.BK).toBe(expected.BK);
      expect(actual.BKS).toBe(expected.BKS);
      expect(actual.VFRB).toBe(expected.VFRB);
      expect(actual.VFRBS1).toBe(expected.VFRBS1);
      expect(actual.VFRBS2).toBe(expected.VFRBS2);
      expect(actual.WVFRB).toBe(expected.WVFRB);
      expect(actual.WVFRBO).toBe(expected.WVFRBO);
      expect(actual.WVFRBM).toBe(expected.WVFRBM);
    });
  }
});
