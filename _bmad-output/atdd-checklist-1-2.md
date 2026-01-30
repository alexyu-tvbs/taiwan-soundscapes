# ATDD Checklist - Epic 1, Story 1.2: Interactive Taiwan Map with Location Markers & Brand Tagline

**Date:** 2026-01-30 **Author:** Alex Yu **Primary Test Level:** E2E (Playwright)

---

## Story Summary

As a user, I want to see an interactive Taiwan map with location markers upon page load, so that I immediately understand this is a geographic sound exploration experience.

**As a** user **I want** an interactive Taiwan map with location markers **So that** I understand this is a geographic sound exploration

---

## Acceptance Criteria

1. SVG Taiwan map (from SimpleMaps) displayed prominently on dark background, centered and sized appropriately
2. 10 location markers visible: 3 unlocked (bright amber, full opacity) + 7 locked (dimmed, 40% opacity)
3. Brand tagline "好眠秘境 — 用耳朵旅行台灣" visible in header area with dark theme styling
4. Hover over any location dot shows the location name (tooltip/label)

---

## Failing Tests Created (RED Phase)

### E2E Tests (14 tests)

**File:** `tests/e2e/taiwan-map.spec.ts` (260 lines)

#### P0 Critical (5 tests)

- **Test:** should display SVG Taiwan map prominently on dark background
  - **Status:** RED - `getByTestId('taiwan-map')` element not found
  - **Verifies:** AC1 — SVG map renders with viewBox, sized >200px (1.2-E2E-001)

- **Test:** should display all 10 location markers on the map
  - **Status:** RED - `getByTestId('location-dot-tamsui')` element not found
  - **Verifies:** AC2 — All 10 markers visible (1.2-E2E-002)

- **Test:** should show 3 unlocked locations with full opacity
  - **Status:** RED - `getByTestId('location-dot-tamsui')` element not found
  - **Verifies:** AC2 — Unlocked markers have opacity=1 (1.2-E2E-002)

- **Test:** should show 7 locked locations with dimmed opacity
  - **Status:** RED - `getByTestId('location-dot-lanyu')` element not found
  - **Verifies:** AC2 — Locked markers have opacity=0.4 (1.2-E2E-002)

- **Test:** should display brand tagline in header area
  - **Status:** RED - `getByTestId('brand-tagline')` element not found
  - **Verifies:** AC3 — Tagline text "好眠秘境 — 用耳朵旅行台灣" (1.2-E2E-003)

#### P1 High (7 tests)

- **Test:** should position unlocked markers with valid SVG coordinates
  - **Status:** RED - `getByTestId('location-dot-tamsui')` element not found
  - **Verifies:** AC2 — Unlocked markers have valid cx/cy attributes (1.2-E2E-004)

- **Test:** should position locked markers with valid SVG coordinates
  - **Status:** RED - `getByTestId('location-dot-lanyu')` element not found
  - **Verifies:** AC2 — Locked markers have valid cx/cy attributes (1.2-E2E-005)

- **Test:** should update selected state when clicking a location marker
  - **Status:** RED - `getByTestId('location-dot-tamsui')` element not found
  - **Verifies:** AC4 — Click changes marker radius to 8 (1.2-E2E-006)

- **Test:** should deselect previous marker when selecting a new one
  - **Status:** RED - `getByTestId('location-dot-tamsui')` element not found
  - **Verifies:** AC4 — Selection toggle between markers (1.2-E2E-006)

- **Test:** should show location name via SVG title element for tooltip
  - **Status:** RED - `getByTestId('location-dot-tamsui')` element not found
  - **Verifies:** AC4 — Unlocked markers have `<title>` with Chinese name (1.2-E2E-007)

- **Test:** should show locked location names via SVG title element
  - **Status:** RED - `getByTestId('location-dot-lanyu')` element not found
  - **Verifies:** AC4 — Locked markers have `<title>` with Chinese name (1.2-E2E-007)

- **Test:** should render Tailwind CSS v4 dark theme utilities
  - **Status:** RED - CSS assertion fails (bg-slate-900 not yet applied to map context)
  - **Verifies:** Tailwind v4 functioning correctly (1.2-E2E-008)

#### P2 Medium (2 tests)

- **Test:** should have valid SVG viewBox attribute on map
  - **Status:** RED - `getByTestId('taiwan-map')` element not found
  - **Verifies:** SVG viewBox format integrity (1.2-E2E-009)

