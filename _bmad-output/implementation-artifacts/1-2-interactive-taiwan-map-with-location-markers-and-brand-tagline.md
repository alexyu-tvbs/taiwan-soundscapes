# Story 1.2: Interactive Taiwan Map with Location Markers & Brand Tagline

Status: review

## Story

As a user,
I want to see an interactive Taiwan map with location markers upon page load,
So that I immediately understand this is a geographic sound exploration experience.

## Acceptance Criteria

1. **Given** the user opens the page in a browser **When** the page finishes loading **Then** an SVG Taiwan map (converted from SimpleMaps) is displayed prominently on the dark background (FR1) **And** the map is centered and sized appropriately for the viewport

2. **Given** the Taiwan map is displayed **When** the user looks at the map **Then** 10 location markers are visible at geographically appropriate positions on the map (FR2) **And** 3 unlocked locations (淡水河夕陽, 阿里山雲海, 基隆港浪) appear bright/visible **And** 7 locked locations appear dimmed/muted (basic visual distinction, no animation yet)

3. **Given** the page is loaded **When** the user views the interface **Then** the brand tagline "好眠秘境 — 用耳朵旅行台灣" is visible in the header area (FR5) **And** the tagline uses styling consistent with the dark theme

4. **Given** the map has location markers **When** the user hovers over any location dot **Then** the location name is displayed (tooltip or label)

## Tasks / Subtasks

