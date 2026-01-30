# Test Design: Epic 1 - Taiwan Map Interface Foundation

**Date:** 2026-01-30 **Author:** Alex Yu **Status:** Draft

---

## Executive Summary

**Scope:** Full test design for Epic 1 — Taiwan Map Interface Foundation

**Risk Summary:**

- Total risks identified: 8
- High-priority risks (>=6): 1
- Critical categories: BUS (1 high), TECH (4 medium/low), PERF (1 low)

**Coverage Summary:**

- P0 scenarios: 4 (4 hours)
- P1 scenarios: 8 (4 hours)
- P2/P3 scenarios: 6 (1.5 hours)
- **Total effort**: 9.5 hours (~1.2 days)

---

## Risk Assessment

### High-Priority Risks (Score >=6)

| Risk ID | Category | Description | Probability | Impact | Score | Mitigation | Owner | Timeline |
| ------- | -------- | ----------- | ----------- | ------ | ----- | ---------- | ----- | -------- |
| R-001 | BUS | First impression failure — map doesn't create visual "wow" on dark background. Judge Gaod's evaluation depends on immediate visual impact. If SVG map styling (fill, stroke, glow contrast) isn't presentation-grade, competition goal fails. | 2 | 3 | 6 | Dedicated visual QA pass: test map rendering in Chrome fullscreen, validate color contrast ratios between map fill/stroke/background, verify unlocked markers are visually prominent against dark theme. Screenshot comparison baseline. | Dev (Alex Yu) | Before demo |

### Medium-Priority Risks (Score 3-4)

| Risk ID | Category | Description | Probability | Impact | Score | Mitigation | Owner |
| ------- | -------- | ----------- | ----------- | ------ | ----- | ---------- | ----- |
| R-002 | TECH | SVG coordinate system mismatch — SimpleMaps SVG viewBox uses its own coordinate system. All 10 location markers positioned via cx/cy SVG attributes. Wrong coordinate mapping = all markers mispositioned on Taiwan outline. | 2 | 2 | 4 | E2E test: verify each marker falls within Taiwan SVG bounding box. Visual spot-check Tamsui (north), Kenting (south), Taitung (east). | Dev |
| R-003 | TECH | Tailwind CSS v4 misconfiguration — v4 requires `@import "tailwindcss"` (not v3 `@tailwind` directives), `@tailwindcss/vite` plugin (not PostCSS), NO `tailwind.config.js`. AI agents frequently default to v3 patterns. | 2 | 2 | 4 | Build validation test: verify no `tailwind.config.js`, verify `@import "tailwindcss"` in CSS, verify Tailwind utilities render correctly in browser. | Dev |
| R-004 | TECH | Unlocked vs locked visual distinction insufficient — opacity/color difference between unlocked (amber, full opacity) and locked (slate, 40% opacity) markers might not be obvious enough on dark background. | 2 | 2 | 4 | E2E test: verify unlocked marker opacity = 1, locked marker opacity = 0.4. Visual screenshot comparison of both states side-by-side. | Dev |

### Low-Priority Risks (Score 1-2)

| Risk ID | Category | Description | Probability | Impact | Score | Action |
| ------- | -------- | ----------- | ----------- | ------ | ----- | ------ |
| R-005 | TECH | SVG-to-React conversion issues — `class`->`className`, `stroke-width`->`strokeWidth`, XML declarations breaking JSX. | 2 | 1 | 2 | Monitor — build will catch syntax errors |
| R-006 | TECH | Location data model incompleteness — missing fields or wrong types in `locations.ts`. | 1 | 2 | 2 | Unit test: validate all 10 locations have required fields |
| R-007 | BUS | Brand tagline readability — "好眠秘境 — 用耳朵旅行台灣" not prominent enough or poor contrast. | 1 | 2 | 2 | E2E test: verify tagline element visible and has correct text |
| R-008 | PERF | SVG rendering performance — complex SVG paths + 10 markers + hover. SVG is 19.1 KB with 10 circles = minimal load. | 1 | 2 | 2 | Monitor — NFR3 (60fps) validated in Epic 4 performance story |

