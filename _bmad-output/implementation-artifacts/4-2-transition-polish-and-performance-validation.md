# Story 4.2: Transition Polish & Performance Validation

Status: ready-for-dev

## Story

As a user,
I want smooth visual transitions when selecting locations and a fast, responsive experience,
So that the demo feels professional and fluid on stage.

## Acceptance Criteria

1. **Given** the user clicks a location (unlocked or locked) **When** the corresponding panel (LocationDetail or LockOverlay) appears **Then** the panel animates in with a smooth Motion transition (fade, slide, or scale) (FR20) **And** dismissing the panel also uses a smooth exit animation

2. **Given** the prototype is loaded in Chrome (latest) **When** the page loads on a standard broadband connection **Then** the map renders within 2 seconds (NFR1) **And** clicking an unlocked location starts audio within 500ms (NFR2) **And** SVG map hover and click interactions respond at 60fps with no visible lag (NFR3)

3. **Given** the user switches between locations **When** audio and visuals transition **Then** there is no audio glitching or visual stutter during the switch (NFR4) **And** scene photographs load within 1 second of selection (NFR5)

4. **Given** the prototype must work across browsers **When** the full experience is tested in Chrome (latest) and Safari (latest) **Then** all features function correctly in both browsers (NFR6, NFR7)

## Tasks / Subtasks

