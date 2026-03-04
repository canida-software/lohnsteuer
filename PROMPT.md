# Master Prompt: Build the `lohnsteuer` npm Package (End-to-End)

## Objective

Build and publish an npm package called `lohnsteuer` that implements the official
German wage tax (Lohnsteuer) calculation from the BMF Programmablaufplan (PAP).
The implementation must be cent-exact against the BMF's external API.

**Read `AGENTS.md` first** -- it defines the project rules, tech stack, and constraints.
**Read `.context/docs/domain.md` second** -- it is the complete domain reference.

The **PAP XML files** (`.context/docs/Lohnsteuer2026.xml` and `Lohnsteuer2025.xml`)
are the AUTHORITATIVE source for the algorithm. Translate them faithfully.

Use `.context/taxjs/` to understand how `big.js` maps to Java BigDecimal
(study `build/transform.xsl` for the expression mappings).
Use `.context/kennzeichen/` as the template for project structure, tooling, and CI/CD.

---

## Phase 0: Clone Reference Repos

The reference repos are gitignored (too large to commit). Clone them first:

```bash
git clone --depth 1 https://github.com/taxcalcs/taxjs .context/taxjs
git clone --depth 1 https://github.com/canida-software/kennzeichen .context/kennzeichen
git clone --depth 1 https://github.com/anomalyco/opencode .context/opencode
git clone --depth 1 https://github.com/ChromeDevTools/chrome-devtools-mcp .context/chrome-devtools-mcp
rm -rf .context/taxjs/.git .context/kennzeichen/.git .context/opencode/.git .context/chrome-devtools-mcp/.git
```

Skip any that already exist. These are read-only reference material.

---

## Phase 1: Project Scaffold

### 1.1 Initialize the repository

```bash
git init
```

### 1.2 Create `.nvmrc`

```
22.20
```

### 1.3 Create `.gitignore`

```
node_modules/
dist/
```

### 1.4 Create `package.json`

```json
{
  "name": "lohnsteuer",
  "version": "0.1.0",
  "description": "German wage tax (Lohnsteuer) calculation from the official BMF Programmablaufplan",
  "keywords": ["lohnsteuer", "german", "tax", "wage-tax", "payroll", "steuer", "bmf"],
  "homepage": "https://github.com/canida-software/lohnsteuer#readme",
  "bugs": { "url": "https://github.com/canida-software/lohnsteuer/issues" },
  "repository": { "type": "git", "url": "git+https://github.com/canida-software/lohnsteuer.git" },
  "license": "MIT",
  "author": "Canida Software <bui.qd@canida.io>",
  "type": "module",
  "sideEffects": false,
  "exports": {
    ".": {
      "types": "./dist/core/index.d.ts",
      "import": "./dist/core/index.js"
    },
    "./core": {
      "types": "./dist/core/index.d.ts",
      "import": "./dist/core/index.js"
    }
  },
  "files": ["dist"],
  "scripts": {
    "build": "tsup",
    "lint": "oxlint -D recommended --ignore-pattern node_modules",
    "test": "vitest run",
    "test:api": "vitest run tests/bmf-api.test.ts",
    "typecheck": "tsc --noEmit",
    "update-pap": "opencode run --command project:update-pap"
  },
  "dependencies": {
    "decimal.js-light": "^2.5.1"
  },
  "devDependencies": {
    "opencode-ai": "latest",
    "oxlint": "^1.41.0",
    "tsup": "^8.5.1",
    "typescript": "^5.9.3",
    "vitest": "^4.0.18"
  }
}
```

Note: `decimal.js-light` is a runtime dependency (not dev), because consumers need it.

### 1.5 Create `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "declaration": true,
    "outDir": "dist",
    "rootDir": "src",
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

### 1.6 Create `tsup.config.ts`

```typescript
import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    "core/index": "src/core/index.ts",
  },
  format: ["esm"],
  dts: true,
  clean: true,
});
```

### 1.7 Create `vitest.config.ts`

