---
description: "Discover and implement new BMF PAP year(s) for Lohnsteuer calculation"
agent: "build"
subtask: false
---

# Update PAP: Discover and implement new BMF Programmablaufplan year(s)

You are updating the `lohnsteuer` npm package with support for new tax year(s).

Read `AGENTS.md` and `.context/docs/domain.md` FIRST for project rules and domain knowledge.

---

## Important: Browser vs Disk Strategy

When using Chrome DevTools MCP to interact with the BMF website, the browser is
a **discovery and download** tool only. NEVER try to read or parse spec content
from within the browser.

The correct workflow is always:
1. Use the browser to **navigate pages and find download links**
2. **Download files to `.context/docs/`** using `curl` or `webfetch`
3. **Read all content from disk** using normal file tools

The BMF site is server-rendered with JavaScript disclaimer walls. The browser
handles navigation and clicks. Everything else happens on disk.

---

## Step 1: Discovery -- find which years need implementing

### 1a. Check what we already have

Look at `src/core/` for existing `pap*.ts` files. Extract the list of implemented years.

### 1b. Scrape the BMF pseudocodes page for available years

**Primary approach** -- use `webfetch` to fetch:
```
https://www.bmf-steuerrechner.de/interface/pseudocodes.xhtml
```

Parse the page for XML pseudocode download links. They follow the pattern:
```
/javax.faces.resource/daten/xmls/Lohnsteuer{YEAR}.xml.xhtml
```

Also check for mid-year revisions. Some years have Version2+ (e.g., separate PAPs
for different months). Look for links containing year variants like
`Lohnsteuer2024Dezember.xml` or `Lohnsteuer2023Januar.xml`.

**Fallback** -- if `webfetch` returns incomplete content (JS-rendered page), use
Chrome DevTools MCP:
1. `navigate_page` to `https://www.bmf-steuerrechner.de/interface/pseudocodes.xhtml`
2. `take_screenshot` to see the page
3. `evaluate_script` to extract all XML download link `href` attributes:
   ```javascript
   Array.from(document.querySelectorAll('a[href*="xmls/Lohnsteuer"]'))
     .map(a => a.getAttribute('href'))
   ```
4. Record the discovered URLs -- these are the download targets

### 1c. Determine which years are new

Compare available years from BMF against implemented years. If all are implemented,
report "Already up to date -- no new PAP years found" and stop.

If new year(s) found, continue with the NEWEST unimplemented year first.

## Step 2: Download the new PAP XML to disk

For each new year/revision discovered, download the XML to `.context/docs/`:

**Primary** -- direct download via `curl`:
```bash
curl -s "https://www.bmf-steuerrechner.de/javax.faces.resource/daten/xmls/Lohnsteuer{YEAR}.xml.xhtml" \
  -o .context/docs/Lohnsteuer{YEAR}.xml
```

Verify the download is valid XML (not an HTML error page):
```bash
head -5 .context/docs/Lohnsteuer{YEAR}.xml
```
It should start with `<PAP name="Lohnsteuer{YEAR}"`. If it starts with `<html` or
`<!DOCTYPE`, the download failed.

**Fallback** -- if direct download fails (redirect, auth wall), use Chrome DevTools MCP:
1. `navigate_page` to the XML URL
2. `take_screenshot` to see what's there
3. If the browser shows raw XML or a download prompt, use `evaluate_script` to get
   the page content: `document.documentElement.outerHTML` or `document.body.innerText`
4. But **do NOT parse the XML from the browser**. Instead, extract the actual
   download URL (which may differ from the link) and download it with `curl`.
5. If the site requires cookie/session auth, use `evaluate_script` to read
   `document.cookie` and pass it to curl: `curl -b "{cookies}" -o ...`

**Always verify** the downloaded file on disk before proceeding:
```bash
wc -l .context/docs/Lohnsteuer{YEAR}.xml
grep -c '<METHOD' .context/docs/Lohnsteuer{YEAR}.xml
```
Expect 1000+ lines and 15+ methods.

## Step 3: Diff against previous year

Run a diff between the new XML and the most recent previous year's XML:
```bash
diff .context/docs/Lohnsteuer{PREV_YEAR}.xml .context/docs/Lohnsteuer{YEAR}.xml
```

Analyze the diff and create a structured summary:

**Constants changed** (from MPARA):
- Social insurance rates and limits
- Grundfreibetrag, Kinderfreibetrag
- Solidaritaetszuschlag threshold
- Steuerklasse V/VI boundary values

