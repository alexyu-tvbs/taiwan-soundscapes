# Story 3.1: Locked Location Interaction & Unlock Condition Display

Status: done

## Story

As a user,
I want to click a locked location and see its unlock condition in warm language,
So that I understand the gamification mechanic and feel motivated to "collect Taiwan's sounds by sleeping well."

## Acceptance Criteria

1. **Given** the map displays locked location markers **When** the user views the locked locations **Then** each locked location shows a visible lock indicator distinguishing it from unlocked locations (FR11)

2. **Given** a locked location is visible on the map **When** the user clicks a locked location (e.g., 蘭嶼飛魚季) **Then** a `LockOverlay` modal/panel appears displaying the location name and its specific unlock condition (FR4, FR12) **And** the overlay can be dismissed by the user

3. **Given** unlock conditions are displayed **When** the user reads the unlock condition text **Then** the language is warm and positive (e.g., "連續好眠 14 天，解鎖這片海洋") with no countdowns, no punishment framing, and no anxiety-inducing language (FR13)

4. **Given** the prototype has 7 locked locations **When** the user clicks each locked location in sequence **Then** all 7 locations display their unique name and unlock condition prompt (FR15):
   - 蘭嶼飛魚季 (Lanyu Flying Fish Festival)
   - 太魯閣溪流 (Taroko Gorge Stream)
   - 日月潭晨曦 (Sun Moon Lake Dawn)
   - 墾丁星空 (Kenting Starry Sky)
   - 合歡山銀河 (Hehuan Mountain Milky Way)
   - 台東稻浪 (Taitung Rice Waves)
   - 玉山頂風聲 (Jade Mountain Summit Wind)

## Tasks / Subtasks