```typescript
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts"],
  },
});
```

### 1.8 Create stub source files

Create empty/minimal files so the quality gate passes:
- `src/core/index.ts` (empty barrel export)
- `src/core/types.ts` (empty)

### 1.9 Install and verify

```bash
npm install
npm run typecheck   # must pass
npm run lint        # must pass
npm run build       # must produce dist/
```

**Update `.context/PROGRESS.md`: mark Phase 1 complete.**

---

## Phase 2: BigDecimal Wrapper + Types [SUBAGENT-ELIGIBLE: two parallel tasks]

### Subagent A: BigDecimal Wrapper (`src/core/bigdecimal.ts`)

Create a thin wrapper that aligns `decimal.js-light` with the PAP's Java BigDecimal
operations. The wrapper must make PAP translation mechanical.

Study `.context/taxjs/build/transform.xsl` (line 198) for the Java-to-JS mapping,
but map to decimal.js-light instead of big.js.

Required operations:
- `BigDecimal.valueOf(n)` -> constructor
- `a.add(b)` / `a.subtract(b)` / `a.multiply(b)` -> `plus/minus/times`
- `a.divide(b, scale, roundingMode)` -> divide then `toDecimalPlaces(scale, mode)`
- `a.setScale(n, roundingMode)` -> `toDecimalPlaces(n, mode)`
- `a.compareTo(b)` -> `cmp(b)` returning -1, 0, 1
- `a.longValue()` -> truncate to integer
- `BigDecimal.ZERO`, `BigDecimal.ONE`
- `ROUND_DOWN` (toward zero), `ROUND_UP` (away from zero)

The wrapper can either:
(a) Export helper functions that operate on `Decimal` values directly, or
(b) Create a `BigDecimal` class wrapping `Decimal`

Choose whichever makes the PAP translation code most readable. The PAP code is
full of chained expressions like:
```
ZRE4J = (RE4.multiply(ZAHL12)).divide(ZAHL100, 2, BigDecimal.ROUND_DOWN)
```

This must translate cleanly.

### Subagent B: Type Definitions (`src/core/types.ts`)

Parse `.context/docs/Lohnsteuer2026.xml` and extract ALL variable definitions from
the `<VARIABLES>` section. Create TypeScript types for:

**`LohnsteuerInputs`** -- all `<INPUT>` parameters:
```typescript
export interface LohnsteuerInputs {
  /** 1 if factor method selected (Steuerklasse IV only) */
  af?: number;
  /** Year following 64th birthday */
  AJAHR?: number;
  /** 1 if 64th birthday completed at start of year */
  ALTER1?: number;
  // ... every INPUT from the XML with JSDoc from the XML comments
  /** Taxable wage for the pay period, in Cent */
  RE4?: number;
  /** Tax class 1-6 */
  STKL?: number;
  /** Pay period: 1=year, 2=month, 3=week, 4=day */
  LZZ?: number;
  // ... etc
}
```

All fields should be **optional** with sensible defaults (from the XML `default` attrs).
Types should be `number` at the public API level (internal conversion to BigDecimal
happens inside the PAP).

**`LohnsteuerOutputs`** -- all `<OUTPUT>` parameters:
```typescript
export interface LohnsteuerOutputs {
  /** Wage tax for the pay period, in Cent */
  LSTLZZ: number;
  /** Solidarity surcharge for the pay period, in Cent */
  SOLZLZZ: number;
  // ... every OUTPUT
  // Group STANDARD and DBA outputs together
}
```

**`LohnsteuerInternals`** -- all `<INTERNAL>` parameters (used only inside PAP classes):
```typescript
export interface LohnsteuerInternals {
  ALTE: Decimal;
  ANP: Decimal;
  // ... every INTERNAL
}
```

Note: Internals use `Decimal` type (the BigDecimal wrapper), not `number`.

Also extract the CONSTANTS (TAB1-TAB5, ZAHL constants) into a type or as part of
the PAP class.

