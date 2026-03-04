import { useCallback, useEffect, useState, type ChangeEvent } from "react";

import {
  calculate,
  SUPPORTED_YEARS,
  type LohnsteuerInputs,
  type LohnsteuerOutputs,
} from "../core";

export interface UseLohnsteuerState {
  year: number;
  inputs: LohnsteuerInputs;
  outputs: LohnsteuerOutputs | null;
  error: string | null;
}

export interface UseLohnsteuerOptions {
  year?: number;
  inputs?: LohnsteuerInputs;
  autoCalculate?: boolean;
  onChange?: (state: UseLohnsteuerState) => void;
}

export interface NumberInputProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export interface SelectInputProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

export interface CheckboxInputProps {
  checked: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export interface UseLohnsteuerReturn {
  year: number;
  supportedYears: number[];
  inputs: LohnsteuerInputs;
  outputs: LohnsteuerOutputs | null;
  error: string | null;
  setYear: (year: number) => void;
  setInputs: (inputs: LohnsteuerInputs) => void;
  setInput: <K extends keyof LohnsteuerInputs>(
    key: K,
    value: LohnsteuerInputs[K] | undefined,
  ) => void;
  calculateNow: () => void;
  getNumberInputProps: (key: keyof LohnsteuerInputs) => NumberInputProps;
  getSelectInputProps: (key: keyof LohnsteuerInputs) => SelectInputProps;
  getCheckboxInputProps: (
    key: keyof LohnsteuerInputs,
    checkedValue?: number,
    uncheckedValue?: number,
  ) => CheckboxInputProps;
}

function parseNumberish(value: string): number | undefined {
  if (value.trim() === "") {
    return undefined;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function toInputString(value: number | undefined): string {
  return value === undefined ? "" : String(value);
}

export function useLohnsteuer(
  options: UseLohnsteuerOptions = {},
): UseLohnsteuerReturn {
  const {
    year = SUPPORTED_YEARS[SUPPORTED_YEARS.length - 1],
    inputs = {},
    autoCalculate = true,
    onChange,
  } = options;

  const [stateYear, setStateYear] = useState(year);
  const [stateInputs, setStateInputs] = useState<LohnsteuerInputs>(inputs);
  const [outputs, setOutputs] = useState<LohnsteuerOutputs | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setStateYear(year);
  }, [year]);

  useEffect(() => {
    setStateInputs(inputs);
  }, [inputs]);

  const calculateNow = useCallback(() => {
    try {
      const next = calculate(stateYear, stateInputs);
      setOutputs(next);
      setError(null);
    } catch (err) {
      setOutputs(null);
      setError(err instanceof Error ? err.message : String(err));
    }
  }, [stateYear, stateInputs]);

  useEffect(() => {
    if (autoCalculate) {
      calculateNow();
    }
  }, [autoCalculate, calculateNow]);

  useEffect(() => {
    onChange?.({
      year: stateYear,
      inputs: stateInputs,
      outputs,
      error,
    });
  }, [stateYear, stateInputs, outputs, error, onChange]);

  const setInput = useCallback(
    <K extends keyof LohnsteuerInputs>(
      key: K,
      value: LohnsteuerInputs[K] | undefined,
    ) => {
      setStateInputs((prev: LohnsteuerInputs) => ({
        ...prev,
        [key]: value,
      }));
    },
    [],
  );

  const getNumberInputProps = useCallback(
    (key: keyof LohnsteuerInputs): NumberInputProps => ({
      value: toInputString(stateInputs[key] as number | undefined),
      onChange: (e) => {
        setInput(key, parseNumberish(e.target.value));
      },
    }),
    [setInput, stateInputs],
  );

  const getSelectInputProps = useCallback(
    (key: keyof LohnsteuerInputs): SelectInputProps => ({
      value: toInputString(stateInputs[key] as number | undefined),
      onChange: (e) => {
        setInput(key, parseNumberish(e.target.value));
      },
    }),
    [setInput, stateInputs],
  );

  const getCheckboxInputProps = useCallback(
    (
      key: keyof LohnsteuerInputs,
      checkedValue = 1,
      uncheckedValue = 0,
    ): CheckboxInputProps => ({
      checked: Number(stateInputs[key] ?? 0) === checkedValue,
      onChange: (e) => {
        setInput(key, e.target.checked ? checkedValue : uncheckedValue);
      },
    }),
    [setInput, stateInputs],
  );

  return {
    year: stateYear,
    supportedYears: SUPPORTED_YEARS,
    inputs: stateInputs,
    outputs,
    error,
    setYear: setStateYear,
    setInputs: setStateInputs,
    setInput,
    calculateNow,
    getNumberInputProps,
    getSelectInputProps,
    getCheckboxInputProps,
  };
}
