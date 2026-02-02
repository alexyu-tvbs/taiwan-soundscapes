# Story 8.1: Product Story Page

Status: done

## Story

As a user (competition judge),
I want to read the product's vision, competitive positioning, and design philosophy,
So that I understand the depth of product thinking behind this prototype.

## Acceptance Criteria

1. **Given** the user is in the tabbed app (onboarding complete) **When** the user taps an info icon in the app header **Then** a `ProductStory` component slides up as a fullscreen overlay (FR43) **And** if MyJourneyPage exists (Epic 7), a link/button there also opens ProductStory

2. **Given** ProductStory is displayed **When** the user reads the content **Then** the page presents six content sections: product vision, competitive landscape, target audience, design philosophy, differentiation moat, and product roadmap (FR44)

3. **Given** ProductStory has content **When** the user scrolls through the page **Then** each section has a clear heading, readable body text (minimum 16px equivalent), and visual hierarchy distinguishing headings from body content (FR45) **And** the total content is completable in under 3 minutes of reading **And** the page uses Tailwind typography utilities consistent with the dark theme

4. **Given** the user is viewing ProductStory **When** the user taps the close/back button **Then** the overlay dismisses (slide-down animation) and the user returns to the previous view (FR46) **And** App.tsx sets `showProductStory = false`

5. **Given** ProductStory renders as an overlay **When** it is visible **Then** it renders above all tab content and TabBar (highest z-index) **And** the underlying tab state is preserved (no reset on close)

## Tasks / Subtasks