**Derive types from the XML, do not invent parameters.** The XML is the single
source of truth for parameter names, types, and descriptions.

### Run quality gate:
```bash
npm run typecheck && npm run lint
```

**Update `.context/PROGRESS.md`: mark Phase 2 complete.**

---

## Phase 3: PAP 2026 Implementation

This is the critical phase. Translate `.context/docs/Lohnsteuer2026.xml` into TypeScript.

### 3.1 Create `src/core/pap2026.ts`

Create a class `Pap2026` that contains:

1. **All internal state** -- every `<INTERNAL>` variable, initialized to its default
2. **All constants** -- TAB1-TAB5 arrays, ZAHL constants
3. **All methods** -- every `<METHOD>` from the XML, plus `<MAIN>` as `calculate()`
4. **Input setters** -- accept `LohnsteuerInputs`, convert numbers to BigDecimal
5. **Output getters** -- convert BigDecimal results back to integer Cent

### 3.2 Translation rules

For each `<METHOD name="X">`, create a private method `X()`.
For `<MAIN>`, create a public method that calls the methods in order.

Translate each XML element:

| XML | TypeScript |
|-----|-----------|
| `<EXECUTE method="X"/>` | `this.X()` |
| `<EVAL exec="A = B.add(C)"/>` | `this.A = this.B.plus(this.C)` |
| `<IF expr="X == 1"><THEN>...<ELSE>...` | `if (this.X === 1) { ... } else { ... }` |
| `<IF expr="A.compareTo(B) == 1">` | `if (this.A.cmp(this.B) === 1)` |
| `<IF expr="A.compareTo(B) >= 0 && ...">`| `if (this.A.cmp(this.B) >= 0 && ...)` |
| `BigDecimal.valueOf(n)` | `new Decimal(n)` |
| `BigDecimal.ZERO` | `Decimal.ZERO` (or `new Decimal(0)`) |
| `.add(x)` | `.plus(x)` |
| `.subtract(x)` | `.minus(x)` |
| `.multiply(x)` | `.times(x)` |
| `.divide(x, scale, ROUND_MODE)` | `.div(x).toDecimalPlaces(scale, mode)` |
| `.setScale(n, ROUND_MODE)` | `.toDecimalPlaces(n, mode)` |
| `.longValue()` | `.trunc().toNumber()` |
| `BigDecimal.valueOf(ZMVB)` | `new Decimal(this.ZMVB)` (int to Decimal) |

### 3.3 Method-by-method checklist

Translate these methods in order (they appear in the XML, PAP page numbers noted):

- [ ] `MPARA` (p14) -- Year-specific constants. Hardcoded rates/limits for 2026.
- [ ] `MRE4JL` (p15) -- Scale pay-period wage to annual. LZZ-based branching.
- [ ] `MRE4` (p16) -- Versorgungsfreibetrag. Uses TAB1/TAB2/TAB3, calls MRE4ALTE.
- [ ] `MRE4ALTE` (p17) -- Altersentlastungsbetrag. Uses TAB4/TAB5.
- [ ] `MRE4ABZ` (p20) -- Deduct allowances from annual wage.
- [ ] `MBERECH` (p21) -- Main calculation. Calls MZTABFB, MLSTJAHR, UPLSTLZZ, MSOLZ.
- [ ] `MZTABFB` (p22) -- Table-based allowances. Tax-class-dependent branching.
- [ ] `MLSTJAHR` (p23) -- Annual wage tax. Calls UPEVP, then UPMLST.
- [ ] `UPEVP` (p26) -- Vorsorgepauschale (social insurance deduction). Complex.
- [ ] `MVSPKVPV` -- KV/PV portion of Vorsorgepauschale.
- [ ] `UPMLST` (p25) -- Apply tax tariff. Calls UPTAB26 or MST5_6.
- [ ] `UPTAB26` (p28+) -- Income tax tariff (section 32a EStG). Piecewise function.
- [ ] `MST5_6` (p27) -- Minimum tax for classes V and VI.
- [ ] `UP5_6` -- Sub-routine for V/VI.
- [ ] `MSOLZ` -- Solidarity surcharge calculation.
- [ ] `UPLSTLZZ` (p24) -- Scale annual tax back to pay period.
- [ ] `UPANTEIL` -- Proportional share calculation.
- [ ] `MSONST` -- Supplementary payments (sonstige Bezuege). Complete sub-algorithm.
- [ ] `MAIN` -- Orchestrator calling all methods in order.

