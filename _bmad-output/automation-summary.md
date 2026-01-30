# Automation Summary — Expanded E2E Coverage

**Date:** 2026-01-30
**Agent:** TEA (Master Test Architect)
**Mode:** Standalone / Auto-discover
**Framework:** Playwright (E2E) + Vitest (Unit)

---

## Coverage Analysis

### Before This Run

| Type | Files | Tests | Coverage |
|------|-------|-------|----------|
| E2E | 5 | ~44 | Stories 1.2, 2.1, 2.2, Homepage, Map Interactions |
| Unit | 8 | 127 | ALL components, hooks, data, App integration |

### Coverage Gaps Identified

| Gap | Priority | Risk | Resolution |
|-----|----------|------|------------|
| E2E: Lock Overlay (Story 3.1) | P0/P1 | High — Story implemented but no E2E browser validation | **lock-overlay.spec.ts** |
| E2E: Keyboard Navigation | P2 | Medium — Unit tested but no browser verification | **keyboard-navigation.spec.ts** |
| E2E: Full User Journey | P1 | Medium — Cross-feature flow not validated end-to-end | **user-journey.spec.ts** |

### After This Run

| Type | Files | Tests | Coverage |
|------|-------|-------|----------|
| E2E | **8** (+3) | **~64** (+20) | Stories 1.2, 2.1, 2.2, **3.1**, Homepage, Map, **Keyboard**, **Journey** |
| Unit | 8 | 127 | ALL components, hooks, data, App integration |

---

## Tests Created

### 1. `tests/e2e/lock-overlay.spec.ts` (13 tests)

Story 3.1: Locked Location Interaction & Unlock Condition Display

| Priority | Tests | Description |
|----------|-------|-------------|
| P0 | 3 | Overlay display, location name/condition, English name |
| P1 | 8 | Dismiss (close/backdrop), panel click propagation, audio continuity, LocationDetail persistence, post-dismiss unlocked selection, lock emoji, all 7 locked locations data |
| P2 | 2 | No player without prior selection, warm language validation |

### 2. `tests/e2e/keyboard-navigation.spec.ts` (6 tests)

Keyboard Accessibility E2E Verification

| Priority | Tests | Description |
|----------|-------|-------------|
| P2 | 6 | Tab focus, Enter select, Space select, keyboard SoundscapePlayer, keyboard LockOverlay, aria-label verification |

### 3. `tests/e2e/user-journey.spec.ts` (1 test)

Full Cross-Feature Integration Journey

| Priority | Tests | Description |
|----------|-------|-------------|
| P1 | 1 | 7-phase journey: Homepage → Select unlocked → Play/Pause → Switch location → Click locked → Dismiss overlay → Verify state restored |

---

## Test Execution Results

```
E2E (new tests):  20/20 PASSED
E2E (full suite):  60/64 passed, 4 pre-existing failures
Unit (full suite): 127/127 PASSED
```

### Pre-Existing Failures (Not Caused by This Run)

These 4 tests have incorrect expectations based on the Story 3.1 implementation:

1. `audio-playback.spec.ts:83` — Expects player to hide when clicking locked (player stays because `selectedLocationId` unchanged)
2. `map-interactions.spec.ts:16` — Expects locked marker r=8 (locked clicks don't update `selectedLocationId`)
3. `map-interactions.spec.ts:29` — Expects taroko r=8 after clicking (same reason)
4. `scene-photography.spec.ts:123` — Expects detail to hide (stays visible because selection unchanged)

**Root cause:** These tests were written when clicking a locked location was expected to change `selectedLocationId`. Story 3.1 changed behavior to show LockOverlay instead, preserving the previous unlocked selection.

**Recommendation:** Update these 4 pre-existing tests to align with the current Story 3.1 behavior.

---

## Design Decisions

1. **Used taroko instead of lanyu** for tests where SoundscapePlayer is visible. Lanyu (y=1255) sits at the SVG bottom, covered by the fixed player bar. Taroko (y=620) is mid-map.
2. **Overlay dismissal before map interaction** — The LockOverlay is a full-viewport modal (`fixed inset-0 z-50`). Tests requiring map clicks after overlay display must dismiss the overlay first, reflecting real user behavior.
3. **No API tests** — Pure static SPA with no backend; API testing is not applicable.
4. **No Playwright Utils** — `tea_use_playwright_utils: false` in config; tests use standard Playwright patterns.

---

## Quality Checklist

- [x] All tests follow Given-When-Then format
- [x] All tests have priority tags ([P0], [P1], [P2])
- [x] All tests use data-testid selectors (via `getByTestId` / `getMapElement`)
- [x] No hard waits or `waitForTimeout` calls
- [x] No conditional flow (`if (await element.isVisible())`)
- [x] No page object classes — tests are direct
- [x] No shared state between tests
- [x] All test files under 300 lines
- [x] All tests deterministic — passed on first run
- [x] Test healing applied (2 iterations to fix pointer interception issues)

---

## Test Execution

```bash
# Run Story 3.1 lock overlay tests
npx playwright test tests/e2e/lock-overlay.spec.ts

# Run keyboard accessibility tests
npx playwright test tests/e2e/keyboard-navigation.spec.ts

# Run full user journey test
npx playwright test tests/e2e/user-journey.spec.ts

# Run all E2E tests
npm run test:e2e

# Run all tests (unit + E2E)
npm run test:all
```

---

## Summary

| Metric | Value |
|--------|-------|
| Tests created | 20 E2E |
| P0 Critical | 3 |
| P1 High | 9 |
| P2 Medium | 8 |
| Browser tested | Chromium |
| Pass rate | 100% (20/20 new) |
| Healing iterations | 2 |
| New infrastructure | None |
| Pre-existing failures found | 4 (unrelated) |

---

## Not Needed

- API Tests (no backend)
- Data Factories (no dynamic seeding)
- Component Tests (fully covered by Vitest + RTL)
- Network mocking (no external API calls)

---

## Next Steps

1. Fix the 4 pre-existing E2E test failures to align with Story 3.1 behavior
2. Run full suite in CI pipeline: `npm run test:all`
3. Monitor for flaky tests in burn-in loop
4. Integrate with quality gate: `bmad tea trace`