- [x] Task 1: Create ProductStory component (AC: #2, #3)
  - [x] 1.1 Create `src/components/ProductStory.tsx`
  - [x] 1.2 Props: `ProductStoryProps { onClose: () => void }`
  - [x] 1.3 Content sections (Traditional Chinese) — 6 sections with headings + body text:
    - **產品願景 (Product Vision):** "好眠秘境" transforms sleep improvement from a medical chore into a cultural journey. Users don't just "fix" their sleep — they explore Taiwan's most beautiful soundscapes as rewards for building better sleep habits.
    - **市場競爭分析 (Competitive Landscape):** White noise apps (Calm, Headspace) provide generic sounds. We differentiate with culturally-rooted Taiwan soundscapes, gamified collection mechanics, and a personalized sleep coaching system. No competitor combines all three.
    - **目標用戶 (Target Audience):** Young professionals (25-40) in Taiwan's urban centers experiencing stress-related sleep difficulties. They value self-improvement, appreciate local culture, and respond to gamification.
    - **設計哲學 (Design Philosophy):** Dark-first interface mirrors the nighttime use context. Warm amber accents invite interaction without harsh stimulation. Minimal controls reduce cognitive load before sleep.
    - **差異化護城河 (Differentiation Moat):** Taiwan-exclusive soundscapes create geographic and cultural uniqueness that global competitors cannot replicate. The sleep-to-unlock mechanic creates a behavioral flywheel: better sleep → more soundscapes → more motivation → better sleep.
    - **產品路線圖 (Product Roadmap):** Phase 1: Sound map prototype (done). Phase 2: Sleep coach concept (current). Phase 3: Real sleep tracking integration. Phase 4: Social features and community challenges.
  - [x] 1.4 Close button: "✕" or "關閉" at top-right, calls `onClose()`
  - [x] 1.5 Typography: headings `text-xl font-bold text-white`, body `text-base text-slate-300 leading-relaxed`, minimum 16px equivalent
  - [x] 1.6 Section spacing: `space-y-8` between sections, visual dividers optional

- [x] Task 2: Style ProductStory as fullscreen overlay (AC: #1, #4, #5)
  - [x] 2.1 Root element: `fixed inset-0 z-50 bg-slate-900 overflow-y-auto`
  - [x] 2.2 Content wrapper: `max-w-2xl mx-auto px-6 py-8` for readable line length
  - [x] 2.3 Entry animation: slide up from bottom using Motion
    ```tsx
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
    >
    ```
  - [x] 2.4 Wrap in `<AnimatePresence>` in App.tsx for exit animation

- [x] Task 3: Integrate ProductStory into App.tsx (AC: #1, #4, #5)
  - [x] 3.1 Render `<AnimatePresence>{showProductStory && <ProductStory onClose={() => setShowProductStory(false)} />}</AnimatePresence>`
  - [x] 3.2 Place AFTER all tab content, z-50 ensures it's above TabBar (z-40) and SoundscapePlayer (z-30)
  - [x] 3.3 Verify info icon in header (added in Story 5.1) triggers `setShowProductStory(true)`
  - [x] 3.4 Verify MyJourneyPage link (from Story 7.1) triggers `setShowProductStory(true)`
  - [x] 3.5 Verify closing overlay preserves tab state (activeTab, audio playback unaffected)

## Dev Notes

### Product Story Content Guidelines

All content should be in Traditional Chinese. The content represents a product pitch for a competition — it should be concise, compelling, and demonstrate deep product thinking. Keep each section to 2-4 sentences for under-3-minute reading time (FR45).

### Overlay Architecture (Decision 9)

ProductStory is a fullscreen overlay, NOT a tab. It renders on top of everything:

```
App.tsx render order:
  1. TabBar (z-40)
  2. SoundscapePlayer (z-30)
  3. Tab content (z-auto)
  4. ProductStory overlay (z-50) — above everything when visible
```

The overlay completely covers the screen with `fixed inset-0 bg-slate-900`. No transparency — solid background for reading comfort.

### Slide-Up Animation Pattern

```tsx
// In App.tsx:
<AnimatePresence>
  {showProductStory && (
    <ProductStory onClose={() => setShowProductStory(false)} />
  )}
</AnimatePresence>

// In ProductStory.tsx — root element is motion.div:
export const ProductStory = ({ onClose }: ProductStoryProps) => (
  <motion.div
    className="fixed inset-0 z-50 bg-slate-900 overflow-y-auto"
    initial={{ y: '100%' }}
    animate={{ y: 0 }}
    exit={{ y: '100%' }}
    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
  >
    <div className="max-w-2xl mx-auto px-6 py-8">
      <button onClick={onClose} className="...">✕</button>
      {/* Content sections */}
    </div>
  </motion.div>
);
```

### Entry Points (Two)

1. **Header info icon** — always visible when `onboardingComplete === true` (added in Story 5.1)
2. **MyJourneyPage link** — "了解更多產品故事 →" button (added in Story 7.1, wired to `onOpenProductStory`)

Both call `setShowProductStory(true)` in App.tsx.

### Critical Anti-Patterns

- **ProductStory does NOT manage its own visibility** — App.tsx controls `showProductStory` state
- **Closing does NOT reset tab state** — underlying activeTab and audio continue unaffected
- **Content is hardcoded in the component** — no external data file needed for 6 short paragraphs
- **No back navigation** — single close button, no internal routing

### Files to Create/Modify

| File | Action | Details |
|------|--------|---------|
| `src/components/ProductStory.tsx` | **Create** | Fullscreen overlay with 6 content sections |
| `src/App.tsx` | **Modify** | Add AnimatePresence + ProductStory render |

### Dependencies

- **Story 5.1:** `showProductStory` state and info icon in header
- **Story 7.1:** MyJourneyPage `onOpenProductStory` callback already wired

### What This Story Does NOT Include

- No dynamic content loading
- No images or media in ProductStory
- No navigation within ProductStory (single scrollable page)

### This Is the Final Story of Phase 2

After this story is complete, all Phase 2 stories (5.1, 5.2, 6.1, 7.1, 7.2, 8.1) are done. The prototype transforms from a "Taiwan sound map" into a "personalized sleep coach" with:
- Onboarding questionnaire → personalized sleep type
- Three-tab navigation (Tonight / Explore / My Journey)
- Tonight sleep prescription with cross-tab audio navigation
- Achievement tracking and collection progress
- Product Story pitch page

### Project Structure After This Story (Phase 2 Final)

```
src/
├── components/
│   ├── TaiwanMap.tsx            # Phase 1
│   ├── LocationDot.tsx          # Phase 1
│   ├── LocationDetail.tsx       # Phase 1
│   ├── SoundscapePlayer.tsx     # Phase 1
│   ├── LockOverlay.tsx          # Phase 1
│   ├── TabBar.tsx               # Story 5.1
│   ├── SleepAssessment.tsx      # Story 5.2
│   ├── TonightPage.tsx          # Story 6.1
│   ├── PrescriptionCard.tsx     # Story 6.1
│   ├── MyJourneyPage.tsx        # Story 7.1
│   ├── CollectionProgress.tsx   # Story 7.2
│   └── ProductStory.tsx         # Story 8.1 — THIS STORY
├── hooks/
│   └── useAudioPlayer.ts       # Phase 1
├── data/
│   ├── locations.ts             # Phase 1
│   └── sleep.ts                 # Story 5.2
├── types/
│   └── index.ts                 # Extended in Story 5.1
├── App.tsx                      # Updated across all stories
├── index.css
└── main.tsx
```

### References

- [Source: _bmad-output/planning-artifacts/architecture.md#Decision 9] — ProductStory as fullscreen overlay
- [Source: _bmad-output/planning-artifacts/architecture.md#Decision 11] — Product Story navigation entry points
- [Source: _bmad-output/planning-artifacts/epics.md#Story 8.1] — Acceptance criteria
- [Source: _bmad-output/planning-artifacts/prd.md#P2-7 Product Story Page] — FR43-FR46
- [Source: _bmad-output/project-context.md#Motion (NOT Framer Motion)] — Animation import
- [Source: _bmad-output/project-context.md#Dark Theme] — Styling patterns

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

- All 316 unit tests pass (17 test files)
- TypeScript compilation: 0 errors
- ESLint: 0 errors

### Completion Notes List

- Created ProductStory.tsx with 6 Traditional Chinese content sections (產品願景, 市場競爭分析, 目標用戶, 設計哲學, 差異化護城河, 產品路線圖)
- Implemented fullscreen overlay with `fixed inset-0 z-50 bg-slate-900 overflow-y-auto`
- Added Motion slide-up/slide-down animation with spring physics (damping: 25, stiffness: 200)
- Integrated into App.tsx with AnimatePresence wrapper after TabBar
- Removed `void showProductStory` placeholder — state now consumed by ProductStory render
- Verified two entry points: header info icon (Story 5.1) and MyJourneyPage link (Story 7.1)
- Close button dismisses overlay without affecting activeTab or audio playback state
- 20 new unit tests covering content sections, close button, typography, overlay styling, and content wrapper
- All 316 unit tests pass with 0 regressions

### Change Log

- 2026-02-02: Implemented Story 8.1 — ProductStory overlay component with 6 content sections, fullscreen overlay styling, Motion animations, and App.tsx integration
- 2026-02-02: Code Review fixes — Added Escape key handler for overlay dismissal, increased close button tap target with p-2 padding, refactored unit tests to use data-testid/structural assertions instead of fragile className checks, added E2E test file to File List

### File List

| File | Action |
|------|--------|
| `src/components/ProductStory.tsx` | Created |
| `src/App.tsx` | Modified (added import, AnimatePresence + ProductStory render, removed void placeholder) |
| `tests/unit/ProductStory.test.tsx` | Created (20 tests) |
| `tests/e2e/product-story.spec.ts` | Created (7 E2E tests) |
