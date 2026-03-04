import type { LohnsteuerInputs, LohnsteuerOutputs, PapInstance } from "./types";
import { Pap2025 } from "./pap2025";
import { Pap2026 } from "./pap2026";

type PapConstructor = new () => PapInstance;

const PAP_REGISTRY: Record<number, PapConstructor> = {
  2025: Pap2025,
  2026: Pap2026,
};

/**
 * Calculate German wage tax (Lohnsteuer) for the given year and inputs.
 *
 * @param year - Tax year (e.g. 2025, 2026)
 * @param inputs - Input parameters (all monetary values in Cent)
 * @returns Output values (all monetary values in Cent)
 *
 * @example
 * ```typescript
 * const result = calculate(2026, { LZZ: 2, RE4: 500000, STKL: 1 });
 * console.log(result.LSTLZZ); // Wage tax in Cent
 * ```
 */
export function calculate(
  year: number,
  inputs: LohnsteuerInputs,
): LohnsteuerOutputs {
  const PapClass = PAP_REGISTRY[year];
  if (!PapClass) {
    const supported = Object.keys(PAP_REGISTRY).join(", ");
    throw new Error(`Unsupported tax year: ${year}. Supported: ${supported}`);
  }
  const pap = new PapClass();
  pap.setInputs(inputs);
  pap.calculate();
  return pap.getOutputs();
}

/** List of supported tax years. */
export const SUPPORTED_YEARS = Object.keys(PAP_REGISTRY).map(Number);
