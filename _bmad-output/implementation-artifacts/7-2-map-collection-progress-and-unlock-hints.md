# Story 7.2: Map Collection Progress & Unlock Hints

Status: review

## Story

As a user,
I want to see my soundscape collection progress and know how to unlock more,
So that I understand the connection between my sleep plan and collecting Taiwan's sounds.

## Acceptance Criteria

1. **Given** the user is on the Explore tab with the map visible **When** the map area loads **Then** a `CollectionProgress` component is displayed above the map showing "已收集 3/10 個台灣聲景" (FR41) **And** the count reflects the number of unlocked locations (3) out of total locations (10)

2. **Given** the CollectionProgress is visible **When** the user reads the hint text below the count **Then** a hint message links a locked location to the sleep plan (e.g., "完成「入睡困難急救包」即可解鎖：台東稻田") (FR42) **And** the hint text varies based on the user's sleep type (referencing the active plan name from `data/sleep.ts`)

## Tasks / Subtasks

- [x] Task 1: Create CollectionProgress component (AC: #1, #2)
  - [x] 1.1 Create `src/components/CollectionProgress.tsx`
  - [x] 1.2 Props: `CollectionProgressProps { unlockedCount: number; totalCount: number; hintText: string }`
  - [x] 1.3 Render collection count: "已收集 {unlockedCount}/{totalCount} 個台灣聲景"
  - [x] 1.4 Render hint text below count: the `hintText` prop
  - [x] 1.5 Style: centered text above map, subtle styling (e.g., `text-slate-300 text-sm`) so it doesn't compete with the map
  - [x] 1.6 Optional: small visual progress dots or bar showing 3/10

- [x] Task 2: Integrate CollectionProgress into Explore tab (AC: #1, #2)
  - [x] 2.1 In App.tsx, within the `activeTab === 'explore'` section, render `<CollectionProgress>` above the map area
  - [x] 2.2 Compute `unlockedCount`: `locations.filter(l => l.status === 'unlocked').length`
  - [x] 2.3 Compute `totalCount`: `locations.length`
  - [x] 2.4 Compute `hintText` based on `sleepType`:
    - Get `prescriptions[sleepType].planName` (e.g., "入睡困難急救包")
    - Pick a locked location name (e.g., "台東稻浪")
    - Format: `完成「${planName}」即可解鎖：${lockedLocationName}`
  - [x] 2.5 Only render CollectionProgress when `onboardingComplete` is true (otherwise user hasn't seen onboarding yet)

## Dev Notes

### CollectionProgress Design

```
┌────────────────────────────────┐
│  已收集 3/10 個台灣聲景          │
│  完成「入睡困難急救包」即可解鎖：台東稻浪 │
└────────────────────────────────┘
          ┌─────────────┐
          │  Taiwan Map  │
          │   (SVG)      │
          └─────────────┘
```

Simple text display above the map. Not a heavy component.

### Hint Text Generation

```typescript
const getHintText = (sleepType: SleepType): string => {
  const planName = prescriptions[sleepType].planName;
  // Pick a specific locked location to feature in the hint
  const hintLocations: Record<SleepType, string> = {
    difficulty: '台東稻浪',
    light: '日月潭晨曦',
    anxious: '蘭嶼飛魚季',
  };
  return `完成「${planName}」即可解鎖：${hintLocations[sleepType]}`;
};
```

Each sleep type hints at a different locked location, creating variety.

### Positioning in Explore Tab

CollectionProgress sits above the map in the existing layout. It should be part of the explore tab content flow, not a fixed overlay. If the current layout has the header + map + detail panel, CollectionProgress goes between the header/title and the map area.

### Critical Anti-Patterns

- **CollectionProgress is purely presentational** — receives computed props, no internal state
- **Count is derived from data** — `locations.filter(l => l.status === 'unlocked').length`, not hardcoded
- **Hint text varies by sleep type** — not static
- **Only show when onboarding is complete** — before onboarding, the Explore tab is the full Phase 1 experience

### Files to Create/Modify

| File | Action | Details |
|------|--------|---------|
| `src/components/CollectionProgress.tsx` | **Create** | Collection count + unlock hint |
| `src/App.tsx` | **Modify** | Add CollectionProgress to Explore tab section |

### Dependencies

- **Story 5.1:** Tab infrastructure, Explore tab rendering
- **Story 5.2:** `data/sleep.ts` with `prescriptions` for hint text generation
- **Phase 1:** `data/locations.ts` for location count and names

### What This Story Does NOT Include

- No real unlock tracking (count is always 3, matching static location data)
- No interactive unlock animations
- No click-through from hint to locked location

### References

- [Source: _bmad-output/planning-artifacts/architecture.md#Decision 9] — CollectionProgress props
- [Source: _bmad-output/planning-artifacts/epics.md#Story 7.2] — Acceptance criteria
- [Source: _bmad-output/planning-artifacts/prd.md#P2-6 Explore Tab Enhancements] — FR41, FR42
- [Source: _bmad-output/project-context.md#React Patterns] — Component conventions

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

No issues encountered during implementation.

### Completion Notes List

- Created `CollectionProgress` component as a purely presentational component with `unlockedCount`, `totalCount`, and `hintText` props
- Component renders collection count text ("已收集 X/Y 個台灣聲景"), progress dots (amber for unlocked, slate for locked), and hint text
- Integrated into `App.tsx` Explore tab section, positioned above the map area
- `unlockedCount` derived from `locations.filter(l => l.status === 'unlocked').length`
- `totalCount` derived from `locations.length`
- `hintText` computed from `prescriptions[sleepType].planName` with sleep-type-specific locked location names
- CollectionProgress only renders on Explore tab (within `activeTab === 'explore'` conditional), which inherently requires `onboardingComplete === true`
- 10 unit tests for CollectionProgress component covering count display, hint text, styling, and progress dots
- 7 integration tests in App.test.tsx covering render on Explore tab, correct count, hint text variation, absence on other tabs, DOM ordering, and progress dots
- Full test suite: 296/296 tests pass, 0 regressions
- TypeScript strict mode: 0 errors

### File List

| File | Action |
|------|--------|
| `src/components/CollectionProgress.tsx` | Created |
| `src/App.tsx` | Modified |
| `tests/unit/CollectionProgress.test.tsx` | Created |
| `tests/unit/App.test.tsx` | Modified |

## Change Log

- 2026-02-02: Implemented Story 7.2 — CollectionProgress component with collection count, progress dots, and sleep-type-specific unlock hints. Integrated into Explore tab above the map. 17 tests added.
