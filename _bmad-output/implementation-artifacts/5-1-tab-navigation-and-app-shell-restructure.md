# Story 5.1: Tab Navigation & App Shell Restructure

Status: ready-for-dev

## Story

As a user,
I want to navigate between Tonight, Explore, and My Journey tabs,
So that I can access different sections of the sleep coach app.

## Acceptance Criteria

1. **Given** Phase 1 is complete with fullscreen map experience **When** the app shell is restructured for Phase 2 **Then** App.tsx adds Phase 2 state: `activeTab` (Tab), `onboardingComplete` (boolean), `sleepType` (SleepType | null), `showProductStory` (boolean) **And** `types/index.ts` is extended with `Tab`, `SleepType`, `SleepQuestion`, `SleepOption`, `Prescription`, `JourneyStats` types

2. **Given** the user has completed onboarding (onboardingComplete = true) **When** the user views the app **Then** a bottom `TabBar` component is visible with three tabs: 今晚 (Tonight), 探索 (Explore), 我的 (My Journey) (FR21) **And** the active tab has a visual indicator distinguishing it from inactive tabs (FR22)

3. **Given** the TabBar is visible **When** the user taps a different tab **Then** the view switches to the selected tab's content using `AnimatePresence mode="wait"` (fade transition) **And** the Explore tab displays the existing Phase 1 map experience (TaiwanMap + LocationDot + LocationDetail + LockOverlay + SoundscapePlayer) **And** Tonight and My Journey tabs display placeholder content (to be replaced in Epics 6 and 7)

4. **Given** the user has NOT completed onboarding (onboardingComplete = false) **When** the user opens the app **Then** the TabBar is NOT visible (FR23) **And** the full screen is available for the onboarding flow (implemented in Story 5.2)

5. **Given** a soundscape is playing on the Explore tab **When** the TabBar is visible **Then** `SoundscapePlayer` is positioned at `bottom-16` (above TabBar) with `z-30` **And** TabBar is at `z-40`, always on top of the player

## Tasks / Subtasks

