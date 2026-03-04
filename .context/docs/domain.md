# German Wage Tax (Lohnsteuer) -- Domain Reference

## Overview

The **Lohnsteuer** (wage tax) is a withholding tax on employment income in Germany.
Employers calculate and withhold it from each paycheck. The algorithm is defined by the
**Bundesministerium der Finanzen (BMF)** as a **Programmablaufplan (PAP)** -- a formal
algorithmic specification published annually (sometimes with mid-year revisions).

The BMF publishes:
1. **PDF flowcharts** (DIN 66001 notation) at bundesfinanzministerium.de
2. **XML pseudocode** at bmf-steuerrechner.de (machine-readable, Java-like)
3. **External API** for automated validation of third-party implementations

## What the PAP Computes

Given inputs about an employee's situation, the PAP produces:

| Output | Meaning |
|--------|---------|
| **LSTLZZ** | Wage tax (Lohnsteuer) for the pay period, in Cent |
| **SOLZLZZ** | Solidarity surcharge (Solidaritaetszuschlag) for the pay period, in Cent |
| **STS** | Tax on supplementary payments (sonstige Bezuege), in Cent |
| **SOLZS** | Solidarity surcharge on supplementary payments, in Cent |
| **BK** | Church tax assessment base (Kirchenlohnsteuer), in Cent |
| **BKS** | Church tax base for supplementary payments, in Cent |
| **VFRB/VFRBS1/VFRBS2** | Used tax-free allowances (DBA Turkey), in Cent |
| **WVFRB/WVFRBO/WVFRBM** | Available ZVE above basic allowance (DBA Turkey), in Cent |

## Key Input Parameters

### Core inputs (most common use case)
| Parameter | Type | Description |
|-----------|------|-------------|
| **LZZ** | int | Pay period: 1=year, 2=month, 3=week, 4=day |
| **RE4** | BigDecimal | Gross taxable wage for the pay period, in **Cent** |
| **STKL** | int | Tax class (Steuerklasse): 1-6 |
| **KVZ** | BigDecimal | Health insurance additional contribution rate, in % (e.g., 2.50) |
| **PVZ** | int | Care insurance surcharge for childless: 0 or 1 |
| **PVS** | int | Saxony care insurance special rule: 0 or 1 |
| **PVA** | BigDecimal | Number of child deductions for care insurance (0-4) |
| **R** | int | Religious affiliation (0=none) |
| **ZKF** | BigDecimal | Number of child allowances (1 decimal place) |

### Insurance parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| **KRV** | int | Pension insurance: 0=mandatory/voluntary, 1=not |
| **ALV** | int | Unemployment insurance: 0=mandatory, 1=not |
| **PKV** | int | Health insurance: 0=public, 1=private |
| **PKPV** | BigDecimal | Private health/care insurance monthly amount, in Cent |
| **PKPVAGZ** | BigDecimal | Employer subsidy for private insurance, monthly in Cent |

### Pension/retirement inputs
| Parameter | Type | Description |
|-----------|------|-------------|
| **VBEZ** | BigDecimal | Pension benefits included in RE4, in Cent |
| **VBEZM** | BigDecimal | Monthly pension benefit (Jan 2005 or first month), in Cent |
| **VBEZS** | BigDecimal | Expected special pension payments in year of start, in Cent |
| **VBS** | BigDecimal | Pension benefits in SONSTB, in Cent |
| **VJAHR** | int | Year pension was first received |
| **ZMVB** | int | Months of pension payments (for yearly calculation) |
| **ALTER1** | int | Over 64 at start of year: 0 or 1 |
| **AJAHR** | int | Year following 64th birthday |

### Tax-free allowances and additions
| Parameter | Type | Description |
|-----------|------|-------------|
| **LZZFREIB** | BigDecimal | Pay period tax-free allowance, in Cent |
| **LZZHINZU** | BigDecimal | Pay period additional amount, in Cent |
| **JFREIB** | BigDecimal | Annual tax-free allowance (for sonstige Bezuege), in Cent |
| **JHINZU** | BigDecimal | Annual additional amount (for sonstige Bezuege), in Cent |

### Supplementary payments
| Parameter | Type | Description |
|-----------|------|-------------|
| **SONSTB** | BigDecimal | Supplementary payments (bonuses etc.), in Cent |
| **SONSTENT** | BigDecimal | Section 24 compensations in SONSTB, in Cent |
| **STERBE** | BigDecimal | Death benefit in SONSTB, in Cent |
| **JRE4** | BigDecimal | Expected annual wage (for bonus calculation), in Cent |
| **JRE4ENT** | BigDecimal | Section 24 compensations in JRE4, in Cent |
| **JVBEZ** | BigDecimal | Pension benefits in JRE4, in Cent |
| **MBV** | BigDecimal | Non-taxable stock participation benefits, in Cent |

### Factor method (Steuerklasse IV only)
| Parameter | Type | Description |
|-----------|------|-------------|
| **af** | int | Factor method selected: 0 or 1 (default 1) |
| **f** | double | Factor value with 3 decimal places (default 1.0) |

## Critical Technical Requirements

### BigDecimal / Arbitrary Precision Arithmetic

The BMF **explicitly warns** against using floating-point arithmetic:

> Um Rundungsfehlern beim Einsatz von Gleitkommazahlen zu vermeiden, wird der Einsatz
> einer Klasse fuer numerisches Rechnen empfohlen (vgl. Oracle, BigDecimal).

