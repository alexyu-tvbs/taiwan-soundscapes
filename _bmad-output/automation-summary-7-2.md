# Automation Summary — Story 7-2: Map Collection Progress & Unlock Hints

**Date:** 2026-02-02
**Story:** 7-2 (Map Collection Progress & Unlock Hints)
**Mode:** BMad-Integrated
**Coverage Target:** critical-paths

---

## Tests Created

### E2E Tests (Playwright)

**File:** `tests/e2e/collection-progress.spec.ts` (6 tests, 104 lines)

| Priority | Test | AC |
|----------|------|----|
| **P1** | Display CollectionProgress with correct count "已收集 3/10 個台灣聲景" on Explore tab | #1 (FR41) |
| **P1** | Display sleep-type-specific hint text from onboarding result | #2 (FR42) |
| **P2** | Render 10 progress dots with 3 amber (unlocked) and 7 slate (locked) | #1 |
| **P2** | CollectionProgress not visible on Tonight tab | #1 |
| **P2** | CollectionProgress not visible on Journey tab | #1 |
| **P2** | CollectionProgress positioned above the Taiwan map | #1 |

### Pre-Existing Tests (Not Modified)

| Level | File | Tests |
|-------|------|-------|
| Unit | `tests/unit/CollectionProgress.test.tsx` | 10 tests |
| Integration | `tests/unit/App.test.tsx` (Story 7.2 section) | 7 tests |

---

## Infrastructure

No new fixtures, factories, or helpers were created. Existing infrastructure was sufficient:

- **Fixture:** `appPage` (auto-completes onboarding)
- **Helper:** `navigateToExploreTab()` (switches to Explore tab)
- **Helper:** `completeOnboarding()` (answers all 5 questions with option-0)

---

## Test Healing Report

**Healing Attempted:** Yes (2 failures on first run)
**Healing Mode:** Pattern-based (MCP disabled)
**Iterations Used:** 1 of 3 max

### Healed Tests (2/2)

| Test | Failure Pattern | Fix Applied |
|------|----------------|-------------|
| `[P1] hint text` | Dynamic Data — onboarding option-0 yields sleepType `light`, not `difficulty` | Updated expected text to "深層好眠計畫" / "日月潭晨曦" |
| `[P2] progress dots` | CSS Format — Tailwind CSS v4 uses `oklch()` not `rgb()` | Changed assertions to regex matching `oklch(0.82...)` and `oklch(0.4...)` |

### Unable to Heal: 0

---

## Test Execution Results

```
E2E (Playwright Chromium): 6/6 passed (25.8s)
Unit (Vitest):           296/296 passed (20.5s)
Total:                   302/302 passed — 0 regressions
```

---

## Coverage Analysis

**Total Story 7-2 Tests:** 23 (10 unit + 7 integration + 6 E2E)

**Priority Breakdown:**
- P1: 2 E2E tests (critical user journey validation)
- P2: 4 E2E tests (visual rendering and tab exclusion)

**Test Levels:**
- Unit: 10 tests (component logic, props, styling, edge cases)
- Integration: 7 tests (App-level rendering context, tab conditional logic)
- E2E: 6 tests (real browser validation of full user journey)

**Coverage Status:**
- AC #1 (Collection count display): Covered at unit + integration + E2E
- AC #2 (Hint text by sleep type): Covered at unit + integration + E2E
- Progress dots visual: Covered at unit + E2E (CSS color validation)
- Tab exclusion: Covered at integration + E2E
- DOM ordering: Covered at integration + E2E (bounding box verification)

**No duplicate coverage:** E2E tests validate real browser behavior (CSS rendering, layout positioning, full onboarding → Explore flow) that unit/integration tests cannot verify.

---

## Definition of Done

- [x] All tests follow Given-When-Then format
- [x] All tests have priority tags ([P1], [P2])
- [x] All tests use data-testid selectors
- [x] All tests are self-cleaning (via appPage fixture)
- [x] No hard waits or flaky patterns
- [x] Test file under 300 lines (104 lines)
- [x] All tests pass locally
- [x] No regressions in existing test suite (296/296 unit + 6/6 new E2E)
- [x] Healing completed — 0 unfixable tests

---

## Test Execution

```bash
# Run Story 7-2 E2E tests only
npx playwright test tests/e2e/collection-progress.spec.ts

# Run by priority
npx playwright test --grep 'P1' tests/e2e/collection-progress.spec.ts
npx playwright test --grep 'P2' tests/e2e/collection-progress.spec.ts

# Run full E2E suite
npm run test:e2e

# Run full test suite (unit + E2E)
npm run test:all
```

---

## Knowledge Base References Applied

- **test-levels-framework.md** — E2E for critical journey, avoid duplicate unit coverage
- **test-priorities-matrix.md** — P1 for core user journey, P2 for visual/secondary validation
- **test-quality.md** — Given-When-Then, deterministic assertions, no hard waits
- **network-first.md** — Not applicable (static SPA, no network requests to intercept)
- **fixture-architecture.md** — Reused existing appPage/explorePage fixtures
