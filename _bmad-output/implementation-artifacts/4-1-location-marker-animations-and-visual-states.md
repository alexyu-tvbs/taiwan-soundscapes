# Story 4.1: Location Marker Animations & Visual States

Status: review

## Story

As a user,
I want to see animated glow effects on unlocked locations and polished lock icons on locked locations,
So that the map feels alive and the visual quality reaches presentation-grade.

## Acceptance Criteria

1. **Given** the map displays unlocked location markers **When** the page is loaded and idle **Then** unlocked markers display a continuous soft glow pulse animation using Motion (FR18) **And** the glow effect conveys warmth and invites interaction

2. **Given** the map displays locked location markers **When** the user views the locked locations **Then** locked markers appear in a dimmed/muted visual state with a visible lock icon overlay (FR19) **And** the contrast between unlocked (glowing) and locked (dimmed + icon) is immediately obvious

3. **Given** the glow animations are running **When** the user interacts with the map (hover, click) **Then** animations do not interfere with click targets or cause visual jank

## Tasks / Subtasks

- [x] Task 1: Add Motion glow pulse to unlocked LocationDot (AC: #1, #3)
  - [x] 1.1 Import `motion` from `"motion/react"` in `LocationDot.tsx`
  - [x] 1.2 Replace `<circle>` with `<motion.circle>` for unlocked markers
  - [x] 1.3 Add continuous glow pulse animation: scale or opacity breathing effect
  - [x] 1.4 Add SVG `<filter>` with `<feGaussianBlur>` for soft glow halo around unlocked dots
  - [x] 1.5 Glow color: warm amber/gold (`#F59E0B` / `#FBBF24`) — conveys warmth
  - [x] 1.6 Animation timing: gentle, slow pulse (2-3 second cycle) — NOT frantic or distracting
  - [x] 1.7 Ensure glow does not expand clickable area beyond the circle — pointer events on circle only
  - [x] 1.8 Test at 60fps: no visible jank during continuous animation

- [x] Task 2: Polish locked LocationDot visual state (AC: #2)
  - [x] 2.1 Ensure locked markers have clear dimmed state: muted fill color + reduced opacity
  - [x] 2.2 Refine lock icon rendering from Story 3.1 — ensure it's visually polished
  - [x] 2.3 Consider using an SVG path lock icon instead of emoji for consistent cross-browser rendering
  - [x] 2.4 Lock icon color: subtle white or slate at low opacity
  - [x] 2.5 Contrast check: place unlocked (glowing amber) and locked (dimmed slate) markers near each other — the difference must be immediately obvious at a glance

- [x] Task 3: Add hover interaction enhancement (AC: #3)
  - [x] 3.1 Unlocked markers on hover: slightly intensify glow or increase scale
  - [x] 3.2 Locked markers on hover: subtle brightness increase to indicate interactivity
  - [x] 3.3 Use Motion `whileHover` prop for smooth hover transitions
  - [x] 3.4 Hover effects must not cause layout shifts or jank

- [x] Task 4: Selected state visual indicator (AC: #1)
  - [x] 4.1 Currently selected unlocked marker: brighter glow or different animation intensity
  - [x] 4.2 Visually distinguish "selected and playing" from "unlocked but not selected"
  - [x] 4.3 Use `isSelected` prop already passed from TaiwanMap to drive the visual difference

## Dev Notes

### Motion Library — CRITICAL RULES

**Package:** `motion` (NOT `framer-motion`)
**Import:** `import { motion } from "motion/react"`

```tsx
// CORRECT
import { motion } from "motion/react";

// WRONG — will cause import error
import { motion } from "framer-motion";
```

**Motion can animate SVG elements directly:**
- `motion.circle` — animated `<circle>`
- `motion.g` — animated `<g>` group
- `motion.path` — animated `<path>`

### Glow Pulse Animation — SVG Approach

Two complementary techniques for the glow effect:

**1. SVG Filter for halo glow:**
```tsx
// Define once in TaiwanMap.tsx inside the <svg>
<defs>
  <filter id="glow">
    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
    <feMerge>
      <feMergeNode in="coloredBlur" />
      <feMergeNode in="SourceGraphic" />
    </feMerge>
  </filter>
</defs>
```

**2. Motion animation for breathing pulse:**
```tsx
export const LocationDot = ({ location, isSelected, onClick }: LocationDotProps) => {
  const isUnlocked = location.status === 'unlocked';

  if (isUnlocked) {
    return (
      <g onClick={() => onClick(location.id)} style={{ cursor: 'pointer' }}>
        <motion.circle
          cx={location.coordinates.x}
          cy={location.coordinates.y}
          r={isSelected ? 8 : 6}
          fill="#F59E0B"
          filter="url(#glow)"
          animate={{
            opacity: [0.7, 1, 0.7],
            r: isSelected ? [8, 10, 8] : [6, 7.5, 6],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          whileHover={{ scale: 1.3 }}
        />
        <title>{location.name}</title>
      </g>
    );
  }

  // Locked marker — static, dimmed
  return (
    <g onClick={() => onClick(location.id)} style={{ cursor: 'pointer' }}>
      <circle
        cx={location.coordinates.x}
        cy={location.coordinates.y}
        r={6}
        fill="#64748B"
        opacity={0.4}
      />
      {/* Lock icon — SVG path preferred over emoji */}
      <text
        x={location.coordinates.x}
        y={location.coordinates.y + 1}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={7}
        fill="white"
        opacity={0.5}
        style={{ pointerEvents: 'none' }}
      >
        🔒
      </text>
      <title>{location.name}</title>
    </g>
  );
};
```

### SVG Lock Icon Alternative (Cross-Browser Consistent)

If emoji rendering is inconsistent across browsers, use an SVG path for the lock:

```tsx
// Simple lock icon as SVG path, centered on marker
<g
  transform={`translate(${location.coordinates.x - 4}, ${location.coordinates.y - 4})`}
  opacity={0.5}
  style={{ pointerEvents: 'none' }}
>
  <rect x="1" y="4" width="6" height="5" rx="1" fill="white" />
  <path d="M2 4V3a2 2 0 0 1 4 0v1" stroke="white" strokeWidth="1" fill="none" />
</g>
```

### Performance Considerations

- **60fps target (NFR3):** Motion animations are GPU-accelerated by default. SVG filter glow is rendered once and cached by the browser.
- **10 markers total:** Only 3 unlocked markers animate — minimal performance impact.
- **Avoid:** `box-shadow` on SVG elements (not supported) — use SVG `<filter>` instead.
- **Avoid:** JavaScript-driven per-frame updates — let Motion handle the animation loop.

### Visual Hierarchy Summary

| State | Fill | Opacity | Glow | Animation | Hover |
|-------|------|---------|------|-----------|-------|
| Unlocked (idle) | Amber `#F59E0B` | 0.7-1.0 pulse | SVG filter glow | Breathing pulse | Scale up |
| Unlocked (selected) | Amber `#F59E0B` | 0.7-1.0 pulse | Stronger glow | Larger breathing | — |
| Locked | Slate `#64748B` | 0.4 | None | None (static) | Subtle brighten |

### Dependencies on Previous Stories

- **Story 1.2:** `LocationDot.tsx` component with `isSelected` prop, `TaiwanMap.tsx` SVG structure
- **Story 3.1:** Lock icon already added to locked markers — this story polishes it

**Key modification:** This story upgrades `LocationDot.tsx` from static circles to animated Motion elements for unlocked markers, and polishes the lock icon rendering for locked markers.

### What This Story Does NOT Include

- No transition animations on LocationDetail or LockOverlay panels (Story 4.2)
- No audio-related changes
- No new components — only modifying existing LocationDot.tsx and TaiwanMap.tsx (for SVG filter defs)

### Project Structure After This Story

```
src/
├── components/
│   ├── TaiwanMap.tsx           # UPDATED — adds SVG <defs> with glow filter
│   ├── LocationDot.tsx         # UPDATED — motion.circle for unlocked, polished lock icon
│   ├── SoundscapePlayer.tsx    # From Story 2.1
│   ├── LocationDetail.tsx      # From Story 2.2
│   └── LockOverlay.tsx         # From Story 3.1
├── hooks/
│   └── useAudioPlayer.ts      # From Story 2.1
├── data/
│   └── locations.ts            # From Story 1.1/1.2
├── types/
│   └── index.ts                # From Story 1.1
├── App.tsx                     # Unchanged
├── index.css
└── main.tsx
```

### References

- [Source: _bmad-output/planning-artifacts/architecture.md#Frontend Architecture — Decision 2] — Motion animation directly on SVG elements
- [Source: _bmad-output/planning-artifacts/epics.md#Story 4.1] — Acceptance criteria
- [Source: _bmad-output/planning-artifacts/prd.md#Visual Experience] — FR18 (glow animation), FR19 (dimmed/muted + lock icon)
- [Source: _bmad-output/project-context.md#Motion (NOT Framer Motion)] — Package name, import path, SVG animation
- [Source: _bmad-output/project-context.md#Dark Theme] — Glow effects: warm amber/gold tones, locked opacity-40

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

No issues encountered. All 4 tasks completed in a single session with zero regressions.

### Completion Notes List

- Task 1: Imported `motion` from `"motion/react"`, replaced `<circle>` with `<motion.circle>` for unlocked markers, added continuous glow pulse animation (opacity 0.7-1.0, radius breathing), added SVG `<filter>` with `<feGaussianBlur>` for glow halo, amber fill `#F59E0B`, 2.5s cycle, pointer-events scoped to circle only
- Task 2: Verified locked markers already polished from Story 3.1 — SVG path lock icon (not emoji), dimmed slate `#64748B` at opacity 0.4, white lock icon at opacity 0.6. Added tests verifying SVG shapes and colors. Contrast with glowing unlocked markers is immediately obvious.
- Task 3: Added `whileHover={{ scale: 1.2 }}` on unlocked markers, converted locked markers to `motion.circle` with `whileHover={{ opacity: 0.6 }}` for subtle brightness increase. Smooth 0.2s transitions. No layout shifts.
- Task 4: Added `glow-strong` filter (stdDeviation=5 vs 3) for selected markers. Selected unlocked markers use `url(#glow-strong)` vs idle `url(#glow)`. Combined with larger radius (8 base, 8-10 pulse vs 6 base, 6-7.5 pulse), selected state is clearly distinguishable from idle unlocked.

### File List

- src/components/LocationDot.tsx (MODIFIED) — Motion glow pulse, hover effects, selected state filter
- src/components/TaiwanMap.tsx (MODIFIED) — SVG `<defs>` with glow and glow-strong filters
- tests/unit/LocationDot.test.tsx (MODIFIED) — Added 12 new tests for glow, hover, selected state, lock icon structure
- tests/unit/TaiwanMap.test.tsx (MODIFIED) — Added 5 new tests for glow filter definitions

## Change Log

- 2026-01-30: Implemented Story 4.1 — Location Marker Animations & Visual States. Added Motion glow pulse animation to unlocked markers, polished locked marker visuals, added hover interactions for both states, and implemented selected state visual distinction with stronger glow filter.