- [ ] Task 1: Add Motion transitions to LocationDetail panel (AC: #1)
  - [ ] 1.1 Import `motion` and `AnimatePresence` from `"motion/react"` in App.tsx
  - [ ] 1.2 Wrap LocationDetail render in `<AnimatePresence>` for enter/exit animations
  - [ ] 1.3 Convert LocationDetail root `<div>` to `<motion.div>` with transition props:
    - `initial`: `{ opacity: 0, x: 20 }` (start off-screen right, invisible)
    - `animate`: `{ opacity: 1, x: 0 }` (slide in, fade in)
    - `exit`: `{ opacity: 0, x: 20 }` (slide out, fade out)
    - `transition`: `{ duration: 0.3, ease: "easeOut" }`
  - [ ] 1.4 Add `key={selectedLocation.id}` to trigger re-animation when switching locations

- [ ] Task 2: Add Motion transitions to LockOverlay (AC: #1)
  - [ ] 2.1 Import `motion` in LockOverlay.tsx
  - [ ] 2.2 Wrap LockOverlay render in `<AnimatePresence>` in App.tsx
  - [ ] 2.3 Backdrop: `motion.div` with opacity fade `{ opacity: 0 }` → `{ opacity: 1 }`
  - [ ] 2.4 Modal panel: `motion.div` with scale + fade `{ opacity: 0, scale: 0.9 }` → `{ opacity: 1, scale: 1 }`
  - [ ] 2.5 Exit: reverse animations for smooth dismiss

- [ ] Task 3: Add transition to SoundscapePlayer (AC: #1)
  - [ ] 3.1 Wrap SoundscapePlayer in `<AnimatePresence>` in App.tsx
  - [ ] 3.2 Animate: slide up from bottom `{ y: 50, opacity: 0 }` → `{ y: 0, opacity: 1 }`
  - [ ] 3.3 Exit: slide back down

- [ ] Task 4: Performance validation — Page load (AC: #2)
  - [ ] 4.1 Run `npm run build` and verify production bundle size is reasonable (< 500KB total JS)
  - [ ] 4.2 Open built app in Chrome with DevTools Network tab — verify page renders within 2 seconds (NFR1)
  - [ ] 4.3 Check no unnecessary large dependencies in bundle
  - [ ] 4.4 Verify all local assets (audio, images) are served from public/ without 404s

- [ ] Task 5: Performance validation — Interaction responsiveness (AC: #2, #3)
  - [ ] 5.1 Click an unlocked location — verify audio starts within 500ms (NFR2)
  - [ ] 5.2 Hover and click map markers — verify 60fps responsiveness, no jank (NFR3)
  - [ ] 5.3 Switch between unlocked locations — verify no audio glitch or visual stutter (NFR4)
  - [ ] 5.4 Select a location — verify scene photo appears within 1 second (NFR5)
  - [ ] 5.5 Open Chrome DevTools Performance tab and record interaction — check for dropped frames

- [ ] Task 6: Browser compatibility validation (AC: #4)
  - [ ] 6.1 Test full flow in Chrome (latest): map load → click unlocked → audio + photo → switch → click locked → overlay → dismiss
  - [ ] 6.2 Test full flow in Safari (latest): same flow as Chrome
  - [ ] 6.3 Verify Motion animations render correctly in both browsers
  - [ ] 6.4 Verify audio play/pause/volume works in both browsers
  - [ ] 6.5 Verify SVG map and glow filters render correctly in both browsers
  - [ ] 6.6 Fix any browser-specific issues found

## Dev Notes

### Motion Transitions — AnimatePresence Pattern

**CRITICAL:** `AnimatePresence` is required for exit animations. Without it, components unmount immediately without transition.

```tsx
import { motion, AnimatePresence } from "motion/react";

// In App.tsx render:
<AnimatePresence mode="wait">
  {isUnlockedSelection && selectedLocation && (
    <motion.div
      key={selectedLocation.id}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <LocationDetail
        location={selectedLocation}
        isPlaying={audioPlayer.isPlaying}
      />
    </motion.div>
  )}
</AnimatePresence>
```

**Key pattern:** The `motion.div` wrapper goes in App.tsx around the conditional render. The child components (LocationDetail, LockOverlay, SoundscapePlayer) do NOT need to know about animations — they remain pure presentational components.

### LockOverlay Transition Pattern

```tsx
<AnimatePresence>
  {lockedLocation && (
    <LockOverlay location={lockedLocation} onClose={() => setLockedLocation(null)} />
  )}
</AnimatePresence>

// Inside LockOverlay.tsx — update root elements:
export const LockOverlay = ({ location, onClose }: LockOverlayProps) => {
  return (
    <motion.div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-slate-800 rounded-2xl p-8 max-w-sm text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.25 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* content */}
      </motion.div>
    </motion.div>
  );
};
```

### SoundscapePlayer Transition Pattern

```tsx
<AnimatePresence>
  {isUnlockedSelection && selectedLocation && (
    <motion.div
      key="player"
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 50, opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <SoundscapePlayer ... />
    </motion.div>
  )}
</AnimatePresence>
```

### Performance Validation Checklist

**NFR1 — Page load < 2s:**
- Vite production build with tree-shaking keeps bundle small
- Local assets in public/ served directly — no network dependency
- SVG map is inline (no external fetch)
- Target: < 500KB total JS, < 200KB gzipped

**NFR2 — Audio start < 500ms:**
- HTML5 Audio with local mp3 files loads near-instantly
- No network fetch delay for local assets
- `.play()` is called on user click — browser allows it

**NFR3 — 60fps SVG interactions:**
- Motion animations are GPU-accelerated (transform/opacity)
- SVG filter glow is cached after first render
- Only 3 animated markers — minimal GPU load

**NFR4 — No audio glitch on switch:**
- Single HTMLAudioElement: stop → set src → play (sequential)
- No crossfade = no overlap = no glitch

**NFR5 — Photo load < 1s:**
- Local jpg files in public/ — effectively instant
- Images can be lazy-loaded but with 3 photos it's unnecessary

**NFR6/NFR7 — Chrome + Safari:**
- All APIs used (HTML5 Audio, SVG, CSS backdrop-blur) are supported in both browsers
- Motion library supports both browsers
- Tailwind CSS generates standard CSS — no browser-specific issues
- Potential Safari issue: `backdrop-blur` may need `-webkit-backdrop-filter` — Tailwind handles this

### Safari-Specific Considerations

- **Audio autoplay:** Click-triggered play works in Safari. No autoplay-on-load needed.
- **SVG filters:** `feGaussianBlur` is supported. Test glow rendering.
- **backdrop-blur:** Tailwind's `backdrop-blur` compiles to both `-webkit-backdrop-filter` and `backdrop-filter`.
- **Motion:** Library handles Safari WebKit animation differences internally.

### Dependencies on Previous Stories

- **Story 1.2:** TaiwanMap + LocationDot — SVG map structure
- **Story 2.1:** useAudioPlayer + SoundscapePlayer — audio playback
- **Story 2.2:** LocationDetail — scene photo panel
- **Story 3.1:** LockOverlay — locked location modal
- **Story 4.1:** Glow animations on LocationDot — already using Motion

**Key modifications:** This story wraps existing components with `AnimatePresence` + `motion.div` in App.tsx, and updates LockOverlay.tsx to use `motion.div` for its backdrop and panel. The validation tasks are testing the complete integrated experience.

### What This Story Does NOT Include

- No new features — this is polish and validation only
- No new components
- No audio changes
- No data changes

### This Is the Final Story

After this story is complete, all 7 stories across 4 epics are done. The prototype should be presentation-ready for the "好眠服務 Prototype 提案大賽" competition demo.

### Project Structure After This Story (Final)

```
src/
├── components/
│   ├── TaiwanMap.tsx           # From Story 1.2 + 4.1 (SVG filter defs)
│   ├── LocationDot.tsx         # From Story 1.2 + 3.1 + 4.1 (motion + glow + lock icon)
│   ├── SoundscapePlayer.tsx    # From Story 2.1
│   ├── LocationDetail.tsx      # From Story 2.2
│   └── LockOverlay.tsx         # From Story 3.1, UPDATED — motion.div for transitions
├── hooks/
│   └── useAudioPlayer.ts      # From Story 2.1
├── data/
│   └── locations.ts            # From Story 1.1/1.2
├── types/
│   └── index.ts                # From Story 1.1
├── App.tsx                     # UPDATED — AnimatePresence wrappers for all panels
├── index.css
└── main.tsx

public/
├── audio/
│   ├── tamsui.mp3
│   ├── alishan.mp3
│   └── keelung.mp3
└── images/
    ├── tamsui.jpg
    ├── alishan.jpg
    └── keelung.jpg
```

### References

- [Source: _bmad-output/planning-artifacts/architecture.md#Frontend Architecture] — Component boundaries, data flow
- [Source: _bmad-output/planning-artifacts/epics.md#Story 4.2] — Acceptance criteria, NFR validation
- [Source: _bmad-output/planning-artifacts/prd.md#Visual Experience] — FR20 (smooth transitions)
- [Source: _bmad-output/planning-artifacts/prd.md#Non-Functional Requirements] — NFR1-NFR7
- [Source: _bmad-output/project-context.md#Motion (NOT Framer Motion)] — Import path, AnimatePresence usage
- [Source: _bmad-output/project-context.md#Critical Don't-Miss Rules] — Chrome primary, Safari secondary

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