### 3.4 Critical precision notes

- The UPTAB26 method uses the **tax tariff formula** with very specific precision.
  Y values have 6 decimal places. The formula coefficients are exact:
  `(922.98 * Y + 1400) * Y` etc. Get these from the XML, not from domain.md.
- Intermediate results MUST NOT be prematurely rounded. Only round where the
  PAP explicitly calls `setScale` or `divide(..., scale, ROUND_MODE)`.
- `longValue()` means truncate to integer (not round).

### 3.5 Wire up the class

The `Pap2026` class should expose:
```typescript
class Pap2026 {
  constructor() // initializes all internals to defaults
  setInputs(inputs: LohnsteuerInputs): void  // set inputs, convert to BigDecimal
  calculate(): void  // run MAIN
  getOutputs(): LohnsteuerOutputs  // read outputs, convert to integer Cent
}
```

### Run quality gate:
```bash
npm run typecheck && npm run lint && npm run build
```

**Update `.context/PROGRESS.md`: mark Phase 3 complete.**

---

## Phase 4: Tests + BMF API Validation (2026)

### 4.1 Create `tests/pap2026.test.ts`

Unit tests for the PAP 2026 implementation:

**Basic smoke tests** -- verify known test vectors:
```typescript
// From BMF API documentation
test("yearly 25000 EUR STKL 1", () => {
  const result = calculate(2026, { LZZ: 1, RE4: 2500000, STKL: 1 });
  expect(result.LSTLZZ).toBe(137600);
});

test("monthly 5000 EUR STKL 1 with KVZ+PVZ", () => {
  const result = calculate(2026, { LZZ: 2, RE4: 500000, STKL: 1, KVZ: 2.50, PVZ: 1 });
  expect(result.LSTLZZ).toBe(78583);
});
```

**All 6 tax classes** -- test each class with the same income to verify differentiation.

**All 4 pay periods** -- LZZ 1 (year), 2 (month), 3 (week), 4 (day).

**Edge cases:**
- Zero income (RE4=0) -> zero tax
- Very high income (RE4=100000000 = 1M EUR) -> top tax rate
- Tax class III (Splitting) vs I (Grundtarif)
- Tax class V/VI minimum tax calculation
- Solidaritaetszuschlag threshold (SOLZFREI = 20,350)
- Versorgungsbezuege (VBEZ, VBEZM, VJAHR set)
- Altersentlastungsbetrag (ALTER1=1, AJAHR set)
- Sonstige Bezuege (SONSTB set, JRE4 set)
- Factor method (af=0, custom f value, STKL=4)
- Private health insurance (PKV=1, PKPV set)
- Child allowances (ZKF set)
- Freibetrag/Hinzurechnungsbetrag (LZZFREIB, LZZHINZU)
- Sachsen care insurance (PVS=1)
- Childless surcharge (PVZ=1)
- Child deductions in care insurance (PVA=1..4)

### 4.2 Create `tests/bmf-api.test.ts`

Automated validation against the live BMF API:

```typescript
const BMF_URL = "https://www.bmf-steuerrechner.de/interface/2026Version1.xhtml";

async function fetchBMF(params: Record<string, number | string>): Promise<Record<string, number>> {
  const url = new URL(BMF_URL);
  url.searchParams.set("code", "LSt2026ext");
  for (const [key, val] of Object.entries(params)) {
    url.searchParams.set(key, String(val));
  }
  const response = await fetch(url.toString());
  const xml = await response.text();
  // Parse XML, extract ausgaben
  return parseOutputXml(xml);
}
```

