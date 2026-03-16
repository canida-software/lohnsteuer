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

export interface LohnsteuerRechnerProps extends UseLohnsteuerOptions {
  children: (props: RenderProps) => ReactNode;
}

/**
 * Headless render-props component for Lohnsteuer calculation.
 *
 * @example
 * ```tsx
 * <LohnsteuerRechner>
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
 * </LohnsteuerRechner>
 * ```
 */
export function LohnsteuerRechner({
  children,
  ...options
}: LohnsteuerRechnerProps): ReactNode {
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
