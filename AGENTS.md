# AGENTS.md

## Project

`lohnsteuerrechner` -- TypeScript npm package implementing the official German wage tax
(Lohnsteuer) calculation algorithm from the BMF Programmablaufplan (PAP).

## Goal

A clean, modern, well-typed TypeScript library that:
1. Translates the BMF PAP XML pseudocode into idiomatic TypeScript
2. Produces results identical to the official BMF Steuerrechner API (cent-exact)
3. Supports PAP 2025 and 2026 (extensible to future years)
4. Works in Node.js and browsers (framework-agnostic core)
5. Ships as an npm package with ESM output

## .context/ Reference Material

```
.context/
  docs/
    domain.md              # Complete domain reference (inputs, outputs, algorithm, API)
    Lohnsteuer2026.xml     # Official BMF PAP XML pseudocode for 2026
    Lohnsteuer2025.xml     # Official BMF PAP XML pseudocode for 2025
  taxjs/                   # Reference: taxcalcs/taxjs (XSLT-based codegen approach)
  kennzeichen/             # Reference: project structure, tooling, CI/CD patterns
  opencode/                # Reference: opencode CLI source (config, commands, MCP)
  chrome-devtools-mcp/     # Reference: Chrome DevTools MCP server source
```

**Read `.context/docs/domain.md` FIRST** -- it contains the complete domain model,
every input/output parameter, year-specific constants, the algorithm structure,
and the BMF API for validation.

**The PAP XML files are the AUTHORITATIVE source** for the algorithm. Every `<IF>`,
`<EVAL>`, `<EXECUTE>`, and `<METHOD>` must be faithfully translated. The XML is
Java-flavored pseudocode -- translate it to TypeScript, do not copy Java idioms.

## Tech Stack (mandatory)

