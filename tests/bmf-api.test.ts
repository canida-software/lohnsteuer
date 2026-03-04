import { describe, expect, test } from "vitest";
import { calculate } from "../src/core/calculate";

type ApiVector = {
  name: string;
  query: string;
  inputs: Parameters<typeof calculate>[1];
};

const API_BASE =
  "https://www.bmf-steuerrechner.de/interface/2026Version1.xhtml?code=LSt2026ext";

const OUTPUT_FIELDS = [
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
] as const;

const VECTORS: ApiVector[] = [
  {
    name: "monthly STKL1 with KVZ and PVZ",
    query: "LZZ=2&RE4=500000&STKL=1&KVZ=2.50&PVZ=1",
    inputs: { LZZ: 2, RE4: 500000, STKL: 1, KVZ: 2.5, PVZ: 1 },
  },
  {
    name: "annual STKL1 base case",
    query: "LZZ=1&RE4=2500000&STKL=1",
    inputs: { LZZ: 1, RE4: 2500000, STKL: 1 },
  },
  {
    name: "monthly STKL6 case",
    query: "LZZ=2&RE4=420000&STKL=6",
    inputs: { LZZ: 2, RE4: 420000, STKL: 6 },
  },
];

function parseOutputValues(xml: string): Record<string, number> {
  const result: Record<string, number> = {};
  const regex = /<ausgabe\s+name="([^"]+)"\s+value="([^"]+)"/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(xml)) !== null) {
    result[match[1]] = Number(match[2]);
  }
  return result;
}

describe("BMF external API parity (2026)", () => {
  for (const vector of VECTORS) {
    test(vector.name, async () => {
      const response = await fetch(`${API_BASE}&${vector.query}`);
      expect(response.ok).toBe(true);

      const xml = await response.text();
      const expected = parseOutputValues(xml);
      const actual = calculate(2026, vector.inputs);

      for (const field of OUTPUT_FIELDS) {
        expect(actual[field]).toBe(expected[field]);
      }
    }, 20000);
  }
});