- **Test:** should load page and render map within 2 seconds
  - **Status:** RED - `getByTestId('taiwan-map')` element not found within 2s timeout
  - **Verifies:** Performance baseline NFR1 (1.2-E2E-010)

### Unit Tests (11 tests) — Supplementary

**File:** `tests/unit/locations.test.ts` (100 lines)

**Status:** GREEN — These validate Story 1.1 data model (already implemented)

- 6 P1 tests: location count, unlock states, required fields, Chinese names
- 5 P2 tests: audio/image path patterns, unlock conditions, coordinate values

---

## Data Factories Created

**Not required** — This is a static SPA with no backend, no API calls, and no dynamic data generation. All test data comes from `src/data/locations.ts` which is hardcoded.

---

## Fixtures Created

### Existing Fixtures (Reused)

**File:** `tests/support/fixtures/index.ts`

**Fixtures:**

- `appPage` — Navigate to homepage and wait for networkidle
  - **Setup:** `page.goto('/')` + `waitForLoadState('networkidle')`
  - **Provides:** Ready page state
  - **Cleanup:** None required (static SPA)

### Existing Helpers (Reused)

**File:** `tests/support/helpers/test-utils.ts`

**Exports:**

- `UNLOCKED_LOCATIONS` — Array of unlocked location IDs
- `LOCKED_LOCATIONS` — Array of locked location IDs
- `ALL_LOCATIONS` — Combined array of all location IDs
- `getAppRoot(page)` — Root app container locator
- `getMapElement(page, testId)` — SVG element locator by data-testid

---

## Mock Requirements

**Not required** — Static SPA with no backend services, no API calls, no external dependencies.

---

## Required data-testid Attributes

### TaiwanMap Component (SVG root)

- `taiwan-map` — The SVG root element containing the Taiwan map

### LocationDot Component (SVG circles)

- `location-dot-tamsui` — 淡水河夕陽 marker (unlocked)
- `location-dot-alishan` — 阿里山雲海 marker (unlocked)
- `location-dot-keelung` — 基隆港浪 marker (unlocked)
- `location-dot-lanyu` — 蘭嶼飛魚季 marker (locked)
- `location-dot-taroko` — 太魯閣溪流 marker (locked)
- `location-dot-sunmoonlake` — 日月潭晨曦 marker (locked)
- `location-dot-kenting` — 墾丁星空 marker (locked)
- `location-dot-hehuan` — 合歡山銀河 marker (locked)
- `location-dot-taitung` — 台東稻浪 marker (locked)
- `location-dot-yushan` — 玉山頂風聲 marker (locked)

### App Header

- `brand-tagline` — Brand tagline element ("好眠秘境 — 用耳朵旅行台灣")

**Implementation Example:**

```tsx
// TaiwanMap.tsx
<svg data-testid="taiwan-map" viewBox="...">
  {/* Taiwan outline paths */}
  {locations.map(loc => (
    <LocationDot key={loc.id} location={loc} ... />
  ))}
</svg>

// LocationDot.tsx
<circle
  data-testid={`location-dot-${location.id}`}
  cx={location.coordinates.x}
  cy={location.coordinates.y}
  r={isSelected ? 8 : 6}
  fill={isUnlocked ? '#F59E0B' : '#64748B'}
  opacity={isUnlocked ? 1 : 0.4}
  onClick={() => onClick(location.id)}
  style={{ cursor: 'pointer' }}
>
  <title>{location.name}</title>
</circle>

// App.tsx header
<h1 data-testid="brand-tagline">好眠秘境 — 用耳朵旅行台灣</h1>
```

---

## Implementation Checklist

### Test: SVG Taiwan Map Display (P0 — 1.2-E2E-001)

**File:** `tests/e2e/taiwan-map.spec.ts:17`

**Tasks to make this test pass:**

- [ ] Download SimpleMaps Taiwan SVG from https://simplemaps.com/resources/svg-tw
- [ ] Create `src/components/TaiwanMap.tsx` — convert SVG to inline React JSX component
- [ ] Add `data-testid="taiwan-map"` to the root `<svg>` element
- [ ] Preserve the SVG `viewBox` attribute (do NOT modify)
- [ ] Style map: dark fill (`text-slate-700`), subtle stroke for outline
- [ ] Center map on page, size to fill viewport height (leaving room for header)
- [ ] Import `TaiwanMap` into `App.tsx`
- [ ] Run test: `npx playwright test taiwan-map.spec.ts:17 --project=chromium`
- [ ] ✅ Test passes (green phase)