**Tax tariff changed** (from UPTAB):
- Bracket thresholds
- Formula coefficients
- Method name (UPTAB{YY})

**Variables changed**:
- New/removed `<INPUT>`, `<OUTPUT>`, `<INTERNAL>` parameters
- Changed default values

**Structural changes**:
- New/removed/reordered methods
- Changed logic within method bodies
- New table constants

This diff summary will be used in the PR description.

## Step 4: Discover the BMF API endpoint for validation

### 4a. Try the predictable URL pattern first

```bash
curl -s "https://www.bmf-steuerrechner.de/interface/{YEAR}Version1.xhtml?code=LSt{YEAR}ext&LZZ=1&RE4=100000&STKL=1" | head -5
```

If it returns XML starting with `<lohnsteuer jahr="{YEAR}">`, the endpoint works.
Record the URL and code. Move on.

### 4b. If the pattern returns an error or HTML, use Chrome DevTools MCP

The BMF external API page (`einganginterface.xhtml`) has a JavaScript disclaimer
checkbox that gates the URL reveal. Use the browser to navigate through it and
**extract the URL**, not the content:

1. `navigate_page` to `https://www.bmf-steuerrechner.de/interface/einganginterface.xhtml`
2. `take_screenshot` to see the disclaimer state
3. Look for a checkbox or button. Use `click` on the acknowledgment element.
   Common selectors to try:
   - `input[type="checkbox"]`
   - `button` or `a` near "Einverstanden" / "Bestätigen" / "Akzeptieren"
4. `take_screenshot` again to confirm the URL section is now visible
5. `evaluate_script` to extract the revealed URL and code:
   ```javascript
   // Look for the example URL text on the page
   const text = document.body.innerText;
   const urlMatch = text.match(/http[s]?:\/\/www\.bmf-steuerrechner\.de\/interface\/\d{4}Version\d+\.xhtml/);
   const codeMatch = text.match(/code\s*=\s*(LSt\d{4}ext)/);
   JSON.stringify({ url: urlMatch?.[0], code: codeMatch?.[1] });
   ```
6. Record the discovered URL pattern and code. The browser's job is done.

Now **verify the discovered endpoint works** using `curl` (NOT the browser):
```bash
curl -s "{DISCOVERED_URL}?code={CODE}&LZZ=1&RE4=100000&STKL=1" | head -5
```

### 4c. If Chrome DevTools is unavailable, ask the user

Prompt: "I could not auto-discover the BMF API URL for {YEAR}. Please visit
https://www.bmf-steuerrechner.de/interface/einganginterface.xhtml, accept the
disclaimer, and paste the API URL and code parameter here."

## Step 5: Create a git branch

```bash
git checkout -b feat/pap-{YEAR}
```

## Step 6: Implement the new PAP year

### 6a. Read the previous year's implementation as template

Read `src/core/pap{PREV_YEAR}.ts` to understand the established pattern.

### 6b. Read the new XML from disk

Read `.context/docs/Lohnsteuer{YEAR}.xml` completely. Pay attention to:
- Every `<INPUT>`, `<OUTPUT>`, `<INTERNAL>` in `<VARIABLES>`
- Every `<CONSTANT>` value (TAB1-TAB5 arrays, ZAHL constants)
- Every `<METHOD>` body in `<METHODS>`
- The `<MAIN>` method call sequence

All reading happens from the file on disk. Never from a browser or URL.

### 6c. Create `src/core/pap{YEAR}.ts`

- Copy the structure from the previous year
- Update class name to `Pap{YEAR}`
- Apply ALL changes identified in the diff (Step 3)
- For MPARA: update every constant value from the new XML
- For UPTAB: update method name to `UPTAB{YY}` and all tariff coefficients
- For new variables: add them with correct types and defaults
- For structural changes: translate the new XML logic faithfully

### 6d. Register the new year

In `src/core/calculate.ts`, add the new year to the PAP_REGISTRY:
```typescript
import { Pap{YEAR} } from "./pap{YEAR}";
// ...
{YEAR}: Pap{YEAR},
```

### 6e. Update types if needed

If the new XML introduces new `<INPUT>` or `<OUTPUT>` parameters not present in
`src/core/types.ts`, add them. Maintain backward compatibility -- new fields
should be optional in `LohnsteuerInputs`.

### 6f. Run typecheck + lint

```bash
npm run typecheck && npm run lint
```