Generate a comprehensive test matrix:

```typescript
const incomes = [0, 100000, 250000, 500000, 1000000, 2500000, 5000000, 10000000];
const taxClasses = [1, 2, 3, 4, 5, 6];
const periods = [1, 2, 3, 4]; // year, month, week, day

for (const STKL of taxClasses) {
  for (const LZZ of periods) {
    for (const RE4 of incomes) {
      test(`STKL=${STKL} LZZ=${LZZ} RE4=${RE4}`, async () => {
        const expected = await fetchBMF({ LZZ, RE4, STKL });
        const actual = calculate(2026, { LZZ, RE4, STKL });
        expect(actual.LSTLZZ).toBe(expected.LSTLZZ);
        expect(actual.SOLZLZZ).toBe(expected.SOLZLZZ);
      });
    }
  }
}
```

This creates 6 x 4 x 8 = **192 test vectors** at minimum. Add more with:
- KVZ variations (0, 1.0, 1.7, 2.5)
- PVZ=1 vs PVZ=0
- ZKF variations (0, 0.5, 1.0, 2.0)
- VBEZ / pension scenarios
- SONSTB / bonus scenarios

**Important:** Mark these tests with a `timeout` of 120s and a `concurrent: false`
flag to avoid hammering the BMF API. Consider fetching all expected values once and
caching them as a JSON fixture file for fast re-runs.

### 4.3 Run and fix

```bash
npm test
npm run test:api
```

Debug any mismatches. The most common sources of cent-off errors:
1. Wrong rounding mode (ROUND_UP vs ROUND_DOWN)
2. Premature rounding of intermediate values
3. Wrong order of operations in chained expressions
4. `longValue()` not truncating correctly
5. Missing `setScale` calls
6. Array indexing off-by-one (TAB1 is 0-indexed but J starts at 1)

**Update `.context/PROGRESS.md`: mark Phase 4 complete.**

---

## Phase 5: PAP 2025 Implementation [SUBAGENT-ELIGIBLE]

### 5.1 Create `src/core/pap2025.ts`

Translate `.context/docs/Lohnsteuer2025.xml` the same way as 2026.

The 2025 PAP differs from 2026 primarily in:
- MPARA constants (rates, limits, thresholds change yearly)
- Tax tariff coefficients in UPTAB25 (different from UPTAB26)
- Possibly different structural changes (compare the two XML files)

**Use a subagent** to diff the two XML files first:
```bash
diff .context/docs/Lohnsteuer2025.xml .context/docs/Lohnsteuer2026.xml
```

Only implement what differs. The overall structure should be identical.

### 5.2 Run quality gate

```bash
npm run typecheck && npm run lint && npm run build
```

**Update `.context/PROGRESS.md`: mark Phase 5 complete.**

---

## Phase 6: Tests + BMF API Validation (2025)

Same approach as Phase 4, but targeting the 2025 API:

```
https://www.bmf-steuerrechner.de/interface/2025Version1.xhtml?code=LSt2025ext&{params}
```

Create `tests/pap2025.test.ts` and `tests/bmf-api-2025.test.ts`.

**Update `.context/PROGRESS.md`: mark Phase 6 complete.**

---

## Phase 7: Public API

### 7.1 Create `src/core/index.ts`

The public API barrel file:

```typescript
export { calculate } from "./calculate";
export type { LohnsteuerInputs, LohnsteuerOutputs } from "./types";
```

### 7.2 Create `src/core/calculate.ts`