### Risk Category Legend

- **TECH**: Technical/Architecture (flaws, integration, scalability)
- **SEC**: Security (access controls, auth, data exposure) — N/A for prototype
- **PERF**: Performance (SLA violations, degradation, resource limits)
- **DATA**: Data Integrity (loss, corruption, inconsistency) — N/A for static data
- **BUS**: Business Impact (UX harm, logic errors, revenue)
- **OPS**: Operations (deployment, config, monitoring) — deferred to Epic 4

---

## Test Coverage Plan

### P0 (Critical) - Run on every commit

**Criteria**: Blocks core journey + High risk (>=6) + No workaround

| ID | Requirement | Test Level | Risk Link | Description | Owner |
| -- | ----------- | ---------- | --------- | ----------- | ----- |
| 1.1-E2E-001 | FR1, FR17 | E2E | R-001 | Page loads with dark theme background (`bg-slate-900`) and SVG Taiwan map is visible | QA |
| 1.2-E2E-001 | FR1 | E2E | R-001 | SVG Taiwan map renders prominently, centered on viewport, correct viewBox | QA |
| 1.2-E2E-002 | FR2 | E2E | R-001, R-004 | 10 location markers visible: 3 unlocked (bright amber, opacity=1) + 7 locked (dim slate, opacity=0.4) | QA |
| 1.2-E2E-003 | FR5 | E2E | R-001 | Brand tagline "好眠秘境 — 用耳朵旅行台灣" visible in header area | QA |

**Total P0**: 4 tests, ~4 hours

### P1 (High) - Run on PR to main

**Criteria**: Important features + Medium risk (3-4) + Common workflows

| ID | Requirement | Test Level | Risk Link | Description | Owner |
| -- | ----------- | ---------- | --------- | ----------- | ----- |
| 1.2-E2E-004 | FR2 | E2E | R-002 | Unlocked location markers positioned at geographically correct SVG coordinates (Tamsui=north, Alishan=central, Keelung=northeast) | QA |
| 1.2-E2E-005 | FR2 | E2E | R-002 | Locked location markers positioned at correct SVG coordinates (Lanyu=SE offshore, Taroko=east, SunMoonLake=central, Kenting=south, Hehuan=central mountains, Taitung=SE coast, Yushan=central peak) | QA |
| 1.2-E2E-006 | FR2 | E2E | R-004 | Clicking any location marker updates selectedLocationId state (visual feedback: selected marker size changes) | QA |
| 1.2-E2E-007 | — | E2E | R-004 | Hover over location dot shows location name (via SVG `<title>` tooltip or visible label) | QA |
| 1.1-UNIT-001 | FR14, FR15 | Unit | R-006 | `locations.ts` contains exactly 10 locations: 3 with status='unlocked', 7 with status='locked' | DEV |
| 1.1-UNIT-002 | Data model | Unit | R-006 | Every location has required fields: id, name, nameEn, coordinates.x, coordinates.y, status, audioPath, imagePath, unlockCondition | DEV |
| 1.1-UNIT-003 | FR14 | Unit | R-006 | Unlocked locations are exactly: tamsui, alishan, keelung with correct Chinese names | DEV |
| 1.2-E2E-008 | FR17 | E2E | R-003 | Tailwind CSS v4 functioning: dark theme utilities render correctly, no unstyled content flash | QA |

**Total P1**: 8 tests, ~4 hours

### P2 (Medium) - Run nightly/weekly

**Criteria**: Secondary features + Low risk (1-2) + Edge cases