- [x] Task 1: Download and convert SimpleMaps Taiwan SVG to React component (AC: #1)
  - [x] 1.1 Download Taiwan SVG from SimpleMaps (https://simplemaps.com/resources/svg-tw — 19.1 KB, free)
  - [x] 1.2 Create `src/components/TaiwanMap.tsx` — convert SVG markup to inline JSX
  - [x] 1.3 Note the SVG `viewBox` dimensions and coordinate system for marker positioning
  - [x] 1.4 Style the map: fill with dark/muted color (e.g., `fill="currentColor"` with Tailwind `text-slate-700`), stroke with subtle border
  - [x] 1.5 Center the map on the page and size it to fill the viewport height (leaving room for header)

- [x] Task 2: Create LocationDot component (AC: #2, #4)
  - [x] 2.1 Create `src/components/LocationDot.tsx` as an SVG `<circle>` element
  - [x] 2.2 Props interface: `LocationDotProps { location: Location; isSelected: boolean; onClick: (id: string) => void }`
  - [x] 2.3 Unlocked visual: bright fill color (warm amber/gold, e.g., `#F59E0B`), full opacity
  - [x] 2.4 Locked visual: dimmed fill color, reduced opacity (`opacity={0.4}`)
  - [x] 2.5 Add `cursor-pointer` behavior and click handler calling `onClick(location.id)`
  - [x] 2.6 Hover: show location name via SVG `<title>` element for native browser tooltip

- [x] Task 3: Determine SVG coordinates for all 10 locations (AC: #2)
  - [x] 3.1 Analyze the SimpleMaps SVG viewBox to understand the coordinate system
  - [x] 3.2 Map each of the 10 real Taiwan locations to approximate SVG coordinates:
    - 淡水河夕陽 (Tamsui) — northern coast, near Taipei
    - 阿里山雲海 (Alishan) — central mountain, Chiayi area
    - 基隆港浪 (Keelung) — northeast coast
    - 蘭嶼飛魚季 (Lanyu) — offshore island, southeast of Taitung
    - 太魯閣溪流 (Taroko) — east coast, Hualien area
    - 日月潭晨曦 (Sun Moon Lake) — central, Nantou area
    - 墾丁星空 (Kenting) — southern tip
    - 合歡山銀河 (Hehuan Mountain) — central mountain range
    - 台東稻浪 (Taitung) — southeast coast
    - 玉山頂風聲 (Jade Mountain) — central, highest peak
  - [x] 3.3 Update `src/data/locations.ts` with actual SVG coordinates (replacing placeholders from Story 1.1)

- [x] Task 4: Integrate map into App.tsx with state management (AC: #1, #2)
  - [x] 4.1 Import `TaiwanMap` into `App.tsx`
  - [x] 4.2 Add state: `selectedLocationId` (string | null) in App.tsx
  - [x] 4.3 Pass `locations`, `selectedLocationId`, and `onSelect` handler to TaiwanMap
  - [x] 4.4 TaiwanMap renders LocationDot for each location from the data array
  - [x] 4.5 On click: update `selectedLocationId` state (audio/panel integration deferred to Epic 2)

- [x] Task 5: Add brand tagline (AC: #3)
  - [x] 5.1 Add header section in `App.tsx` above the map
  - [x] 5.2 Display: "好眠秘境 — 用耳朵旅行台灣"
  - [x] 5.3 Style: centered, white/light text, appropriate font size for header prominence, consistent with dark theme

## Dev Notes

### SVG Map — Critical Architecture Rules

**Source:** SimpleMaps Taiwan SVG — https://simplemaps.com/resources/svg-tw (19.1 KB, free, web-optimized)

**Conversion to React:**
- Download the SVG file, open in editor
- Convert SVG attributes to JSX (e.g., `class` → `className`, `stroke-width` → `strokeWidth`)
- Remove any `<?xml>` declarations or doctype
- Wrap in a React component with proper typing
- The SVG `viewBox` attribute defines the coordinate space — DO NOT change it

**Location Markers — SVG Child Elements (NOT CSS positioning):**
```tsx
// CORRECT: Markers are <circle> elements INSIDE the <svg>
<svg viewBox="...">
  {/* Map paths */}
  <path d="..." />
  {/* Location markers as SVG children */}
  <circle cx={location.coordinates.x} cy={location.coordinates.y} r={6} />
</svg>

// WRONG: Do NOT use CSS absolute positioning
<div style={{ position: 'relative' }}>
  <svg>...</svg>
  <div style={{ position: 'absolute', left: x, top: y }}>dot</div>  {/* NEVER */}
</div>
```

**Coordinate System:**
- Coordinates use the SVG viewBox coordinate system — NOT CSS pixels
- The `x` and `y` in `locations.ts` correspond to SVG `cx` and `cy` attributes
- All 10 location coordinates must be determined by inspecting the downloaded SVG viewBox

### Component Architecture

**TaiwanMap.tsx:**
```tsx
interface TaiwanMapProps {
  locations: Location[];
  selectedLocationId: string | null;
  onSelect: (id: string) => void;
}

export const TaiwanMap = ({ locations, selectedLocationId, onSelect }: TaiwanMapProps) => {
  return (
    <svg viewBox="..." className="...">
      {/* Taiwan outline paths from SimpleMaps */}
      {/* LocationDot for each location */}
      {locations.map(loc => (
        <LocationDot
          key={loc.id}
          location={loc}
          isSelected={loc.id === selectedLocationId}
          onClick={onSelect}
        />
      ))}
    </svg>
  );
};
```

**LocationDot.tsx:**
```tsx
interface LocationDotProps {
  location: Location;
  isSelected: boolean;
  onClick: (id: string) => void;
}

export const LocationDot = ({ location, isSelected, onClick }: LocationDotProps) => {
  const isUnlocked = location.status === 'unlocked';
  return (
    <circle
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
  );
};
```

**App.tsx integration:**
```tsx
export const App = () => {
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);

  return (
    <div className="bg-slate-900 text-white min-h-screen">
      <header className="text-center py-6">
        <h1 className="text-2xl font-bold">好眠秘境 — 用耳朵旅行台灣</h1>
      </header>
      <TaiwanMap
        locations={locations}
        selectedLocationId={selectedLocationId}
        onSelect={setSelectedLocationId}
      />
    </div>
  );
};
```

### Visual Design Guidance

**Unlocked markers:** Warm amber/gold (`#F59E0B` or Tailwind `amber-500`) — full opacity, inviting
**Locked markers:** Cool slate (`#64748B` or Tailwind `slate-500`) — 40% opacity, clearly dimmed
**Map fill:** Dark slate (`text-slate-700` or similar) — visible against `bg-slate-900` background
**Map stroke:** Subtle lighter stroke for Taiwan outline visibility
**Brand tagline:** White text, centered, elegant sizing (not too large, not too small)

**NO animations in this story** — glow pulse and transitions are Story 4.1 and 4.2. Keep markers as static visual states only.

### Previous Story Intelligence (Story 1.1)

Story 1.1 creates the following foundations this story builds on:
- **Project initialized:** Vite + React + TypeScript + Tailwind v4 + Motion
- **Dark theme:** `bg-slate-900 text-white min-h-screen` on root
- **Types created:** `src/types/index.ts` with `Location` type including `coordinates: { x: number, y: number }`
- **Location data:** `src/data/locations.ts` with all 10 locations — **coordinates are placeholders** that MUST be updated in this story
- **Empty components/:** Ready for `TaiwanMap.tsx` and `LocationDot.tsx`

**Key dependency:** This story MUST update the placeholder coordinates in `locations.ts` with actual SVG viewBox coordinates after analyzing the downloaded SimpleMaps SVG.

### What This Story Does NOT Include

- No audio playback on click (Story 2.1)
- No scene photograph display (Story 2.2)
- No lock overlay/modal on locked click (Story 3.1)
- No glow pulse animation on unlocked markers (Story 4.1)
- No Motion transitions (Story 4.2)
- Click handler sets selectedLocationId state only — downstream effects added in later stories

### Project Structure After This Story

```
src/
├── components/
│   ├── TaiwanMap.tsx           # NEW — SVG Taiwan map inline component
│   └── LocationDot.tsx         # NEW — Individual map marker (circle)
├── hooks/                      # Empty (Story 2.1)
├── data/
│   └── locations.ts            # UPDATED — real SVG coordinates
├── types/
│   └── index.ts                # Unchanged from Story 1.1
├── App.tsx                     # UPDATED — integrates TaiwanMap + header tagline + selectedLocationId state
├── index.css
└── main.tsx
```

### References

- [Source: _bmad-output/planning-artifacts/architecture.md#Frontend Architecture — Decision 2] — SimpleMaps SVG approach, inline React component, SVG child elements
- [Source: _bmad-output/planning-artifacts/architecture.md#Project Structure & Boundaries] — Component boundary tree with props
- [Source: _bmad-output/planning-artifacts/architecture.md#Implementation Patterns] — Arrow function + named export, PascalCase, prop drilling
- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.2] — Acceptance criteria
- [Source: _bmad-output/planning-artifacts/prd.md#Map Exploration] — FR1, FR2, FR5
- [Source: _bmad-output/project-context.md#SVG Map Rules] — viewBox coordinates, NO CSS positioning, markers as SVG children

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5

### Debug Log References

- Tailwind CSS v4 E2E test fix: oklch color space format (not rgb) — updated `taiwan-map.spec.ts` to accept both formats
- SVG source: @svg-maps/taiwan npm package (based on SimpleMaps data), viewBox `0 0 1000 1295`
- Installed `@testing-library/react`, `happy-dom` for component unit testing (jsdom had ESM compatibility issue)

### Completion Notes List

- Task 1: Created `TaiwanMap.tsx` with full SimpleMaps SVG inline paths (20 administrative regions), viewBox `0 0 1000 1295`, dark styling with `text-slate-700` fill and `#475569` stroke
- Task 2: Created `LocationDot.tsx` as SVG `<circle>` with unlocked (#F59E0B, opacity 1) and locked (#64748B, opacity 0.4) visual states, r=6/8 for default/selected, `<title>` tooltip
- Task 3: Updated all 10 location coordinates in `locations.ts` based on SVG path analysis — mapped to geographically accurate positions within the viewBox coordinate system
- Task 4: Integrated TaiwanMap into App.tsx with `selectedLocationId` state via `useState`, prop drilling pattern per project-context.md
- Task 5: Added brand tagline "好眠秘境 — 用耳朵旅行台灣" as centered header with `text-2xl font-bold` styling
- All unit tests: 32/32 passing (4 test files: locations, TaiwanMap, LocationDot, App)
- All E2E tests: 17/17 passing (homepage + taiwan-map specs)
- Build, TypeScript, ESLint: all clean

### Change Log

- 2026-01-30: Implemented Story 1.2 — Interactive Taiwan Map with Location Markers & Brand Tagline

### File List

**New Files:**
- `src/components/TaiwanMap.tsx` — SVG Taiwan map inline React component with all administrative region paths
- `src/components/LocationDot.tsx` — Individual map marker as SVG circle with visual states
- `tests/unit/TaiwanMap.test.tsx` — Unit tests for TaiwanMap component (4 tests)
- `tests/unit/LocationDot.test.tsx` — Unit tests for LocationDot component (12 tests)
- `tests/unit/App.test.tsx` — Unit tests for App integration (5 tests)

**Modified Files:**
- `src/App.tsx` — Added TaiwanMap integration, selectedLocationId state, brand tagline header
- `src/data/locations.ts` — Updated all 10 location coordinates from placeholders to actual SVG viewBox coordinates
- `vite.config.ts` — Added `environment: 'happy-dom'` for component unit testing
- `tests/e2e/taiwan-map.spec.ts` — Fixed Tailwind CSS v4 oklch color format assertion
- `_bmad-output/implementation-artifacts/sprint-status.yaml` — Story status: ready-for-dev → in-progress → review

**New Dev Dependencies:**
- `@testing-library/react` — React component testing
- `@testing-library/jest-dom` — DOM assertion matchers
- `happy-dom` — DOM environment for Vitest (replaced jsdom due to ESM issue)