The PAP uses Java's `BigDecimal` throughout. All monetary values are in **Cent** (integer
values as BigDecimal). Internal calculations use Euro with 2-6 decimal places. Rounding
modes are explicit in every operation:
- `BigDecimal.ROUND_DOWN` (truncate toward zero)
- `BigDecimal.ROUND_UP` (round away from zero)

A JavaScript implementation **MUST** use a library like `big.js`, `decimal.js`, or
`bignumber.js` -- never native `Number`.

### Values in Cent

ALL monetary input and output values are in **Cent** (1/100 Euro). Example:
- RE4 = 2500000 means 25,000.00 EUR gross annual wage
- LSTLZZ = 137600 means 1,376.00 EUR wage tax

### The PAP Algorithm Structure

The PAP is organized as named subroutines (methods) called from MAIN:

```
MAIN
  MPARA       -> Set year-specific parameters (rates, limits, thresholds)
  MRE4JL      -> Scale pay-period wage to annual wage
  MRE4        -> Pension/retirement allowances (Versorgungsfreibetrag)
  MRE4ALTE    -> Age relief (Altersentlastungsbetrag)
  MRE4ABZ     -> Wage after deducting allowances
  MBERECH     -> Main computation for regular pay
    MZTABFB   -> Fixed table-based allowances per tax class
    MLSTJAHR  -> Annual wage tax
      UPEVP   -> Social insurance deduction (Vorsorgepauschale)
      UPMLST  -> Tax tariff application
        UPTAB26   -> Income tax tariff (section 32a EStG) for classes I-IV
        MST5_6    -> Minimum tax for classes V and VI
    UPLSTLZZ  -> Scale annual tax back to pay period
    MSOLZ     -> Solidarity surcharge
  MSONST      -> Supplementary payments calculation
```

### Income Tax Tariff (section 32a EStG, 2026)

The tariff is a piecewise function on taxable income X (in Euro):

1. X <= 12,348: tax = 0 (basic allowance / Grundfreibetrag)
2. 12,349 <= X <= 17,005: Y = (X - 12,348) / 10,000; tax = (922.98 * Y + 1,400) * Y
3. 17,006 <= X <= 66,760: Y = (X - 17,005) / 10,000; tax = (181.19 * Y + 2,397) * Y + 1,025.38
4. 66,761 <= X <= 277,825: tax = 0.42 * X - 10,636.31
5. X >= 277,826: tax = 0.45 * X - 18,971.06

For Splittingverfahren (tax class III): apply tariff to X/2, then multiply result by 2.

### Year-Specific Constants (2026)

From the PAP XML MPARA method:
- Beitragsbemessungsgrenze Rente/ALV: 101,400 EUR
- Beitragsbemessungsgrenze KV/PV: 69,750 EUR
- Arbeitnehmer-Beitragssatz ALV: 1.3%
- Arbeitnehmer-Beitragssatz RV: 9.3%
- KV Grundbeitrag AN: 7.0% + KVZ/2
- PV Basissatz: 1.8% (2.3% in Sachsen)
- PV Kinderlosenaufschlag: +0.6% (if PVZ=1)
- PV Kinderabschlag: -0.25% per additional child (via PVA)
- Grundfreibetrag (GFB): 12,348 EUR
- Solidaritaetszuschlag Freigrenze: 20,350 EUR
- Grenzwerte Steuerklasse V/VI: 14,071 / 34,939 / 222,260 EUR
- Kinderfreibetrag: 9,756 EUR (STKL 1,2,3) or 4,878 EUR (STKL 4)
- Sonderausgaben-Pauschbetrag: 36 EUR
- Entlastungsbetrag Alleinerziehende: 4,260 EUR (STKL 2)
- Arbeitnehmer-Pauschbetrag: 1,230 EUR

## BMF External API (Validation Interface)

### URL Pattern
```
https://www.bmf-steuerrechner.de/interface/{year}Version{v}.xhtml?code={code}&{params}
```

### 2026 Specifics
- URL: `https://www.bmf-steuerrechner.de/interface/2026Version1.xhtml`
- Required parameter: `code=LSt2026ext` (valid until 2027-01-15)

### Example
```
GET /interface/2026Version1.xhtml?code=LSt2026ext&LZZ=1&RE4=2500000&STKL=1
```
Returns XML:
```xml
<lohnsteuer jahr="2026">
  <eingaben>
    <eingabe name="RE4" value="2500000" status="ok"/>
    <eingabe name="STKL" value="1" status="ok"/>
    <eingabe name="LZZ" value="1" status="ok"/>
  </eingaben>
  <ausgaben>
    <ausgabe name="LSTLZZ" value="137600" type="STANDARD"/>
    <ausgabe name="SOLZLZZ" value="0" type="STANDARD"/>
    ...
  </ausgaben>
</lohnsteuer>
```

### Known Test Vectors (2026, verified against BMF API)

| LZZ | RE4 (Cent) | STKL | KVZ | PVZ | LSTLZZ (Cent) | SOLZLZZ |
|-----|-----------|------|-----|-----|---------------|---------|
| 1 (year) | 2,500,000 | 1 | 0 | 0 | 137,600 | 0 |
| 2 (month) | 500,000 | 1 | 2.50 | 1 | 78,583 | 0 |

Omitted parameters default to 0.

## Source Files in .context/

- `.context/docs/Lohnsteuer2026.xml` -- Official PAP XML pseudocode for 2026
- `.context/docs/Lohnsteuer2025.xml` -- Official PAP XML pseudocode for 2025
- `.context/taxjs/` -- Reference implementation (taxcalcs/taxjs, XSLT-based codegen)
- `.context/kennzeichen/` -- Reference for project structure/tooling patterns