```typescript
import type { LohnsteuerInputs, LohnsteuerOutputs } from "./types";
import { Pap2025 } from "./pap2025";
import { Pap2026 } from "./pap2026";

const PAP_REGISTRY: Record<number, new () => PapInstance> = {
  2025: Pap2025,
  2026: Pap2026,
};

export function calculate(year: number, inputs: LohnsteuerInputs): LohnsteuerOutputs {
  const PapClass = PAP_REGISTRY[year];
  if (!PapClass) {
    throw new Error(`Unsupported tax year: ${year}. Supported: ${Object.keys(PAP_REGISTRY).join(", ")}`);
  }
  const pap = new PapClass();
  pap.setInputs(inputs);
  pap.calculate();
  return pap.getOutputs();
}
```

### 7.3 Create `src/index.ts` (root barrel)

```typescript
export * from "./core";
```

### 7.4 Final API verification

```typescript
import { calculate } from "lohnsteuer";

// Simple monthly calculation
const result = calculate(2026, { LZZ: 2, RE4: 500000, STKL: 1 });
console.log(result.LSTLZZ); // Wage tax in Cent
console.log(result.SOLZLZZ); // Solidarity surcharge in Cent
console.log(result.BK); // Church tax base in Cent
```

### Run quality gate:
```bash
npm run lint && npm run typecheck && npm test && npm run build
```

**Update `.context/PROGRESS.md`: mark Phase 7 complete.**

---

## Phase 8: CI/CD

### 8.1 Create `.github/workflows/ci.yml`

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  ci:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version-file: .nvmrc
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Typecheck
        run: npm run typecheck

      - name: Test
        run: npm test

      - name: Build
        run: npm run build
```

### 8.2 Create `.github/workflows/publish.yml`

```yaml
name: Publish

on:
  push:
    tags:
      - "v*"

permissions:
  contents: read
  id-token: write

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version-file: .nvmrc
          registry-url: https://registry.npmjs.org

      - name: Install npm 11.x (required for OIDC)
        run: npm install -g npm@11

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Typecheck
        run: npm run typecheck

      - name: Test
        run: npm test

      - name: Build
        run: npm run build

      - name: Publish
        run: npm publish --access public
```

### 8.3 Create `RELEASING.md`

```markdown
# Releasing

This package uses automated publishing via GitHub Actions with npm OIDC trusted publishing.

## Release Process

1. **Bump version**
   ```bash
   npm version patch  # or minor, major
   ```

2. **Push with tags**
   ```bash
   git push && git push --tags
   ```

3. **Done** - GitHub Actions automatically publishes to npm when a `v*` tag is pushed.

## Version Guidelines