---

### Test: 10 Location Markers Visible (P0 — 1.2-E2E-002)

**File:** `tests/e2e/taiwan-map.spec.ts:39`

**Tasks to make this test pass:**

- [ ] Create `src/components/LocationDot.tsx` as SVG `<circle>` element
- [ ] Add `data-testid={`location-dot-${location.id}`}` to each circle
- [ ] Render LocationDot for each location in TaiwanMap component
- [ ] Unlocked markers: fill=`#F59E0B` (amber), `opacity={1}`
- [ ] Locked markers: fill=`#64748B` (slate), `opacity={0.4}`
- [ ] Map coordinates from `locations.ts` to `cx`/`cy` SVG attributes
- [ ] Run test: `npx playwright test taiwan-map.spec.ts:39 --project=chromium`
- [ ] ✅ Test passes (green phase)

---

### Test: Brand Tagline Display (P0 — 1.2-E2E-003)

**File:** `tests/e2e/taiwan-map.spec.ts:79`

**Tasks to make this test pass:**

- [ ] Add header section in `App.tsx` above the map
- [ ] Display text: "好眠秘境 — 用耳朵旅行台灣"
- [ ] Add `data-testid="brand-tagline"` attribute
- [ ] Style: centered, white/light text, appropriate font size, dark theme consistent
- [ ] Run test: `npx playwright test taiwan-map.spec.ts:79 --project=chromium`
- [ ] ✅ Test passes (green phase)

---

### Test: Marker SVG Coordinates (P1 — 1.2-E2E-004, 005)

**File:** `tests/e2e/taiwan-map.spec.ts:94`

**Tasks to make this test pass:**

- [ ] Analyze downloaded SimpleMaps SVG viewBox coordinate system
- [ ] Determine correct SVG coordinates for all 10 Taiwan locations
- [ ] Update `src/data/locations.ts` with actual SVG viewBox coordinates (replace placeholders)
- [ ] Verify: Tamsui=north, Alishan=central, Keelung=northeast, Kenting=south, etc.
- [ ] Run test: `npx playwright test taiwan-map.spec.ts:94 --project=chromium`
- [ ] ✅ Test passes (green phase)

---

### Test: Click Selection State (P1 — 1.2-E2E-006)

**File:** `tests/e2e/taiwan-map.spec.ts:132`

**Tasks to make this test pass:**

- [ ] Add `selectedLocationId` state in `App.tsx` (`useState<string | null>(null)`)
- [ ] Pass `selectedLocationId` and `onSelect` handler to TaiwanMap
- [ ] LocationDot: use `r={isSelected ? 8 : 6}` for selected vs default radius
- [ ] Add `onClick={() => onClick(location.id)}` handler
- [ ] Run test: `npx playwright test taiwan-map.spec.ts:132 --project=chromium`
- [ ] ✅ Test passes (green phase)

---

### Test: Hover Tooltip via SVG Title (P1 — 1.2-E2E-007)

**File:** `tests/e2e/taiwan-map.spec.ts:166`

**Tasks to make this test pass:**

- [ ] Add `<title>{location.name}</title>` as child of each `<circle>` in LocationDot
- [ ] Verify Chinese names match: 淡水河夕陽, 阿里山雲海, 基隆港浪, etc.
- [ ] Run test: `npx playwright test taiwan-map.spec.ts:166 --project=chromium`
- [ ] ✅ Test passes (green phase)

---

### Test: Tailwind CSS v4 Dark Theme (P1 — 1.2-E2E-008)

**File:** `tests/e2e/taiwan-map.spec.ts:211`

**Tasks to make this test pass:**

- [ ] Verify `@import "tailwindcss"` in `src/index.css` (NOT `@tailwind` directives)
- [ ] Verify `@tailwindcss/vite` plugin in `vite.config.ts`
- [ ] Verify NO `tailwind.config.js` exists
- [ ] Apply `bg-slate-900 text-white min-h-screen` to root div in App.tsx
- [ ] Run test: `npx playwright test taiwan-map.spec.ts:211 --project=chromium`
- [ ] ✅ Test passes (green phase)

---

## Running Tests

```bash
# Run all E2E failing tests for Story 1.2
npx playwright test taiwan-map.spec.ts --project=chromium

# Run P0 tests only
npx playwright test taiwan-map.spec.ts -g "P0 Critical" --project=chromium

# Run tests in headed mode (see browser)
npx playwright test taiwan-map.spec.ts --headed --project=chromium

# Debug specific test
npx playwright test taiwan-map.spec.ts:17 --debug --project=chromium

# Run unit tests (data model validation)
npm run test:unit

# Run all tests
npx playwright test taiwan-map.spec.ts --project=chromium && npm run test:unit
```