- [x] Task 1: Enhance LocationDot with lock indicator (AC: #1)
  - [x] 1.1 Update `src/components/LocationDot.tsx` to render a lock icon for locked locations
  - [x] 1.2 Lock icon approach: Add a small SVG lock symbol (e.g., `<text>` with 🔒 or a simple SVG path) positioned near the circle
  - [x] 1.3 Locked dots already dimmed (opacity 0.4 from Story 1.2) — add the lock icon ON TOP of the dimmed circle
  - [x] 1.4 Lock icon must be small enough not to overlap adjacent markers
  - [x] 1.5 Ensure lock icon is an SVG element (NOT HTML) — it lives inside the `<svg>` map

- [x] Task 2: Create `LockOverlay` component (AC: #2, #3)
  - [x] 2.1 Create `src/components/LockOverlay.tsx`
  - [x] 2.2 Props: `LockOverlayProps { location: Location; onClose: () => void }`
  - [x] 2.3 Display location name (zh) prominently
  - [x] 2.4 Display location English name as subtitle
  - [x] 2.5 Display unlock condition text from `location.unlockCondition` — warm, positive language
  - [x] 2.6 Add a close/dismiss button or click-outside-to-close behavior
  - [x] 2.7 Style as modal overlay: centered, semi-transparent dark backdrop, rounded panel

- [x] Task 3: Integrate locked click flow into App.tsx (AC: #2, #4)
  - [x] 3.1 Update `handleSelect` in App.tsx to distinguish unlocked vs locked clicks:
    - Unlocked → play audio + show LocationDetail (existing from Story 2.1/2.2)
    - Locked → show LockOverlay (NO audio)
  - [x] 3.2 Add state: `lockedLocation` (Location | null) for tracking which locked location overlay to show
  - [x] 3.3 Render `LockOverlay` conditionally when `lockedLocation` is set
  - [x] 3.4 On close: set `lockedLocation` to null
  - [x] 3.5 When showing LockOverlay, do NOT stop any currently playing audio from an unlocked location

- [x] Task 4: Verify all 7 locked locations display correctly (AC: #4)
  - [x] 4.1 Click each of the 7 locked locations and verify overlay shows correct name and unlock condition
  - [x] 4.2 Verify overlay dismisses properly for each
  - [x] 4.3 Verify unlock condition text uses warm language (no countdowns, no punishment)

## Dev Notes

### LockOverlay Component Pattern

```tsx
interface LockOverlayProps {
  location: Location;
  onClose: () => void;
}

export const LockOverlay = ({ location, onClose }: LockOverlayProps) => {
  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-slate-800 rounded-2xl p-8 max-w-sm text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-4xl mb-4">🔒</div>
        <h2 className="text-xl font-bold text-white mb-1">{location.name}</h2>
        <p className="text-slate-400 text-sm mb-4">{location.nameEn}</p>
        <p className="text-amber-300 text-lg">{location.unlockCondition}</p>
        <button
          className="mt-6 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white text-sm"
          onClick={onClose}
        >
          關閉
        </button>
      </div>
    </div>
  );
};
```

**Design intent:** The unlock condition should feel like an invitation, not a barrier. Warm amber text for the condition, gentle modal appearance. The user should think "I want to unlock this" not "I can't access this."

### Lock Icon on LocationDot — SVG Approach

The lock indicator must be an SVG element because it lives inside the `<svg>` map (NOT HTML overlay).

```tsx
export const LocationDot = ({ location, isSelected, onClick }: LocationDotProps) => {
  const isUnlocked = location.status === 'unlocked';
  return (
    <g onClick={() => onClick(location.id)} style={{ cursor: 'pointer' }}>
      <circle
        cx={location.coordinates.x}
        cy={location.coordinates.y}
        r={isSelected ? 8 : 6}
        fill={isUnlocked ? '#F59E0B' : '#64748B'}
        opacity={isUnlocked ? 1 : 0.4}
      />
      {!isUnlocked && (
        <text
          x={location.coordinates.x}
          y={location.coordinates.y + 1}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={8}
          fill="white"
          opacity={0.6}
          style={{ pointerEvents: 'none' }}
        >
          🔒
        </text>
      )}
      <title>{location.name}</title>
    </g>
  );
};
```

**Note:** Wrapping `<circle>` and `<text>` in a `<g>` group element allows a single click handler for the whole marker. The `<title>` provides the native hover tooltip.

**Alternative:** If emoji rendering in SVG is inconsistent, use a simple SVG path for the lock shape instead.

### App.tsx Updated Click Flow

```tsx
export const App = () => {
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [lockedLocation, setLockedLocation] = useState<Location | null>(null);
  const audioPlayer = useAudioPlayer();

  const selectedLocation = locations.find(l => l.id === selectedLocationId) ?? null;
  const isUnlockedSelection = selectedLocation?.status === 'unlocked';

  const handleSelect = (id: string) => {
    const loc = locations.find(l => l.id === id);
    if (!loc) return;

    if (loc.status === 'unlocked') {
      setSelectedLocationId(id);
      setLockedLocation(null);
      audioPlayer.play(loc.audioPath);
    } else {
      // Locked: show overlay, do NOT change selected unlocked location or stop audio
      setLockedLocation(loc);
    }
  };

  return (
    <div className="bg-slate-900 text-white min-h-screen flex flex-col">
      {/* header, map, LocationDetail, SoundscapePlayer from previous stories */}
      {lockedLocation && (
        <LockOverlay
          location={lockedLocation}
          onClose={() => setLockedLocation(null)}
        />
      )}
    </div>
  );
};
```

**Key behavior:** Clicking a locked location shows the overlay WITHOUT stopping any currently playing audio from an unlocked location. The user can dismiss the overlay and continue listening.

### Unlock Condition Text — All 7 Locations

These are defined in `locations.ts` (from Story 1.1). Verify they all follow warm, positive language:

| Location | Unlock Condition |
|----------|------------------|
| 蘭嶼飛魚季 | 連續好眠 14 天，解鎖這片海洋 |
| 太魯閣溪流 | 好眠 21 天，走進太魯閣的溪谷 |
| 日月潭晨曦 | 累積好眠 30 晚，迎接日月潭的第一道光 |
| 墾丁星空 | 連續好眠 7 天，仰望墾丁的星空 |
| 合歡山銀河 | 好眠 45 天，在合歡山遇見銀河 |
| 台東稻浪 | 連續好眠 10 天，聆聽稻浪的聲音 |
| 玉山頂風聲 | 累積好眠 60 晚，攻頂玉山聽風 |

**Language rules (FR13):**
- NO countdowns ("剩餘 X 天")
- NO punishment framing ("你還沒達成")
- NO anxiety-inducing language
- YES warm invitations ("解鎖這片海洋", "走進溪谷", "遇見銀河")

### Dependencies on Previous Stories

- **Story 1.1:** `Location` type with `unlockCondition` field, `locations.ts` data with all 7 locked locations
- **Story 1.2:** `TaiwanMap` + `LocationDot` components with click handling, App.tsx `selectedLocationId` state
- **Story 2.1:** `useAudioPlayer` in App.tsx, `SoundscapePlayer` component
- **Story 2.2:** `LocationDetail` component, scene photo display

**Key integration:** This story modifies `LocationDot.tsx` (adds lock icon), modifies `App.tsx` (adds locked click branch + LockOverlay state), and creates `LockOverlay.tsx`.

### What This Story Does NOT Include

- No glow animations on unlocked markers (Story 4.1)
- No dimmed/muted animation on locked markers (Story 4.1) — static opacity only
- No fade-in/out transition on LockOverlay (Story 4.2)
- No actual unlock functionality — this is a display-only prototype
- No audio for locked locations — they only show the overlay

### Project Structure After This Story

```
src/
├── components/
│   ├── TaiwanMap.tsx           # From Story 1.2
│   ├── LocationDot.tsx         # UPDATED — adds lock icon for locked locations
│   ├── SoundscapePlayer.tsx    # From Story 2.1
│   ├── LocationDetail.tsx      # From Story 2.2
│   └── LockOverlay.tsx         # NEW — locked location modal with unlock condition
├── hooks/
│   └── useAudioPlayer.ts      # From Story 2.1
├── data/
│   └── locations.ts            # From Story 1.1/1.2
├── types/
│   └── index.ts                # From Story 1.1
├── App.tsx                     # UPDATED — adds lockedLocation state, locked click flow, LockOverlay render
├── index.css
└── main.tsx
```

### References

- [Source: _bmad-output/planning-artifacts/architecture.md#Project Structure & Boundaries] — LockOverlay receives lockedLocation, onClose
- [Source: _bmad-output/planning-artifacts/architecture.md#Frontend Architecture — Data Flow] — If locked: show LockOverlay with unlock condition
- [Source: _bmad-output/planning-artifacts/epics.md#Story 3.1] — Acceptance criteria, 7 locked locations list
- [Source: _bmad-output/planning-artifacts/prd.md#Unlock System] — FR4, FR11, FR12, FR13 (warm language)
- [Source: _bmad-output/planning-artifacts/prd.md#Innovation — Anti-Anxiety Gamification] — No countdowns, no punishment, warm invitations
- [Source: _bmad-output/project-context.md#SVG Map Rules] — Markers are SVG children, viewBox coordinates
- [Source: _bmad-output/project-context.md#Dark Theme] — Locked locations opacity-40

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

No issues encountered during implementation.

### Completion Notes List

- Task 1: Updated `LocationDot.tsx` — wrapped `<circle>` in `<g>` group, added SVG `<text>` lock icon (🔒) for locked locations with `opacity={0.6}`, `fontSize={8}`, and `pointerEvents: 'none'`. All existing tests preserved via backward-compatible structure.
- Task 2: Created `LockOverlay.tsx` — modal overlay with semi-transparent dark backdrop, centered panel displaying location name (zh), English name subtitle, unlock condition in amber text, close button, and click-outside-to-dismiss behavior.
- Task 3: Updated `App.tsx` — added `lockedLocation` state (`Location | null`), modified `handleSelect` to branch on locked vs unlocked: unlocked plays audio + shows LocationDetail, locked shows LockOverlay without stopping audio. Updated existing test expectation (locked click no longer pauses audio per story requirement).
- Task 4: Verified all 7 locked locations (蘭嶼飛魚季, 太魯閣溪流, 日月潭晨曦, 墾丁星空, 合歡山銀河, 台東稻浪, 玉山頂風聲) display correct name, unlock condition, and dismiss properly. Warm language validated — no countdowns, no punishment framing.

### File List

- `src/components/LocationDot.tsx` — MODIFIED (added `<g>` wrapper + SVG path lock icon for locked locations)
- `src/components/LockOverlay.tsx` — NEW (lock overlay modal with Escape key dismiss, focus management, ARIA dialog attrs)
- `src/components/LocationDetail.tsx` — MODIFIED (refactored image error handling: removed useEffect, path-based error tracking)
- `src/App.tsx` — MODIFIED (added `lockedLocation` state, locked click flow, LockOverlay render)
- `tests/unit/LocationDot.test.tsx` — MODIFIED (added 6 lock indicator tests)
- `tests/unit/LockOverlay.test.tsx` — NEW (13 tests: display, dismiss, Escape key, ARIA, focus management)
- `tests/unit/App.test.tsx` — MODIFIED (updated locked audio test, added 23 LockOverlay integration + 7-location verification tests)
- `tests/e2e/lock-overlay.spec.ts` — NEW (14 E2E tests for LockOverlay behavior)
- `tests/e2e/keyboard-navigation.spec.ts` — NEW (6 keyboard accessibility E2E tests)
- `tests/e2e/user-journey.spec.ts` — NEW (full user journey E2E test)
- `tests/e2e/audio-playback.spec.ts` — MODIFIED (E2E coverage expansion)
- `tests/e2e/scene-photography.spec.ts` — MODIFIED (E2E coverage expansion)
- `tests/e2e/map-interactions.spec.ts` — MODIFIED (E2E coverage expansion)
- `package.json` — MODIFIED (Node engine updated to >=24.0.0)

### Change Log

- 2026-01-30: Implemented Story 3.1 — Locked Location Interaction & Unlock Condition Display. Added lock indicator on map markers, LockOverlay modal component, and App.tsx integration for locked click flow. 127 tests passing, 0 regressions.
- 2026-01-30: Code review fixes — (M2) Added Escape key dismiss to LockOverlay, (M3) replaced SVG emoji lock icon with cross-browser SVG path, (M4) added auto-focus on close button, (L1) added role="dialog" + aria-modal="true", (M1) updated File List with 8 previously undocumented files, fixed CI lint error (unused import). 131 tests passing, 0 regressions.
