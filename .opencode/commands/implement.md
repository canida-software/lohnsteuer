---
description: "Implement the lohnsteuerrechner npm package end-to-end from PROMPT.md"
agent: "build"
subtask: false
---

# Implement `lohnsteuerrechner` -- End-to-End

You are building the `lohnsteuerrechner` npm package from scratch. Everything has been
planned for you. Your job is to execute.

## What already exists (committed to the repo)

The project root contains planning and reference material only -- no source code yet.

**Planning files (read these first, in order):**
1. `AGENTS.md` -- Project rules, tech stack, architecture, constraints (you get this automatically)
2. `.context/docs/domain.md` -- Complete domain reference: every input/output parameter, the algorithm structure, year-specific constants, BMF API for validation
3. `PROMPT.md` -- The phase-by-phase execution plan with exact file contents, code templates, and quality gates for every step

**Source of truth (committed):**
- `.context/docs/Lohnsteuer2026.xml` -- **THE** authoritative algorithm source (1396 lines of BMF PAP XML pseudocode). Translate this faithfully to TypeScript.
- `.context/docs/Lohnsteuer2025.xml` -- Same for 2025 (1405 lines)

**Already configured (committed):**
- `opencode.json` -- opencode config with Chrome DevTools MCP, permissions, instructions
- `.opencode/commands/update-pap.md` -- Yearly update agent command (Phase 11)
- `.context/PROGRESS.md` -- Progress tracker (all phases unchecked)

## Phase 0: Clone reference repos

The reference repos are gitignored (they're large). Clone them before starting:

```bash
git clone --depth 1 https://github.com/taxcalcs/taxjs .context/taxjs
git clone --depth 1 https://github.com/canida-software/kennzeichen .context/kennzeichen
git clone --depth 1 https://github.com/anomalyco/opencode .context/opencode
git clone --depth 1 https://github.com/ChromeDevTools/chrome-devtools-mcp .context/chrome-devtools-mcp
```

Remove nested `.git/` dirs (we don't want git-in-git):
```bash
rm -rf .context/taxjs/.git .context/kennzeichen/.git .context/opencode/.git .context/chrome-devtools-mcp/.git
```

**What to use each repo for:**
- `.context/taxjs/` -- Study `build/transform.xsl` for the Java BigDecimal -> JS expression mapping. Study `dist/es2015/Lohnsteuer2023Big.js` for what a translated PAP class looks like.
- `.context/kennzeichen/` -- Template for project structure (package.json, tsup, vitest, oxlint, CI/CD, npm publish workflow, README). Copy the tooling patterns.
- `.context/opencode/` -- opencode CLI source (for understanding config, commands, MCP)
- `.context/chrome-devtools-mcp/` -- Chrome DevTools MCP server source (for reference)

These repos are reference only. Do NOT modify them. Read from them, learn patterns,
then write your own code in `src/`.

## Execution

Follow `PROMPT.md` phase by phase. There are 11 phases:

```
Phase 0:  Clone reference repos (above -- do this first)
Phase 1:  Project scaffold (package.json, tsconfig, tsup, vitest, .nvmrc)
Phase 2:  BigDecimal wrapper + types from PAP XML [PARALLEL: 2 subagents]
Phase 3:  PAP 2026 implementation (translate XML -> TypeScript)
Phase 4:  Tests + BMF API validation for 2026
Phase 5:  PAP 2025 implementation [CAN PARALLEL with 3]
Phase 6:  Tests + BMF API validation for 2025
Phase 7:  Public API (calculate function, registry, barrel exports)
Phase 8:  CI/CD (GitHub Actions: ci.yml, publish.yml, RELEASING.md)
Phase 9:  README + demo page (docs/index.html)
Phase 10: Final validation (all quality gates, BMF API match, npm pack)
Phase 11: Verify yearly update framework (opencode, commands, fixtures)
```

**After EVERY phase**, do two things:
1. Run the quality gate: `npm run lint && npm run typecheck && npm test && npm run build`
2. Update `.context/PROGRESS.md`: change `- [ ]` to `- [x]` for the completed phase

**Use subagents** where marked in PROMPT.md. The key parallelization opportunities:
- Phase 2: BigDecimal wrapper and types are independent
- Phase 3 + 5: PAP 2026 and 2025 are independent (but 2026 first is recommended as template)
- Phase 8 + 9: CI/CD and README are independent

## Critical rules (from AGENTS.md)

1. **ALL arithmetic uses decimal.js-light**, never native Number for monetary values
2. **Method names match the PAP exactly**: MPARA, MRE4JL, MRE4, MBERECH, MZTABFB, MLSTJAHR, UPTAB26, etc.
3. **Variable names match the PAP exactly**: RE4, LSTLZZ, ZRE4J, ZVE, etc.
4. **All monetary values are in Cent** at the public API boundary
5. **The PAP XML is the single source of truth** -- translate every `<IF>`, `<EVAL>`, `<EXECUTE>`, `<METHOD>` faithfully
6. **Results must be cent-exact** against the BMF external API

## Start now

Read `PROMPT.md` and begin with Phase 0 (clone repos), then Phase 1. Do not ask for confirmation -- execute.
