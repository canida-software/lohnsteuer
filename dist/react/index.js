import {
  ALL_OUTPUT_NAMES,
  DBA_OUTPUT_NAMES,
  INPUT_DEFAULTS,
  STANDARD_OUTPUT_NAMES,
  SUPPORTED_YEARS,
  calculate
} from "../chunk-WBDRFOIQ.js";

// src/react/useLohnsteuer.ts
import { useCallback, useEffect, useState } from "react";
function parseNumberish(value) {
  if (value.trim() === "") {
    return void 0;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : void 0;
}
function toInputString(value) {
  return value === void 0 ? "" : String(value);
}
function useLohnsteuer(options = {}) {
  const {
    year = SUPPORTED_YEARS[SUPPORTED_YEARS.length - 1],
    inputs = {},
    autoCalculate = true,
    onChange
  } = options;
  const [stateYear, setStateYear] = useState(year);
  const [stateInputs, setStateInputs] = useState(inputs);
  const [outputs, setOutputs] = useState(null);
  const [error, setError] = useState(null);
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
      error
    });
  }, [stateYear, stateInputs, outputs, error, onChange]);
  const setInput = useCallback(
    (key, value) => {
      setStateInputs((prev) => ({
        ...prev,
        [key]: value
      }));
    },
    []
  );
  const getNumberInputProps = useCallback(
    (key) => ({
      value: toInputString(stateInputs[key]),
      onChange: (e) => {
        setInput(key, parseNumberish(e.target.value));
      }
    }),
    [setInput, stateInputs]
  );
  const getSelectInputProps = useCallback(
    (key) => ({
      value: toInputString(stateInputs[key]),
      onChange: (e) => {
        setInput(key, parseNumberish(e.target.value));
      }
    }),
    [setInput, stateInputs]
  );
  const getCheckboxInputProps = useCallback(
    (key, checkedValue = 1, uncheckedValue = 0) => ({
      checked: Number(stateInputs[key] ?? 0) === checkedValue,
      onChange: (e) => {
        setInput(key, e.target.checked ? checkedValue : uncheckedValue);
      }
    }),
    [setInput, stateInputs]
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
    getCheckboxInputProps
  };
}

// src/react/LohnsteuerCalculator.tsx
function LohnsteuerCalculator({
  children,
  ...options
}) {
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
    getCheckboxInputProps
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
    getCheckboxInputProps
  });
}
export {
  ALL_OUTPUT_NAMES,
  DBA_OUTPUT_NAMES,
  INPUT_DEFAULTS,
  LohnsteuerCalculator,
  STANDARD_OUTPUT_NAMES,
  SUPPORTED_YEARS,
  calculate,
  useLohnsteuer
};