- `patch` (0.0.x): Bug fixes, PAP constant corrections
- `minor` (0.x.0): New tax year support, new features
- `major` (x.0.0): Breaking API changes
```

**Update `.context/PROGRESS.md`: mark Phase 8 complete.**

---

## Phase 9: README + Demo Page

### 9.1 Create `README.md`

Structure (model after `.context/kennzeichen/README.md`):

1. **Title**: `lohnsteuer`
2. **Subtitle**: German wage tax calculation from the official BMF Programmablaufplan
3. **Installation**: `npm install lohnsteuer`
4. **Features** bullet list:
   - Official BMF PAP 2025 + 2026 implementation
   - Cent-exact results matching the BMF Steuerrechner
   - All 6 tax classes, all 4 pay periods
   - Solidarity surcharge, church tax base
   - Supplementary payments (sonstige Bezuege)
   - Pension/retirement allowances
   - BigDecimal precision (no floating-point errors)
   - Zero dependencies at runtime (except decimal.js-light)
   - Works in Node.js and browsers
5. **Quick Start**:
   ```typescript
   import { calculate } from "lohnsteuer"
   const result = calculate(2026, { LZZ: 2, RE4: 500000, STKL: 1 })
   console.log(result.LSTLZZ) // 78583 (Cent = 785.83 EUR)
   ```
6. **API Reference**:
   - `calculate(year, inputs)` function signature
   - `LohnsteuerInputs` -- table of all input parameters with types and descriptions
   - `LohnsteuerOutputs` -- table of all output parameters
   - Group inputs by category (core, insurance, pension, supplements, factor method)
7. **Supported Years**: table of year -> PAP version
8. **Validation**: explain BMF API validation, link to bmf-steuerrechner.de
9. **Vanilla JS / CDN usage** example (jsDelivr)
10. **License**: MIT

### 9.2 Create `docs/index.html`

Self-contained demo page (model after `.context/kennzeichen/docs/index.html`):

- Load library from jsDelivr CDN
- Input fields for: LZZ (dropdown), RE4 (text), STKL (dropdown), KVZ (text), PVZ (checkbox)
- "Calculate" button or real-time calculation on input
- Display results: LSTLZZ, SOLZLZZ, STS, BK (formatted in EUR)
- Show the raw Cent values too
- Code examples with PrismJS syntax highlighting
- Link to GitHub repo
- Clean, minimal styling (system-ui font, max-width 1024px)

**Update `.context/PROGRESS.md`: mark Phase 9 complete.**

---

## Phase 10: Final Validation

### 10.1 Run ALL quality gates

```bash
npm run lint       # oxlint passes
npm run typecheck  # tsc --noEmit passes
npm test           # all vitest tests pass
npm run build      # dist/ produced correctly
```

### 10.2 Run BMF API validation

```bash
npm run test:api   # all BMF API comparisons pass
```

### 10.3 Verify package contents

```bash
npm pack --dry-run
```

Should show only `dist/` files and `package.json`, `README.md`, `LICENSE`.

### 10.4 Test as consumer

Create a temporary test:
```typescript
// Simulate: npm install lohnsteuer && node -e "..."
import { calculate } from "./dist/core/index.js";
const r = calculate(2026, { LZZ: 2, RE4: 500000, STKL: 1 });
console.assert(r.LSTLZZ > 0, "Should produce non-zero tax");
```

### 10.5 Create initial commit

```bash
git add -A
git commit -m "feat: initial release -- PAP 2025 + 2026 wage tax calculation"
```

### 10.6 Publish

```bash
npm version 0.1.0
git push && git push --tags
```

**Update `.context/PROGRESS.md`: mark Phase 10 complete. ALL PHASES DONE.**

---

## Subagent Orchestration Guide

### Which phases can run in parallel?

| Parallel Group | Tasks | Rationale |
|---------------|-------|-----------|
| Phase 2 | BigDecimal wrapper + Types | No interdependency |
| Phase 3 + 5 | PAP 2026 + PAP 2025 | Independent year implementations (but 2025 benefits from doing 2026 first as a template) |
| Phase 4 + 6 | Tests 2026 + Tests 2025 | Independent (after respective impl) |
| Phase 8 + 9 | CI/CD + README/demo | Independent of each other |

### Sequential dependencies (NEVER parallelize these)

```
Phase 1 (scaffold)
  -> Phase 2 (types + bigdecimal)
    -> Phase 3 (PAP 2026 impl)
      -> Phase 4 (tests 2026)
    -> Phase 5 (PAP 2025 impl)  [can start after Phase 2, parallel with 3]
      -> Phase 6 (tests 2025)
  -> Phase 7 (public API) [after 3 + 5]
    -> Phase 8 (CI/CD) [after 7]
    -> Phase 9 (README/demo) [after 7]
      -> Phase 10 (final validation) [after everything]