| ID | Requirement | Test Level | Risk Link | Description | Owner |
| -- | ----------- | ---------- | --------- | ----------- | ----- |
| 1.2-E2E-009 | FR1 | E2E | R-005 | SVG map has correct viewBox attribute and renders without broken paths | QA |
| 1.1-UNIT-004 | Data model | Unit | R-006 | Audio paths follow pattern `/audio/{id}.mp3`, image paths follow `/images/{id}.jpg` | DEV |
| 1.1-UNIT-005 | FR15 | Unit | — | All 7 locked locations have non-empty unlockCondition strings in zh-tw | DEV |
| 1.2-E2E-010 | NFR1 | E2E | R-008 | Page loads and map renders within 2 seconds (performance baseline) | QA |

**Total P2**: 4 tests, ~1 hour

### P3 (Low) - Run on-demand

**Criteria**: Nice-to-have + Exploratory + Edge cases

| ID | Requirement | Test Level | Description | Owner |
| -- | ----------- | ---------- | ----------- | ----- |
| 1.2-E2E-011 | NFR6 | E2E | All Epic 1 features function in Chrome (latest) | QA |
| 1.2-E2E-012 | NFR7 | E2E | All Epic 1 features function in Safari (latest) — cross-browser validation | QA |

**Total P3**: 2 tests, ~0.5 hours

---

## Execution Order

### Smoke Tests (<2 min)

**Purpose**: Fast feedback, catch build-breaking issues

- [ ] Page loads without errors (1.1-E2E-001) — 15s
- [ ] SVG map visible on page (1.2-E2E-001) — 15s
- [ ] Brand tagline rendered (1.2-E2E-003) — 10s

**Total**: 3 scenarios, ~40s

### P0 Tests (<5 min)

**Purpose**: Critical path validation — visual impact

- [ ] 10 markers visible with correct unlock/lock visual states (1.2-E2E-002) — 30s
- [ ] Dark theme + map + tagline all present (full P0 suite) — 1min

**Total**: 4 scenarios, ~2min

### P1 Tests (<10 min)

**Purpose**: Important feature coverage — coordinates, data, interactions

- [ ] Location coordinate validation (1.2-E2E-004, 005) — 2min
- [ ] Click and hover interactions (1.2-E2E-006, 007) — 1min
- [ ] Location data unit tests (1.1-UNIT-001, 002, 003) — 5s
- [ ] Tailwind v4 functioning (1.2-E2E-008) — 15s

**Total**: 8 scenarios, ~4min

### P2/P3 Tests (<15 min)

**Purpose**: Edge cases and cross-browser

- [ ] SVG viewBox integrity (1.2-E2E-009) — 15s
- [ ] Asset path validation (1.1-UNIT-004, 005) — 5s
- [ ] Performance baseline (1.2-E2E-010) — 30s
- [ ] Cross-browser (1.2-E2E-011, 012) — 5min

**Total**: 6 scenarios, ~6min

---

## Resource Estimates

### Test Development Effort

| Priority | Count | Hours/Test | Total Hours | Notes |
| -------- | ----- | ---------- | ----------- | ----- |
| P0 | 4 | 1.0 | 4.0 | Visual validation, screenshot baseline |
| P1 | 8 | 0.5 | 4.0 | Coordinate checks, data validation, interactions |
| P2 | 4 | 0.25 | 1.0 | Simple assertions |
| P3 | 2 | 0.25 | 0.5 | Cross-browser reruns |
| **Total** | **18** | **—** | **9.5** | **~1.2 days** |

### Prerequisites

**Test Data:**

- `locations.ts` with 10 typed locations (already created in Story 1.1)
- SVG coordinate reference from SimpleMaps Taiwan SVG viewBox

**Tooling:**

- Playwright for E2E tests (already configured with `tests/` directory)
- Vitest for unit tests (available via Vite ecosystem, zero additional setup)

**Environment:**

- Local Vite dev server (`npm run dev`)
- Chrome (latest) as primary test browser
- Safari (latest) for P3 cross-browser

---

## Quality Gate Criteria

### Pass/Fail Thresholds

