import type { ReactNode } from "react";

import { useLohnsteuer } from "./useLohnsteuer";
import type {
  CheckboxInputProps,
  NumberInputProps,
  SelectInputProps,
  UseLohnsteuerOptions,
  UseLohnsteuerState,
} from "./useLohnsteuer";

export interface RenderProps extends UseLohnsteuerState {
  supportedYears: number[];
  setYear: (year: number) => void;
  setInput: ReturnType<typeof useLohnsteuer>["setInput"];
  calculateNow: () => void;
  getNumberInputProps: (key: keyof UseLohnsteuerState["inputs"]) => NumberInputProps;
  getSelectInputProps: (key: keyof UseLohnsteuerState["inputs"]) => SelectInputProps;
  getCheckboxInputProps: (
    key: keyof UseLohnsteuerState["inputs"],
    checkedValue?: number,
    uncheckedValue?: number,
  ) => CheckboxInputProps;
}

export interface LohnsteuerCalculatorProps extends UseLohnsteuerOptions {
  children: (props: RenderProps) => ReactNode;
}

/**
 * Headless render-props component for Lohnsteuer calculation.
 *
 * @example
 * ```tsx
 * <LohnsteuerCalculator>
 *   {({ getNumberInputProps, getSelectInputProps, getCheckboxInputProps, outputs }) => (
 *     <>
 *       <select {...getSelectInputProps("LZZ")} />
 *       <input type="number" {...getNumberInputProps("RE4")} />
 *       <select {...getSelectInputProps("STKL")} />
 *       <input type="number" {...getNumberInputProps("KVZ")} />
 *       <input type="checkbox" {...getCheckboxInputProps("PVZ")} />
 *       <pre>{JSON.stringify(outputs, null, 2)}</pre>
 *     </>
 *   )}
 * </LohnsteuerCalculator>
 * ```
 */
export function LohnsteuerCalculator({
  children,
  ...options
}: LohnsteuerCalculatorProps): ReactNode {
  const {
    year,
    supportedYears,
    inputs,
    outputs,
    error,
    setYear,
    setInput,
    calculateNow,
    getNumberInputProps,
    getSelectInputProps,
    getCheckboxInputProps,
  } = useLohnsteuer(options);

  return children({
    year,
    supportedYears,
    inputs,
    outputs,
    error,
    setYear,
    setInput,
    calculateNow,
    getNumberInputProps,
    getSelectInputProps,
    getCheckboxInputProps,
  });
}