```

### Optimal execution with 2 subagents:

```
Agent 1: Phase 1 -> Phase 2A (BigDecimal) -> Phase 3 (PAP 2026) -> Phase 4 (tests 2026) -> Phase 7 -> Phase 8  -> Phase 11
Agent 2:            Phase 2B (Types)       -> Phase 5 (PAP 2025) -> Phase 6 (tests 2025) -> Phase 9
Main:                                                                                        Phase 10
```

---

## Crash Recovery

If the session crashes mid-work:

1. Read `.context/PROGRESS.md` to see which phases are done
2. Read `AGENTS.md` for project rules
3. Run `npm run typecheck && npm test` to see current state
4. Resume from the first incomplete phase
5. The `.context/docs/*.xml` files and reference repos are always available

---

## Success Criteria

The project is DONE when:

1. `npm run lint && npm run typecheck && npm test && npm run build` -- all pass
2. `npm run test:api` -- 100% match against BMF external API
3. Package exports work: `import { calculate } from "lohnsteuer"`
4. PAP 2025 and 2026 both implemented and validated
5. CI/CD pipelines created and correct
6. README with API docs, demo page deployed
7. `npm publish` ready (package.json correct, files field set, OIDC workflow)
8. Yearly update framework in place (opencode config, update-pap command, test fixtures)

---

## Phase 11: Yearly Update Framework

This phase sets up the infrastructure for an AI agent to autonomously add new PAP
years in the future. After this phase, running `npx opencode-ai run --command project:update-pap`
will discover, implement, test, and PR a new tax year.

### 11.1 Verify `opencode-ai` is a devDependency

Ensure `package.json` includes:
```json
{
  "devDependencies": {
    "opencode-ai": "latest"
  }
}
```

And the `update-pap` script:
```json
{
  "scripts": {
    "update-pap": "opencode run --command project:update-pap"
  }
}
```

This means developers run `npm run update-pap` and the agent takes over.

### 11.2 Verify `opencode.json` (project-level config)

The file `opencode.json` in the project root configures opencode with:

- **Chrome DevTools MCP** -- for scraping the BMF disclaimer page as fallback:
  ```json
  {
    "mcp": {
      "chrome-devtools": {
        "type": "local",
        "command": ["npx", "-y", "chrome-devtools-mcp@latest", "--headless"],
        "enabled": true,
        "timeout": 30000
      }
    }
  }
  ```

- **Instructions** -- points to AGENTS.md and the domain reference:
  ```json
  {
    "instructions": ["AGENTS.md", ".context/docs/domain.md"]
  }
  ```

- **Permissions** -- auto-approves safe commands (npm, git, gh, curl):
  ```json
  {
    "permission": {
      "bash": {
        "*": "ask",
        "npm *": "allow",
        "git *": "allow",
        "gh *": "allow",
        "curl *": "allow"
      },
      "webfetch": "allow"
    }
  }
  ```

### 11.3 Verify the update command exists

The file `.opencode/commands/update-pap.md` must exist with the full update workflow.
This is loaded as a slash command `project:update-pap` by opencode.

It contains the 11-step agent workflow:
1. Discovery (scrape BMF for new years)
2. Download XML
3. Diff against previous year
4. Discover BMF API endpoint (pattern first, Chrome DevTools fallback)
5. Git branch
6. Implement PAP class
7. Generate test fixtures
8. Create tests
9. Update docs
10. Quality gate
11. Commit + PR (with `gh` detection and graceful fallback)

### 11.4 Verify test fixtures directory

`tests/fixtures/` must exist. Each year gets a `bmf-{YEAR}.json` file
containing cached BMF API responses for offline testing.

### 11.5 End-to-end test of the framework

Run a dry test to make sure the toolchain is wired:
```bash
# Verify opencode is available
npx opencode-ai --version

# Verify the command is discoverable (interactive TUI, then Ctrl+K)
# Or run headless with a simple prompt:
npx opencode-ai run "List the files in .opencode/commands/ and tell me what commands are available"
```

### 11.6 Document in README

Add a section to README.md:

```markdown
## Adding New Tax Years

This project includes an AI-powered update agent. When a new PAP is published
by the BMF, run:

\`\`\`bash
npm run update-pap
\`\`\`

The agent will:
1. Discover new PAP year(s) from bmf-steuerrechner.de
2. Download and diff the XML pseudocode
3. Implement the new year's calculation
4. Validate against the BMF external API
5. Open a pull request

Requirements:
- [GitHub CLI](https://cli.github.com/) installed and authenticated (for PR creation)
- Node.js 22.x
\`\`\`

**Update `.context/PROGRESS.md`: mark Phase 11 complete. EVERYTHING DONE.**