- **P0 pass rate**: 100% (no exceptions)
- **P1 pass rate**: >=95% (waivers required for failures)
- **P2/P3 pass rate**: >=90% (informational)
- **High-risk mitigations**: 100% complete or approved waivers

### Coverage Targets

- **Critical paths (map renders + markers visible + tagline)**: 100%
- **Data model integrity**: 100%
- **Visual distinction (unlocked vs locked)**: >=80%
- **Edge cases (SVG, cross-browser)**: >=50%

### Non-Negotiable Requirements

- [ ] All P0 tests pass (map visible, markers rendered, tagline present, dark theme)
- [ ] No high-risk (>=6) items unmitigated (R-001 visual impact validated)
- [ ] Location data correct (10 locations, 3 unlocked, 7 locked)
- [ ] Build succeeds with zero TypeScript errors

---

## Mitigation Plans

### R-001: First Impression Failure — Visual Impact (Score: 6)

**Mitigation Strategy:** Create E2E screenshot baseline tests that validate:
1. SVG map renders on dark background with visible contrast
2. Unlocked markers (amber glow) are visually prominent
3. Locked markers are clearly dimmed but still visible
4. Brand tagline readable with adequate contrast ratio
5. Manual visual QA pass in Chrome fullscreen before demo

**Owner:** Dev (Alex Yu)
**Status:** Planned
**Verification:** P0 E2E tests pass + manual visual sign-off before demo presentation

---

## Assumptions and Dependencies

### Assumptions

1. SimpleMaps Taiwan SVG (19.1 KB) is suitable for presentation-grade display after React conversion
2. SVG viewBox coordinate system is documented/inspectable for marker positioning
3. Playwright test framework is already configured (confirmed: `tests/` directory exists with fixtures)
4. No backend dependencies — all tests run against static local Vite dev server

### Dependencies

1. Story 1.1 completion (project init, types, data) — Required before Story 1.2 tests
2. SimpleMaps SVG download and conversion — Required for all map-related E2E tests
3. SVG coordinate determination — Required for location position tests (1.2-E2E-004, 005)

### Risks to Plan

- **Risk**: SVG coordinates can only be determined after SVG is downloaded and analyzed
  - **Impact**: Location position tests (P1) cannot be written until Story 1.2 Task 3 is complete
  - **Contingency**: Write coordinate tests with placeholder assertions, update after SVG analysis

---

## Follow-on Workflows (Manual)

- Run `*atdd` to generate failing P0 tests (separate workflow; not auto-run).
- Run `*automate` for broader coverage once Story 1.2 implementation exists.

---

## Approval

**Test Design Approved By:**

- [ ] Product Manager: Alex Yu Date: ___
- [ ] Tech Lead: Alex Yu Date: ___
- [ ] QA Lead: Alex Yu Date: ___

**Comments:**

---

## Appendix

### Knowledge Base References

- `risk-governance.md` - Risk classification framework (6 categories, scoring matrix)
- `probability-impact.md` - Risk scoring methodology (probability x impact, 1-9 scale)
- `test-levels-framework.md` - Test level selection (E2E vs Unit for frontend SPA)
- `test-priorities-matrix.md` - P0-P3 prioritization criteria

### Related Documents

- PRD: `_bmad-output/planning-artifacts/prd.md`
- Epic: `_bmad-output/planning-artifacts/epics.md` (Epic 1 section)
- Architecture: `_bmad-output/planning-artifacts/architecture.md`
- Story 1.1: `_bmad-output/implementation-artifacts/1-1-project-initialization-and-dark-theme-foundation.md`
- Story 1.2: `_bmad-output/implementation-artifacts/1-2-interactive-taiwan-map-with-location-markers-and-brand-tagline.md`
- Project Context: `_bmad-output/project-context.md`

---

**Generated by**: BMad TEA Agent - Test Architect Module **Workflow**: `_bmad/bmm/testarch/test-design` **Version**: 4.0 (BMad v6)