---

## Red-Green-Refactor Workflow

### RED Phase (Complete) ✅

**TEA Agent Responsibilities:**

- ✅ All 14 E2E tests written and failing (missing implementation)
- ✅ 11 unit tests written and passing (data model validation)
- ✅ Existing fixtures and helpers reused (appPage, getMapElement)
- ✅ No mock requirements (static SPA)
- ✅ 12 data-testid attributes documented
- ✅ Implementation checklist created with clear tasks
- ✅ Vitest installed and configured for unit tests

**Verification:**

- All 14 E2E tests run and fail as expected
- Failure messages are clear: `getByTestId('taiwan-map') element not found`
- Tests fail due to missing implementation, not test bugs
- Unit tests pass (data from Story 1.1 is valid)

---

### GREEN Phase (DEV Team - Next Steps)

**DEV Agent Responsibilities:**

1. **Pick one failing test** from implementation checklist (start with P0)
2. **Read the test** to understand expected behavior
3. **Implement minimal code** to make that specific test pass
4. **Run the test** to verify it now passes (green)
5. **Check off the task** in implementation checklist
6. **Move to next test** and repeat

**Recommended Order:**

1. Brand tagline (P0, simplest — just add header text + data-testid)
2. SVG Taiwan Map (P0 — download SVG, create TaiwanMap.tsx)
3. Location markers (P0 — create LocationDot.tsx, render 10 markers)
4. Marker coordinates (P1 — analyze SVG, update locations.ts)
5. Click selection (P1 — add state management in App.tsx)
6. Hover tooltip (P1 — add `<title>` to LocationDot)
7. Tailwind validation (P1 — verify config)

---

### REFACTOR Phase (DEV Team - After All Tests Pass)

**DEV Agent Responsibilities:**

1. **Verify all tests pass** (green phase complete)
2. **Review code for quality** (readability, component boundaries)
3. **Optimize SVG** (remove unnecessary paths, minimize size)
4. **Ensure tests still pass** after each refactor
5. **TypeScript strict mode** — no `any`, proper typing

---

## Next Steps

1. **Review this checklist** and failing tests
2. **Run failing tests** to confirm RED phase: `npx playwright test taiwan-map.spec.ts --project=chromium`
3. **Begin implementation** using implementation checklist as guide
4. **Work one test at a time** (red → green for each)
5. **When all tests pass**, refactor code for quality
6. **When refactoring complete**, update story status to 'done' in sprint-status.yaml

---

## Knowledge Base References Applied

- **fixture-architecture.md** — Composable fixture patterns (reused existing `appPage` fixture)
- **test-quality.md** — Given-When-Then structure, deterministic tests, explicit assertions
- **selector-resilience.md** — data-testid hierarchy for all interactive elements
- **test-levels-framework.md** — E2E for UI rendering + Unit for data validation

See `tea-index.csv` for complete knowledge fragment mapping.

---

## Test Execution Evidence

### Initial Test Run (RED Phase Verification)

**Command:** `npx playwright test taiwan-map.spec.ts --project=chromium`

**Results:**

```
Running 14 tests using 6 workers
  ✘  14 tests failed

All failures: "element(s) not found" for data-testid selectors
  - getByTestId('taiwan-map')
  - getByTestId('location-dot-{id}')
  - getByTestId('brand-tagline')
```

**Summary:**

- Total E2E tests: 14
- Passing: 0 (expected)
- Failing: 14 (expected)
- Status: ✅ RED phase verified

**Unit Tests:** `npm run test:unit`

- Total unit tests: 11
- Passing: 11 (data model from Story 1.1 is valid)
- Status: ✅ Data integrity confirmed

---

## Notes

- This is a static SPA — no backend, no API calls, no network requests, no data persistence
- No data factories needed (all data hardcoded in `locations.ts`)
- No mock requirements (no external services)
- SVG coordinates in `locations.ts` are placeholders — must be updated after downloading SimpleMaps SVG
- Vitest v4.0.18 installed and configured (test:unit script added to package.json)
- Vitest config added to `vite.config.ts` to exclude E2E tests from unit test runner

---

**Generated by BMad TEA Agent** - 2026-01-30
