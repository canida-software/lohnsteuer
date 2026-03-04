# lohnsteuer

German wage tax calculation from the official BMF Programmablaufplan.

**[Live Demo](https://canida-software.github.io/lohnsteuer/)**

## Installation

```bash
npm install lohnsteuerrechner
```

## Features

- Official BMF PAP implementation for 2025 and 2026
- Cent-exact results aligned with the BMF Steuerrechner API
- Supports all 6 tax classes and all 4 pay periods
- Computes Solidaritaetszuschlag and church tax bases
- Handles supplementary payments (sonstige Bezuege)
- Includes pension and age-related allowance rules from PAP
- Uses Decimal arithmetic (`decimal.js`) to avoid floating-point rounding errors
- Framework-agnostic core for Node.js and browsers

## Quick Start

```typescript
import { calculate } from "lohnsteuerrechner";

const result = calculate(2026, { LZZ: 2, RE4: 500000, STKL: 1, KVZ: 2.5, PVZ: 1 });

console.log(result.LSTLZZ); // 78583 (Cent = 785.83 EUR)
console.log(result.SOLZLZZ); // 0
```

## React Headless Component

```tsx
import { LohnsteuerCalculator } from "lohnsteuerrechner/react";

export function PayrollForm() {
  return (
    <LohnsteuerCalculator year={2026} inputs={{ LZZ: 2, RE4: 500000, STKL: 1 }}>
      {({ getSelectInputProps, getNumberInputProps, getCheckboxInputProps, outputs }) => (
        <div>
          <select {...getSelectInputProps("LZZ")}>
            <option value="1">Year</option>
            <option value="2">Month</option>
            <option value="3">Week</option>
            <option value="4">Day</option>
          </select>

          <input type="number" {...getNumberInputProps("RE4")} />
          <select {...getSelectInputProps("STKL")}>...</select>
          <input type="number" step="0.01" {...getNumberInputProps("KVZ")} />
          <input type="checkbox" {...getCheckboxInputProps("PVZ")} />

          <output>{outputs?.LSTLZZ ?? 0}</output>
        </div>
      )}
    </LohnsteuerCalculator>
  );
}
```

## API Reference

### `calculate(year, inputs)`

```typescript
function calculate(year: number, inputs: LohnsteuerInputs): LohnsteuerOutputs;
```

- `year`: currently supported `2025 | 2026`
- `inputs`: PAP input parameters (all monetary values in Cent at the API boundary)
- returns all PAP output values as integers in Cent

`SUPPORTED_YEARS` is also exported from the package entrypoint.

### `LohnsteuerInputs`

All input fields are optional; omitted values fall back to PAP defaults.

#### Core

| Field | Type | Description |
| --- | --- | --- |
| `LZZ` | `number` | Pay period: `1=year`, `2=month`, `3=week`, `4=day` |
| `RE4` | `number` | Taxable gross wage for the pay period (Cent) |
| `STKL` | `number` | Tax class (`1..6`) |
| `R` | `number` | Religious affiliation marker (`0` if none) |
| `ZKF` | `number` | Child allowance factor (1 decimal place) |

#### Insurance

| Field | Type | Description |
| --- | --- | --- |
| `KRV` | `number` | Pension insurance marker |
| `ALV` | `number` | Unemployment insurance marker |
| `PKV` | `number` | Health insurance marker (`0` public, `1` private) |
| `KVZ` | `number` | Additional health insurance contribution rate in percent |
| `PVZ` | `number` | Pflegeversicherung surcharge for childless employees |
| `PVS` | `number` | Saxony Pflegeversicherung special rule marker |
| `PVA` | `number` | Number of child-based Pflegeversicherung deductions (`0..4`) |
| `PKPV` | `number` | Private health/care insurance monthly amount (Cent) |
| `PKPVAGZ` | `number` | Employer subsidy for private insurance monthly amount (Cent) |

#### Pension and Age Relief

| Field | Type | Description |
| --- | --- | --- |
| `VBEZ` | `number` | Pension benefits included in `RE4` (Cent) |
| `VBEZM` | `number` | Monthly pension amount for reference month (Cent) |
| `VBEZS` | `number` | Expected pension special payments in start year (Cent) |
| `VBS` | `number` | Pension benefits included in `SONSTB` (Cent) |
| `VJAHR` | `number` | Year pension payments started |
| `ZMVB` | `number` | Number of pension months (annual calculation) |
| `ALTER1` | `number` | Age relief marker (`1` if eligible) |
| `AJAHR` | `number` | Year following 64th birthday |

#### Allowances and Additions

| Field | Type | Description |
| --- | --- | --- |
| `LZZFREIB` | `number` | Pay-period tax-free allowance (Cent) |
| `LZZHINZU` | `number` | Pay-period addition amount (Cent) |
| `JFREIB` | `number` | Annual allowance for supplementary payments (Cent) |
| `JHINZU` | `number` | Annual addition for supplementary payments (Cent) |

#### Supplementary Payments

| Field | Type | Description |
| --- | --- | --- |
| `SONSTB` | `number` | Supplementary payments (Cent) |
| `SONSTENT` | `number` | Compensation amounts within `SONSTB` (Cent) |
| `STERBE` | `number` | Death benefit amount within `SONSTB` (Cent) |
| `JRE4` | `number` | Expected annual wage for supplementary calculations (Cent) |
| `JRE4ENT` | `number` | Compensation amounts within `JRE4` (Cent) |
| `JVBEZ` | `number` | Pension benefits included in `JRE4` (Cent) |
| `MBV` | `number` | Non-taxable stock participation benefits (Cent) |

#### Factor Method (Tax Class IV)

| Field | Type | Description |
| --- | --- | --- |
| `af` | `number` | Factor method marker (`0/1`, default `1`) |
| `f` | `number` | Factor value with 3 decimal places |

### `LohnsteuerOutputs`

All output fields are integer Cent values.

| Field | Description |
| --- | --- |
| `LSTLZZ` | Wage tax for the pay period |
| `SOLZLZZ` | Solidarity surcharge for the pay period |
| `STS` | Wage tax for supplementary payments |
| `SOLZS` | Solidarity surcharge for supplementary payments |
| `BK` | Church tax base |
| `BKS` | Church tax base for supplementary payments |
| `VFRB` | Used allowance (DBA output) |
| `VFRBS1` | Used allowance for expected annual wage (DBA output) |
| `VFRBS2` | Used allowance for supplementary payments (DBA output) |
| `WVFRB` | Available taxable income above basic allowance (DBA output) |
| `WVFRBO` | Available taxable income above basic allowance for expected wage (DBA output) |
| `WVFRBM` | Available taxable income above basic allowance for supplementary payments (DBA output) |

## Supported Years

| Year | PAP XML Source | Status |
| --- | --- | --- |
| 2025 | `Lohnsteuer2025.xml` | Implemented |
| 2026 | `Lohnsteuer2026.xml` | Implemented |

## Validation

- 2026 implementation is validated against the official BMF external API with cached fixture vectors.
- Known example:
  - Inputs: `LZZ=2`, `RE4=500000`, `STKL=1`, `KVZ=2.50`, `PVZ=1`
  - Output: `LSTLZZ=78583`, `SOLZLZZ=0`
- Official BMF interface: `https://www.bmf-steuerrechner.de/interface/2026Version1.xhtml?code=LSt2026ext`

## Vanilla JS / CDN

Use directly in the browser with jsDelivr:

```html
<script type="module">
  import { calculate } from "https://cdn.jsdelivr.net/npm/lohnsteuerrechner/+esm";

  const result = calculate(2026, { LZZ: 2, RE4: 500000, STKL: 1, KVZ: 2.5, PVZ: 1 });
  console.log(result.LSTLZZ);
</script>
```

## License

MIT