- **TypeScript 5.x**, strict mode, ESM (`"type": "module"`)
- **decimal.js-light** for BigDecimal arithmetic (preferred over big.js for better
  rounding mode control matching Java's BigDecimal)
- **tsup** for bundling (ESM output, .d.ts generation)
- **vitest** for testing
- **oxlint** for linting
- **Node 22.x** (`.nvmrc`)

## Architecture Rules

1. **`src/core/`** -- Framework-agnostic. Zero runtime dependencies except decimal.js-light.
   - `types.ts` -- Input/output/internal type definitions derived from PAP XML
   - `bigdecimal.ts` -- Thin wrapper aligning decimal.js-light API with PAP operations
   - `pap2026.ts` -- PAP 2026 implementation (one file per year)
   - `pap2025.ts` -- PAP 2025 implementation
   - `index.ts` -- Public API: `calculate(year, inputs) => outputs`

2. **Each PAP year is a self-contained module.** Method names MUST match the PAP exactly
   (MPARA, MRE4JL, MRE4, MRE4ABZ, MBERECH, MZTABFB, MLSTJAHR, etc.). Variable names
   MUST match the PAP exactly (RE4, LSTLZZ, ZRE4J, etc.).

3. **The public API should be simple:**
   ```typescript
   import { calculate } from "lohnsteuerrechner"
   const result = calculate(2026, { LZZ: 2, RE4: 500000, STKL: 1 })
   // result.LSTLZZ -> 78583 (Cent)
   ```

4. **Inputs/outputs use plain numbers** at the public API boundary (Cent as integers).
   BigDecimal is internal only. The library handles all conversions.

5. **Package uses Node.js subpath exports:** `.` (core), `./core`

## Critical Implementation Rules

### BigDecimal Precision

- ALL internal arithmetic MUST use decimal.js-light (or equivalent), NEVER native Number
  for monetary calculations
- Rounding modes from the PAP must be exact:
  - `BigDecimal.ROUND_DOWN` = truncate toward zero (decimal.js `ROUND_DOWN`)
  - `BigDecimal.ROUND_UP` = round away from zero (decimal.js `ROUND_UP`)
- `setScale(n, ROUND_X)` means: round to n decimal places using mode X
- `divide(x, n, ROUND_X)` means: divide, round result to n decimal places
- Intermediate values must NOT lose precision through premature rounding

### PAP Translation Rules

When translating `<EVAL exec="..."/>` from the XML:
- `a.add(b)` -> `a.plus(b)` (or whatever the BigDecimal wrapper uses)
- `a.subtract(b)` -> `a.minus(b)`
- `a.multiply(b)` -> `a.times(b)`
- `a.divide(b, scale, ROUND_MODE)` -> divide with explicit scale and rounding
- `a.compareTo(b) == 1` means `a > b`, `== -1` means `a < b`, `== 0` means `a == b`
- `a.setScale(n, ROUND_X)` -> round to n decimal places
- `a.longValue()` -> convert to integer (truncate)
- `BigDecimal.valueOf(n)` -> create BigDecimal from number
- Array indexing: `TAB1[J]` -> access table constant at index J

### Values in Cent

ALL public-facing monetary values are in **Cent** (integer). Internally the PAP
converts to Euro (dividing by 100) for calculations, then back to Cent for outputs.

## Quality Gates

Before marking ANY phase complete, run ALL of these:

```bash
npm run lint       # oxlint passes
npm run typecheck  # tsc --noEmit passes
npm test           # vitest passes
npm run build      # tsup produces dist/
```

### Validation Against BMF API

The ULTIMATE quality gate: results must match the BMF external API exactly.

Test URL pattern:
```
https://www.bmf-steuerrechner.de/interface/2026Version1.xhtml?code=LSt2026ext&{params}
```

The test suite MUST include automated validation against this API for a comprehensive
set of input combinations across all 6 tax classes and all 4 pay periods.

## Progress Tracking

Update `.context/PROGRESS.md` after completing each phase.
Format: `- [x] Phase N: description`

## Subagent Usage

Use parallel subagents for:
- Independent PAP year implementations (2025 vs 2026)
- Independent module development (types vs BigDecimal wrapper vs tests)
- BMF API test vector generation (fetch many combos in parallel)

Do NOT parallelize tasks that have data dependencies (e.g., tests depend on
the implementation being complete).

---

## Yearly Update Framework

### How to add a new PAP year

Run the update-pap command via opencode:

```bash
npx opencode-ai run --command project:update-pap
```

This launches the agent with the full update workflow defined in
`.opencode/commands/update-pap.md`. The agent will:

1. **Discover** new PAP year(s) by scraping bmf-steuerrechner.de
2. **Download** the PAP XML pseudocode
3. **Diff** against the previous year to understand changes
4. **Implement** the new `src/core/pap{YEAR}.ts`
5. **Generate test fixtures** by calling the BMF external API
6. **Validate** cent-exact correctness
7. **Open a PR** (or provide manual instructions)

### Mid-Year Revisions

Some years have mid-year PAP revisions (e.g., 2024 had separate PAPs for Jan-Nov
and December). The discovery step checks for multiple versions per year. Revisions
are implemented as separate classes: `Pap{YEAR}V2` or `Pap{YEAR}Dezember`.

### BMF URL Patterns (for agent reference)

| Resource | URL Pattern |
|----------|-------------|
| XML pseudocode | `https://www.bmf-steuerrechner.de/javax.faces.resource/daten/xmls/Lohnsteuer{YEAR}.xml.xhtml` |
| Pseudocodes page | `https://www.bmf-steuerrechner.de/interface/pseudocodes.xhtml` |
| API endpoint | `https://www.bmf-steuerrechner.de/interface/{YEAR}Version1.xhtml` |
| API code param | `LSt{YEAR}ext` (valid until Jan 15 of YEAR+1) |

### Tool Requirements

The update agent needs these tools (configured in `opencode.json`):

| Tool | Purpose | Configured via |
|------|---------|---------------|
| **webfetch** | Fetch BMF pages and XML downloads | Built-in opencode tool |
| **chrome-devtools-mcp** | Fallback for JS-rendered BMF pages (disclaimer wall) | MCP server in `opencode.json` |
| **bash (git)** | Branch creation, commits, diffs | Built-in opencode tool |
| **bash (gh)** | PR creation | User must have `gh` installed and authenticated |
| **bash (curl)** | BMF API calls for test fixture generation | Built-in opencode tool |

If `gh` CLI is not available, the agent will output manual git/PR instructions.

### Browser vs Disk Strategy

Chrome DevTools MCP is a **navigation and download** tool, NOT a content reader.
The browser is used to:
1. Navigate the BMF site and find download links
2. Click through JavaScript disclaimer walls
3. Extract URLs via `evaluate_script`
4. Trigger downloads

All spec content (PAP XML) must be **downloaded to `.context/docs/`** and read
from disk. Never parse or read XML from within the browser.

### Test Fixture Strategy

Test vectors are fetched from the BMF API once and cached as JSON in
`tests/fixtures/bmf-{YEAR}.json`. Tests load from fixtures by default (fast, offline).
The fixtures are committed to the repo so CI never hits the BMF API.

To re-fetch fixtures from the live API:
```bash
npx opencode-ai run "Re-fetch BMF API test fixtures for all years and update tests/fixtures/"
```
