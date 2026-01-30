# Automation Summary - Story 4.1: Location Marker Animations & Visual States

**Date:** 2026-01-30
**Story:** 4.1 — Location Marker Animations & Visual States
**Mode:** BMad-Integrated
**Coverage Target:** critical-paths

## Tests Created

### E2E Tests

- `tests/e2e/marker-animations.spec.ts` (14 tests, 218 lines)

| Priority | Test | Description |
|----------|------|-------------|
| P1 | Glow filter defs - standard | SVG filter#glow exists with feGaussianBlur |
| P1 | Glow filter defs - strong | SVG filter#glow-strong exists with feGaussianBlur |
| P2 | Glow filter defs - blur comparison | glow-strong has larger stdDeviation than standard |
| P1 | Glow on unlocked markers | All 3 unlocked markers reference `url(#glow)` |
| P1 | Glow-strong on selected | Selected marker switches to `url(#glow-strong)` |
| P1 | Glow revert on deselect | Deselected marker reverts to `url(#glow)` |
| P1 | Lock icons on locked | All 7 locked markers have lock-icon element |
| P1 | No lock icons on unlocked | 3 unlocked markers have no lock-icon element |
| P1 | Lock icon is SVG (not emoji) | Lock icon uses `<rect>` + `<path>`, no `<text>` |
| P2 | Lock icon non-interactive | Lock icon has `pointer-events: none` |
| P1 | Click during animation | Unlocked markers respond to click during glow pulse |
| P1 | Switch animated markers | Sequential selection works without jank |
| P1 | Click locked during animation | Locked markers clickable while unlocked animate |
| P2 | No glow on locked | Locked markers have no filter attribute |

### Unit Tests — No New Tests Needed

Existing 35+ unit tests in `LocationDot.test.tsx` and `TaiwanMap.test.tsx` already comprehensively
cover Story 4.1 at the component level (glow filter refs, hover, selected state, lock icon structure,
SVG shapes, opacity, fill colors).

### API / Component Tests — Not Applicable

Static SPA with no backend. Component testing handled via Vitest + Testing Library (unit layer).

## Infrastructure

No new fixtures, factories, or helpers required. Existing `appPage` fixture and `test-utils` helpers
are sufficient for this static SPA.

## Test Healing Report

**Auto-Heal:** Pattern-based (no MCP)
**Iterations:** 1 of 3

### Failure Pattern: Element Stability (4 tests)

**Root Cause:** Motion's continuous `animate={{ opacity: [0.7, 1, 0.7], r: [6, 7.5, 6] }}`
causes `r` and `opacity` attributes to oscillate every frame. Playwright's `.click()` waits for
"element stability" (no size/position changes between two animation frames) — which never arrives
for continuously animated SVG elements.

**Fix Applied:** Added `{ force: true }` to `.click()` calls on animated unlocked markers.
This bypasses Playwright's stability check, which is correct because:
- The element IS visible and attached
- The "instability" is intentional (continuous animation)
- We are specifically testing that interaction works during animation

**Also:** Changed assertions from `r` attribute checks (which fluctuate mid-animation) to
`filter` attribute checks (`url(#glow-strong)` vs `url(#glow)`) which are deterministic and
change instantly on selection state change.

### Results After Healing

- **Total:** 14 tests
- **Passing:** 14 (100%)
- **Failing:** 0

## Pre-Existing Test Suite Impact

**CRITICAL FINDING:** Story 4.1's Motion animations broke **29 pre-existing E2E tests** across
6 spec files. All failures share the same root cause — `element is not stable` when clicking
`motion.circle` elements with continuous animation.

**Affected specs:**
- `audio-playback.spec.ts` — 8 failures (clicks on unlocked markers)
- `scene-photography.spec.ts` — 8 failures (clicks on unlocked markers)
- `taiwan-map.spec.ts` — 3 failures (opacity assertion + clicks)
- `lock-overlay.spec.ts` — 3 failures (clicks on unlocked markers for setup)
- `keyboard-navigation.spec.ts` — 2 failures (Enter/Space on animated elements)
- `map-interactions.spec.ts` — 2 failures (clicks on unlocked markers)
- `homepage.spec.ts` — 1 failure (console error detection)
- `user-journey.spec.ts` — 1 failure (clicks on unlocked markers)

**Recommended Fix:** Add `{ force: true }` to all `.click()` calls on unlocked marker locators
across the test suite, and update `taiwan-map.spec.ts` opacity assertion for unlocked markers
(Motion animates opacity 0.7-1.0, no static `opacity="1"` attribute exists).

## Coverage Analysis

**Total New Tests:** 14 E2E
- P1: 10 tests (glow filters, lock icons, animation interaction safety)
- P2: 4 tests (blur comparison, non-interactive overlays, visual contrast)

**Acceptance Criteria Coverage:**
- AC#1 (glow pulse animation): ✅ filter definitions, filter refs, selected/deselected transitions
- AC#2 (dimmed locked + lock icon): ✅ lock icons visible, SVG structure, no glow on locked
- AC#3 (animations don't interfere): ✅ click during animation, switch markers, click locked

**Coverage Status:**
- ✅ All 3 acceptance criteria covered at E2E level
- ✅ All P0/P1 scenarios covered
- ✅ No duplicate coverage with existing unit tests (E2E tests browser-rendered behavior)
- ✅ No duplicate coverage with existing E2E tests (new file covers 4.1-specific features only)

## Definition of Done

- [x] All tests follow Given-When-Then format
- [x] All tests have priority tags ([P1], [P2])
- [x] All tests use data-testid selectors
- [x] Tests are deterministic (force: true for animated elements)
- [x] No hard waits or flaky patterns
- [x] No page object abstractions
- [x] Test file under 300 lines (218 lines)
- [x] All 14 tests pass on Chromium
- [x] Healing applied and documented

## Test Execution

```bash
# Run Story 4.1 tests only
npx playwright test tests/e2e/marker-animations.spec.ts

# Run by priority
npx playwright test tests/e2e/marker-animations.spec.ts --grep "P1"

# Run on specific browser
npx playwright test tests/e2e/marker-animations.spec.ts --project=chromium
```

## Next Steps

1. **URGENT:** Fix 29 pre-existing E2E failures caused by Story 4.1's Motion animations — add
   `{ force: true }` to unlocked marker clicks across the test suite
2. Update `taiwan-map.spec.ts` opacity assertion for unlocked markers (remove `opacity="1"` check)
3. Run full suite on both Chromium and WebKit after fixes
4. Consider burn-in loop (10 iterations) to verify no flakiness in animation-related tests