- [ ] Task 1: Extend TypeScript types for Phase 2 (AC: #1)
  - [ ] 1.1 Add to `types/index.ts`: `type Tab = 'tonight' | 'explore' | 'journey'`
  - [ ] 1.2 Add: `type SleepType = 'difficulty' | 'light' | 'anxious'`
  - [ ] 1.3 Add: `interface SleepQuestion { id: string; question: string; options: SleepOption[] }`
  - [ ] 1.4 Add: `interface SleepOption { label: string; value: string; weight: Partial<Record<SleepType, number>> }`
  - [ ] 1.5 Add: `interface SleepTypeInfo { type: SleepType; name: string; description: string; approach: string }`
  - [ ] 1.6 Add: `interface Prescription { sleepType: SleepType; planName: string; totalDays: number; currentDay: number; breathing: { name: string; duration: string; expert: string }; soundscapeLocationId: string; coachTip: string }`
  - [ ] 1.7 Add: `interface JourneyStats { completedSessions: number; longestStreak: number; unlockedSoundscapes: number; reinforcementMessage: string }`

- [ ] Task 2: Create TabBar component (AC: #2)
  - [ ] 2.1 Create `src/components/TabBar.tsx` with `TabBarProps { activeTab: Tab; onTabChange: (tab: Tab) => void }`
  - [ ] 2.2 Render 3 tabs: `{ id: 'tonight', label: '今晚', icon: '🌙' }`, `{ id: 'explore', label: '探索', icon: '🗺️' }`, `{ id: 'journey', label: '我的', icon: '📊' }`
  - [ ] 2.3 Style: `fixed bottom-0 left-0 right-0 z-40 bg-slate-800/95 backdrop-blur border-t border-slate-700`
  - [ ] 2.4 Active tab indicator: amber-400 text color and top border; inactive: slate-400 text
  - [ ] 2.5 Use flexbox with `justify-around` for even tab spacing

- [ ] Task 3: Restructure App.tsx with Phase 2 state and tab rendering (AC: #1, #3, #4)
  - [ ] 3.1 Add state: `const [activeTab, setActiveTab] = useState<Tab>('tonight')`
  - [ ] 3.2 Add state: `const [onboardingComplete, setOnboardingComplete] = useState(true)` (default true for now — Story 5.2 will add onboarding)
  - [ ] 3.3 Add state: `const [sleepType, setSleepType] = useState<SleepType | null>('difficulty')` (hardcoded default for now)
  - [ ] 3.4 Add state: `const [showProductStory, setShowProductStory] = useState(false)`
  - [ ] 3.5 Wrap Phase 1 map content inside `activeTab === 'explore'` conditional
  - [ ] 3.6 Add `AnimatePresence mode="wait"` around tab content with keyed `motion.div` for each tab
  - [ ] 3.7 Render `<TabBar>` when `onboardingComplete === true`
  - [ ] 3.8 Add placeholder `<div>` for Tonight tab: "今晚的處方 — Coming in Epic 6"
  - [ ] 3.9 Add placeholder `<div>` for My Journey tab: "我的旅程 — Coming in Epic 7"

- [ ] Task 4: Adjust SoundscapePlayer positioning for TabBar coexistence (AC: #5)
  - [ ] 4.1 When TabBar is visible (`onboardingComplete`), change SoundscapePlayer wrapper from `bottom-0` to `bottom-16`
  - [ ] 4.2 Set SoundscapePlayer wrapper z-index to `z-30`
  - [ ] 4.3 Verify player slides up above TabBar, TabBar remains on top

- [ ] Task 5: Add info icon for Product Story in header (AC: N/A — prep for Epic 8)
  - [ ] 5.1 Add a small info icon button (ℹ️) in the app header, visible when `onboardingComplete === true`
  - [ ] 5.2 On click: `setShowProductStory(true)` — ProductStory component added in Story 8.1

## Dev Notes

### Architecture Decision References

This story implements Architecture Decisions 7 (Navigation), 8 (State Management), and 9 (Component Architecture) from Phase 2.

**Navigation = Pure State Conditional Rendering (Decision 7):**
```
if !onboardingComplete → SleepAssessment (fullscreen, no TabBar)
if onboardingComplete → TabBar + active tab content
if showProductStory → ProductStory (fullscreen overlay, above everything)
```

**State Model (Decision 8):**
All state lives in App.tsx. No Context, no Redux, no Zustand. Prop drilling only. This is consistent with Phase 1 and appropriate for the 2-level component depth.

### Existing Code Patterns to Follow

- **Component pattern:** Arrow function + named export: `export const TabBar = ({ activeTab, onTabChange }: TabBarProps) => { ... }`
- **Props:** Separate `interface TabBarProps {}`, no `I` prefix
- **Motion import:** `import { motion, AnimatePresence } from "motion/react"` (NOT framer-motion)
- **Tailwind:** Utilities inline in JSX, no `@apply`
- **State updates:** Always `setState(prev => ...)` for immutable updates

### Tab Transition Animation Pattern

```tsx
<AnimatePresence mode="wait">
  <motion.div
    key={activeTab}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.2 }}
  >
    {activeTab === 'tonight' && <TonightPlaceholder />}
    {activeTab === 'explore' && <ExploreContent />}
    {activeTab === 'journey' && <JourneyPlaceholder />}
  </motion.div>
</AnimatePresence>
```

### SoundscapePlayer Positioning Update

**Current (Phase 1):** `fixed bottom-0` — player at screen bottom
**Phase 2:** `fixed bottom-16` — player sits above TabBar (h-16)

```tsx
<motion.div
  className={`fixed left-0 right-0 ${onboardingComplete ? 'bottom-16' : 'bottom-0'} z-30`}
>
  <SoundscapePlayer ... />
</motion.div>
```

TabBar: `z-40` (always on top), SoundscapePlayer: `z-30` (below TabBar)

### Critical Anti-Patterns

- **NO React Router** — tab switching is conditional rendering based on `activeTab` state
- **NO localStorage** for onboarding state — page refresh = reset (intentional for prototype)
- **NO Context API** — pass `sleepType`, `activeTab`, etc. as props
- **SoundscapePlayer must NOT know about TabBar** — positioning handled in App.tsx wrapper

### Temporary Defaults for This Story

Since SleepAssessment is implemented in Story 5.2:
- `onboardingComplete` starts as `true` (skip onboarding for now)
- `sleepType` starts as `'difficulty'` (hardcoded default)
- Story 5.2 will change default to `false` and add the assessment flow

### Files to Create/Modify

| File | Action | Details |
|------|--------|---------|
| `src/types/index.ts` | **Extend** | Add Tab, SleepType, SleepQuestion, SleepOption, SleepTypeInfo, Prescription, JourneyStats |
| `src/components/TabBar.tsx` | **Create** | Bottom tab navigation component |
| `src/App.tsx` | **Major update** | Add Phase 2 state, tab conditional rendering, AnimatePresence for tabs, TabBar render |
| `src/components/SoundscapePlayer.tsx` | **No change** | Positioning adjusted via wrapper in App.tsx, not inside the component |

### Dependencies on Previous Stories

- **Story 4.2:** AnimatePresence patterns already established in App.tsx — extend, don't duplicate
- **All Phase 1 stories:** Existing map experience (TaiwanMap, LocationDot, LocationDetail, LockOverlay, SoundscapePlayer) must work unchanged inside the Explore tab

### What This Story Does NOT Include

- No SleepAssessment component (Story 5.2)
- No TonightPage content (Epic 6)
- No MyJourneyPage content (Epic 7)
- No ProductStory content (Epic 8)
- No `data/sleep.ts` data file (Story 5.2)

### Project Structure After This Story

```
src/
├── components/
│   ├── TaiwanMap.tsx           # existing — unchanged
│   ├── LocationDot.tsx         # existing — unchanged
│   ├── LocationDetail.tsx      # existing — unchanged
│   ├── SoundscapePlayer.tsx    # existing — unchanged (positioning via App.tsx wrapper)
│   ├── LockOverlay.tsx         # existing — unchanged
│   └── TabBar.tsx              # NEW — bottom tab navigation
├── hooks/
│   └── useAudioPlayer.ts      # existing — unchanged
├── data/
│   └── locations.ts            # existing — unchanged
├── types/
│   └── index.ts                # EXTENDED — Phase 2 types added
├── App.tsx                     # MAJOR UPDATE — Phase 2 state, tab rendering, TabBar
├── index.css
└── main.tsx
```

### References

- [Source: _bmad-output/planning-artifacts/architecture.md#Decision 7: Navigation] — Pure state conditional rendering
- [Source: _bmad-output/planning-artifacts/architecture.md#Decision 8: State Management] — Extended prop drilling
- [Source: _bmad-output/planning-artifacts/architecture.md#Decision 9: Phase 2 Component Architecture] — Component tree, props
- [Source: _bmad-output/planning-artifacts/architecture.md#Decision 12: Existing Component Impact] — SoundscapePlayer positioning
- [Source: _bmad-output/planning-artifacts/epics.md#Story 5.1] — Acceptance criteria
- [Source: _bmad-output/project-context.md#React Patterns] — Component conventions, state owner pattern
- [Source: _bmad-output/project-context.md#Motion (NOT Framer Motion)] — Animation import path

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
