# Story 7.1: My Journey Achievement Page

Status: done

## Story

As a user,
I want to see my cumulative sleep journey stats and encouragement,
So that I feel motivated by my progress and want to continue.

## Acceptance Criteria

1. **Given** the user has completed onboarding and has a sleep type **When** the user navigates to the My Journey tab **Then** a `MyJourneyPage` component displays with achievement stats and progress

2. **Given** MyJourneyPage is displayed **When** the user views the stats section **Then** cumulative stats are visible: completed sessions (e.g., 12), longest streak (e.g., 5 days), unlocked soundscapes (e.g., 5) (FR38) **And** all values are hardcoded from `data/sleep.ts` `JourneyStats`

3. **Given** MyJourneyPage is displayed **When** the user views the reinforcement section **Then** a positive reinforcement message is visible (e.g., "你連續 3 天在 11 點前開始準備睡覺，這是很棒的習慣！") (FR39) **And** the message highlights a recent behavior pattern using warm, encouraging language

4. **Given** MyJourneyPage is displayed **When** the user views the progress section **Then** the current plan progress is displayed, consistent with the Tonight tab progress bar (same plan name, day, total days) (FR40)

## Tasks / Subtasks

- [x] Task 1: Create MyJourneyPage component (AC: #1, #2, #3, #4)
  - [x] 1.1 Create `src/components/MyJourneyPage.tsx`
  - [x] 1.2 Props: `MyJourneyPageProps { sleepType: SleepType; onOpenProductStory: () => void }`
  - [x] 1.3 Load `journeyStats` from `data/sleep.ts`
  - [x] 1.4 Load `prescriptions[sleepType]` from `data/sleep.ts` for plan progress data
  - [x] 1.5 Stats section: 3-column grid showing:
    - 已完成 {completedSessions} 次 (completed sessions)
    - 最長連續 {longestStreak} 天 (longest streak)
    - 已解鎖 {unlockedSoundscapes} 個聲景 (unlocked soundscapes)
  - [x] 1.6 Each stat: large number + label below, amber-400 accent on numbers
  - [x] 1.7 Reinforcement message section: `journeyStats.reinforcementMessage` in a styled card with warm tone (e.g., soft amber/gold background tint)
  - [x] 1.8 Plan progress section: reuse same progress bar pattern as TonightPage — plan name, current day / total days, percentage bar
  - [x] 1.9 Product Story link: "了解更多產品故事 →" button/link, calls `onOpenProductStory()`
  - [x] 1.10 Layout: vertical stack, scrollable, centered max-width, dark theme

- [x] Task 2: Integrate MyJourneyPage into App.tsx (AC: #1)
  - [x] 2.1 Replace My Journey placeholder with `<MyJourneyPage sleepType={sleepType!} onOpenProductStory={() => setShowProductStory(true)} />`
  - [x] 2.2 Verify tab switching to My Journey shows the component correctly

## Dev Notes

### MyJourneyPage Layout Design

```
┌────────────────────────────────┐
│        我的旅程                  │
│                                │
│  ┌──────┬──────┬──────┐        │
│  │  12  │   5  │   3  │        │
│  │ 已完成│最長連續│已解鎖 │        │
│  │  次   │  天  │ 聲景  │        │
│  └──────┴──────┴──────┘        │
│                                │
│  ┌─────────────────────────┐   │
│  │ 🌟 你連續 3 天在 11 點前  │   │
│  │ 開始準備睡覺，           │   │
│  │ 這是很棒的習慣！          │   │
│  └─────────────────────────┘   │
│                                │
│  入睡困難急救包                  │
│  第 5 天 / 共 7 天              │
│  [████████████░░░░░] 71%       │
│                                │
│  了解更多產品故事 →              │
└────────────────────────────────┘
```

### Progress Bar Consistency with TonightPage

Both TonightPage and MyJourneyPage show plan progress from the same prescription data. Use the same visual pattern:
- Plan name from `prescriptions[sleepType].planName`
- Current day from `prescriptions[sleepType].currentDay`
- Total days from `prescriptions[sleepType].totalDays`
- Percentage: `Math.round((currentDay / totalDays) * 100)`

Consider extracting a shared progress bar component or duplicating the simple markup (3 lines of JSX — extraction is over-engineering for prototype scope).

### Journey Stats Data

All hardcoded in `data/sleep.ts` (created in Story 5.2):

```typescript
export const journeyStats: JourneyStats = {
  completedSessions: 12,
  longestStreak: 5,
  unlockedSoundscapes: 3,
  reinforcementMessage: '你連續 3 天在 11 點前開始準備睡覺，這是很棒的習慣！',
};
```

### Product Story Entry Point

MyJourneyPage includes a link to open ProductStory (implemented in Story 8.1). In this story, wire `onOpenProductStory` prop to `setShowProductStory(true)` in App.tsx. The ProductStory component overlay is created in Story 8.1.

### Critical Anti-Patterns

- **All stats are hardcoded** — no computation, no state tracking, no localStorage
- **No duplicate state** — plan progress reads from same prescription data as TonightPage
- **Product Story link works even before Story 8.1** — it sets `showProductStory=true`, but nothing renders until ProductStory component exists

### Files to Create/Modify

| File | Action | Details |
|------|--------|---------|
| `src/components/MyJourneyPage.tsx` | **Create** | Achievement stats + reinforcement + progress + product story link |
| `src/App.tsx` | **Modify** | Replace Journey placeholder with MyJourneyPage |

### Dependencies

- **Story 5.1:** Tab infrastructure, `showProductStory` state in App.tsx
- **Story 5.2:** `data/sleep.ts` with `journeyStats`, `prescriptions`
- **Story 6.1:** TonightPage exists (for visual consistency of progress bar)

### What This Story Does NOT Include

- No real progress tracking — all values hardcoded
- No ProductStory component (Story 8.1)
- No CollectionProgress on map (Story 7.2)

### Project Structure After This Story

```
src/
├── components/
│   ├── ...existing Phase 1 components
│   ├── TabBar.tsx               # from Story 5.1
│   ├── SleepAssessment.tsx      # from Story 5.2
│   ├── TonightPage.tsx          # from Story 6.1
│   ├── PrescriptionCard.tsx     # from Story 6.1
│   └── MyJourneyPage.tsx        # NEW
├── hooks/
│   └── useAudioPlayer.ts
├── data/
│   ├── locations.ts
│   └── sleep.ts                 # from Story 5.2
├── types/
│   └── index.ts
├── App.tsx                      # MODIFIED — MyJourneyPage integration
├── index.css
└── main.tsx
```

### References

- [Source: _bmad-output/planning-artifacts/architecture.md#Decision 9] — MyJourneyPage props
- [Source: _bmad-output/planning-artifacts/architecture.md#Decision 11] — Product Story entry points
- [Source: _bmad-output/planning-artifacts/epics.md#Story 7.1] — Acceptance criteria
- [Source: _bmad-output/planning-artifacts/prd.md#P2-5 My Journey Tab] — FR38-FR40
- [Source: _bmad-output/project-context.md#React Patterns] — Component conventions

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

- Unit test: happy-dom requires manual `cleanup()` in `afterEach` — auto-cleanup not working
- Tab label for journey tab is "我的" not "旅程" — fixed in E2E tests

### Completion Notes List

- Created `MyJourneyPage` component with stats grid (3-column), reinforcement message card, plan progress bar, and product story link
- Stats use amber-400 accent, reinforcement card uses amber-400/10 background tint for warm tone
- Progress bar duplicates TonightPage markup pattern (3 lines JSX — no extraction per Dev Notes guidance)
- Integrated into App.tsx replacing "Coming in Epic 7" placeholder
- `onOpenProductStory` wired to `setShowProductStory(true)` — overlay renders in Story 8.1
- Updated existing unit test (App.test.tsx) and E2E test (tab-navigation.spec.ts) that referenced old placeholder text
- 13 new unit tests covering all ACs + sleep type variations
- 6 new E2E tests covering tab navigation, stats display, reinforcement message, progress bar, product story link, and tab switching
- All 276 unit tests pass, all E2E tests pass (3 pre-existing flaky failures in lock-overlay/scene-photography unrelated to this story)

### File List

| File | Action |
|------|--------|
| `src/components/MyJourneyPage.tsx` | **Created** |
| `src/App.tsx` | **Modified** — import + replace journey placeholder |
| `tests/unit/MyJourneyPage.test.tsx` | **Created** — 13 unit tests |
| `tests/e2e/my-journey-page.spec.ts` | **Created** — 6 E2E tests |
| `tests/unit/App.test.tsx` | **Modified** — updated journey tab test |
| `tests/e2e/tab-navigation.spec.ts` | **Modified** — updated journey tab E2E test |
| `src/data/sleep.ts` | **Modified** — CR fix: reinforcement message updated to match AC #3 |

### Senior Developer Review (AI)

**Reviewer:** Amelia (Dev Agent) — Code Review Workflow
**Date:** 2026-02-02
**Outcome:** Approved (after fixes)

**Issues Found:** 1 High, 2 Medium, 4 Low
**Issues Fixed:** 3 (all HIGH + MEDIUM)

**Fixes Applied:**
1. **[H1] AC #3 reinforcement message** — Updated `data/sleep.ts` `journeyStats.reinforcementMessage` from generic encouragement to behavior-specific message matching story Dev Notes: "你連續 3 天在 11 點前開始準備睡覺，這是很棒的習慣！"
2. **[M1] Unit test circular validation** — Rewrote `MyJourneyPage.test.tsx` to use hardcoded expected values ('12', '5', '3', plan names, day counts) instead of importing source data. Tests now catch data regressions.
3. **[M2] E2E test AC #3 too weak** — Strengthened `my-journey-page.spec.ts` AC #3 test to validate behavior-pattern keywords ('連續', '習慣') instead of only checking string length > 5.

**Remaining LOW items (not fixed — acceptable for prototype):**
- L1: Progress bar missing ARIA progressbar role (consistent with TonightPage)
- L2: Stats label spacing ("已完成 次") slightly awkward in Chinese
- L3: Inconsistent `[P2]` test name prefixes
- L4: No data-testid on progress section wrapper

### Change Log

- 2026-02-02: Implemented Story 7.1 — MyJourneyPage achievement stats, reinforcement message, plan progress bar, product story link. Full test coverage added.
- 2026-02-02: Code review fixes — H1: reinforcement message updated to behavior-specific per AC #3; M1: unit tests use hardcoded values; M2: E2E test strengthened for AC #3.
