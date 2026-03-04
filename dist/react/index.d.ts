import { LohnsteuerInputs, LohnsteuerOutputs } from '../core/index.js';
export { ALL_OUTPUT_NAMES, DBA_OUTPUT_NAMES, INPUT_DEFAULTS, LohnsteuerInternals, PapConstants, PapInstance, STANDARD_OUTPUT_NAMES, SUPPORTED_YEARS, calculate } from '../core/index.js';
import { ChangeEvent, ReactNode } from 'react';
import 'decimal.js';

interface UseLohnsteuerState {
    year: number;
    inputs: LohnsteuerInputs;
    outputs: LohnsteuerOutputs | null;
    error: string | null;
}
interface UseLohnsteuerOptions {
    year?: number;
    inputs?: LohnsteuerInputs;
    autoCalculate?: boolean;
    onChange?: (state: UseLohnsteuerState) => void;
}
interface NumberInputProps {
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}
interface SelectInputProps {
    value: string;
    onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}
interface CheckboxInputProps {
    checked: boolean;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}
interface UseLohnsteuerReturn {
    year: number;
    supportedYears: number[];
    inputs: LohnsteuerInputs;
    outputs: LohnsteuerOutputs | null;
    error: string | null;
    setYear: (year: number) => void;
    setInputs: (inputs: LohnsteuerInputs) => void;
    setInput: <K extends keyof LohnsteuerInputs>(key: K, value: LohnsteuerInputs[K] | undefined) => void;
    calculateNow: () => void;
    getNumberInputProps: (key: keyof LohnsteuerInputs) => NumberInputProps;
    getSelectInputProps: (key: keyof LohnsteuerInputs) => SelectInputProps;
    getCheckboxInputProps: (key: keyof LohnsteuerInputs, checkedValue?: number, uncheckedValue?: number) => CheckboxInputProps;
}
declare function useLohnsteuer(options?: UseLohnsteuerOptions): UseLohnsteuerReturn;

interface RenderProps extends UseLohnsteuerState {
    supportedYears: number[];
    setYear: (year: number) => void;
    setInput: ReturnType<typeof useLohnsteuer>["setInput"];
    calculateNow: () => void;
    getNumberInputProps: (key: keyof UseLohnsteuerState["inputs"]) => NumberInputProps;
    getSelectInputProps: (key: keyof UseLohnsteuerState["inputs"]) => SelectInputProps;
    getCheckboxInputProps: (key: keyof UseLohnsteuerState["inputs"], checkedValue?: number, uncheckedValue?: number) => CheckboxInputProps;
}
interface LohnsteuerCalculatorProps extends UseLohnsteuerOptions {
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
declare function LohnsteuerCalculator({ children, ...options }: LohnsteuerCalculatorProps): ReactNode;

export { type CheckboxInputProps, LohnsteuerCalculator, type LohnsteuerCalculatorProps, LohnsteuerInputs, LohnsteuerOutputs, type NumberInputProps, type RenderProps, type SelectInputProps, type UseLohnsteuerOptions, type UseLohnsteuerReturn, type UseLohnsteuerState, useLohnsteuer };