Fix any errors before proceeding.

## Step 7: Generate test fixtures from BMF API

Fetch results from the BMF API for a comprehensive test matrix using `curl`:

```
Incomes (Cent): 0, 100000, 250000, 500000, 1000000, 2500000, 5000000, 10000000
Tax classes: 1, 2, 3, 4, 5, 6
Pay periods: 1 (year), 2 (month), 3 (week), 4 (day)
```

For each combination, call:
```bash
curl -s "{BMF_URL}?code={CODE}&LZZ={lzz}&RE4={re4}&STKL={stkl}"
```

Also fetch vectors with additional parameters:
- KVZ=2.50, PVZ=1 (common employee scenario)
- ZKF=1.0 (one child)
- STKL=3 with ZKF=2.0 (married, two children)

Parse the XML responses and save to `tests/fixtures/bmf-{YEAR}.json`:
```json
{
  "year": 2027,
  "code": "LSt2027ext",
  "apiUrl": "https://www.bmf-steuerrechner.de/interface/2027Version1.xhtml",
  "fetchedAt": "2027-01-15T12:00:00Z",
  "vectors": [
    {
      "inputs": { "LZZ": 1, "RE4": 2500000, "STKL": 1 },
      "outputs": { "LSTLZZ": 137600, "SOLZLZZ": 0, "STS": 0, "BK": 0 }
    }
  ]
}
```

Be respectful of the BMF API -- add a small delay between requests if fetching many vectors.

## Step 8: Create tests

Create `tests/pap{YEAR}.test.ts`:

1. **Fixture-based tests**: Load `tests/fixtures/bmf-{YEAR}.json` and verify each
   vector matches. This is the primary correctness check.

2. **Smoke tests**: A few hardcoded known-good values for readability.

3. **Edge cases**: Zero income, very high income, all tax classes.

Run all tests:
```bash
npm test
```

If any fixture tests fail, debug by comparing your implementation against the XML
**on disk** at `.context/docs/Lohnsteuer{YEAR}.xml`.

The most common errors:
- Wrong rounding mode (ROUND_UP vs ROUND_DOWN)
- Premature rounding of intermediate values
- Wrong coefficients in tax tariff
- `longValue()` not truncating correctly
- Array indexing off-by-one in TAB constants

Fix and re-run until ALL tests pass.

## Step 9: Update documentation

- `README.md`: Add the new year to the supported years list/table
- `docs/index.html`: Update if there's a year selector

## Step 10: Full quality gate

```bash
npm run lint && npm run typecheck && npm test && npm run build
```

ALL must pass.

## Step 11: Commit and create PR

### 11a. Commit

```bash
git add -A
git commit -m "feat: add PAP {YEAR} wage tax calculation"
```

### 11b. Check if `gh` CLI is available

```bash
which gh && gh auth status
```

### 11c. If `gh` is available and authenticated: create PR

```bash
git push -u origin feat/pap-{YEAR}
gh pr create --title "feat: add PAP {YEAR} Lohnsteuer calculation" --body "$(cat <<'EOF'
## Summary

Add support for the {YEAR} Programmablaufplan (PAP) for German wage tax calculation.

### Changes from PAP {PREV_YEAR}

{INSERT DIFF SUMMARY FROM STEP 3}

### Validation

- {N} test vectors validated against the official BMF Steuerrechner API
- All 6 tax classes tested across all 4 pay periods
- Cent-exact match confirmed for all test vectors

### Source

- PAP XML: https://www.bmf-steuerrechner.de/javax.faces.resource/daten/xmls/Lohnsteuer{YEAR}.xml.xhtml
- BMF API: https://www.bmf-steuerrechner.de/interface/{YEAR}Version1.xhtml
EOF
)"
```

### 11d. If `gh` is NOT available: guide the user

Output:
```
Changes committed to branch feat/pap-{YEAR}.

To create a PR, you need the GitHub CLI. Install it:
  brew install gh && gh auth login

Then push and create the PR:
  git push -u origin feat/pap-{YEAR}
  gh pr create --title "feat: add PAP {YEAR} Lohnsteuer calculation"

Or push manually and create the PR in the browser:
  git push -u origin feat/pap-{YEAR}
  Open: https://github.com/canida-software/lohnsteuer/compare/feat/pap-{YEAR}
```

## Done

Report the final status:
- Which year(s) were implemented
- How many test vectors passed
- Whether a PR was created (with link) or manual steps are needed
- Any issues or warnings encountered
