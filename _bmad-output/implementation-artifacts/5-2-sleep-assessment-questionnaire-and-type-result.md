# Story 5.2: Sleep Assessment Questionnaire & Type Result

Status: done

## Story

As a user,
I want to answer a sleep assessment and discover my personalized sleep type,
So that I understand my sleep challenge and receive a tailored plan.

## Acceptance Criteria

1. **Given** the user opens the app for the first time (onboardingComplete = false) **When** the app loads **Then** a fullscreen `SleepAssessment` component is displayed (FR24) **And** no TabBar is visible

2. **Given** the SleepAssessment is displayed **When** the user sees the first question **Then** one question is shown at a time with a progress indicator (e.g., "1 / 5") (FR25) **And** each question offers 3-4 multiple-choice options (FR26) **And** the user must select one option to proceed to the next question

3. **Given** the user is on question 2 or later **When** the user wants to change a previous answer **Then** a back button allows navigating to the previous question (FR27) **And** the previously selected answer is preserved

4. **Given** the questionnaire uses data from `data/sleep.ts` **When** the developer inspects the data file **Then** `SleepQuestion[]` contains 5 questions with id, question text, and `SleepOption[]` per question **And** each `SleepOption` has label, value, and `weight: Partial<Record<SleepType, number>>` **And** questions and option text are in Traditional Chinese per PRD spec (Q1-Q5)

5. **Given** the user has answered all 5 questions **When** the system calculates the sleep type (FR28) **Then** weighted scores are summed per sleep type using a `reduce` over the answers array **And** the sleep type with the highest total score is selected

6. **Given** the sleep type is determined **When** the result page appears **Then** the user sees: type name (e.g., "入睡困難型"), brief description, recommended approach summary, and a "開始我的計畫" (Start My Plan) button (FR29) **And** the result is one of 3 possible types: 入睡困難型, 淺眠易醒型, 焦慮思緒型 (FR30)

7. **Given** the result page is displayed **When** the user taps "開始我的計畫" **Then** `onComplete(sleepType)` is called, App.tsx sets `onboardingComplete = true`, stores `sleepType`, and sets `activeTab = 'tonight'` (FR31) **And** the TabBar appears and the Tonight tab content is visible

8. **Given** the onboarding uses animations **When** the user navigates between questions **Then** questions transition with a horizontal slide animation (per Architecture animation patterns)

## Tasks / Subtasks

- [x] Task 1: Create `data/sleep.ts` with all Phase 2 static data (AC: #4, #5, #6)
  - [x] 1.1 Create `src/data/sleep.ts`
  - [x] 1.2 Add `sleepQuestions: SleepQuestion[]` — 5 questions in Traditional Chinese:
    - Q1: "你通常需要多久才能入睡？" (options: <15min, 15-30min, 30-60min, >60min)
    - Q2: "你半夜會醒來幾次？" (options: 幾乎不會, 1-2次, 3次以上)
    - Q3: "睡前你的腦袋通常在想什麼？" (options: 很快放空, 回想今天, 擔心明天, 各種想法停不下來)
    - Q4: "你早上醒來的感覺是？" (options: 精神飽滿, 還好但想賴床, 覺得沒睡夠, 比睡前更累)
    - Q5: "你覺得影響你睡眠最大的因素是？" (options: 環境(光線噪音), 身體不適, 心理壓力, 不規律作息)
  - [x] 1.3 Each option carries `weight: Partial<Record<SleepType, number>>` — weights bias toward specific sleep types
  - [x] 1.4 Add `sleepTypeInfos: Record<SleepType, SleepTypeInfo>` — 3 type definitions:
    - `difficulty`: name "入睡困難型", description + approach
    - `light`: name "淺眠易醒型", description + approach
    - `anxious`: name "焦慮思緒型", description + approach
  - [x] 1.5 Add `prescriptions: Record<SleepType, Prescription>` — 3 variants with planName, breathing, soundscapeLocationId, coachTip
  - [x] 1.6 Add `journeyStats: JourneyStats` — hardcoded values: completedSessions=12, longestStreak=5, unlockedSoundscapes=3
  - [x] 1.7 Add `calculateSleepType(answers: SleepOption[]): SleepType` function — reduce over answers, sum weights per type, return highest

- [x] Task 2: Create SleepAssessment component (AC: #1, #2, #3, #8)
  - [x] 2.1 Create `src/components/SleepAssessment.tsx` with `SleepAssessmentProps { onComplete: (sleepType: SleepType) => void }`
  - [x] 2.2 Internal state: `currentQuestionIndex` (number), `answers` (SleepOption[])
  - [x] 2.3 Render current question with progress: "第 {n} 題，共 5 題" or "{n} / 5"
  - [x] 2.4 Render option buttons — on select: store answer, auto-advance to next question
  - [x] 2.5 Back button (visible on question 2+): decrement `currentQuestionIndex`, preserve previous answers
  - [x] 2.6 Question transition: horizontal slide animation using `AnimatePresence`:
    - Forward: slide from right (`x: 100` → `x: 0`)
    - Backward: slide from left (`x: -100` → `x: 0`)
  - [x] 2.7 After question 5 answered: calculate sleep type via `calculateSleepType(answers)`
  - [x] 2.8 Show result screen: type name, description, approach, "開始我的計畫" button

- [x] Task 3: Render SleepTypeResult internal view (AC: #6, #7)
  - [x] 3.1 Within SleepAssessment, after all 5 answers: display result view
  - [x] 3.2 Show: sleep type name (大字), description paragraph, approach summary
  - [x] 3.3 "開始我的計畫" button: calls `onComplete(calculatedSleepType)`
  - [x] 3.4 Style: centered layout, dark theme, amber accent on CTA button

- [x] Task 4: Integrate SleepAssessment into App.tsx (AC: #1, #7)
  - [x] 4.1 Change `onboardingComplete` default to `false`
  - [x] 4.2 Change `sleepType` default to `null`
  - [x] 4.3 Render `<SleepAssessment onComplete={handleOnboardingComplete} />` when `!onboardingComplete`
  - [x] 4.4 `handleOnboardingComplete(type: SleepType)`: set `onboardingComplete=true`, `sleepType=type`, `activeTab='tonight'`
  - [x] 4.5 When `!onboardingComplete`: do NOT render TabBar (FR23)

## Dev Notes

### SleepAssessment Internal Architecture (Decision 9)

SleepAssessment manages its own internal state and only communicates the final result to App.tsx via `onComplete`. App.tsx does NOT know about question navigation, answers array, or calculation logic.

```
SleepAssessment (internal state: currentQuestionIndex, answers)
├── QuestionView (rendered for each question)
│   ├── Progress indicator
│   ├── Question text
│   ├── Option buttons
│   └── Back button (question 2+)
└── SleepTypeResult (rendered after question 5)
    ├── Type name + description
    └── "開始我的計畫" CTA
```

### Sleep Type Calculation (Decision 10)

Weighted scoring — each answer contributes weight points to sleep types. After 5 questions, sum all weights per type and select the highest.

```typescript
export const calculateSleepType = (answers: SleepOption[]): SleepType => {
  const scores = answers.reduce(
    (acc, answer) => {
      Object.entries(answer.weight).forEach(([type, w]) => {
        acc[type as SleepType] = (acc[type as SleepType] || 0) + (w || 0);
      });
      return acc;
    },
    {} as Record<SleepType, number>
  );

  return Object.entries(scores).reduce((best, [type, score]) =>
    score > (scores[best as SleepType] || 0) ? type as SleepType : best as SleepType
  , 'difficulty' as SleepType);
};
```

### Question Slide Animation Pattern

```tsx
// Track direction for animation
const [direction, setDirection] = useState(0); // 1 = forward, -1 = backward

<AnimatePresence mode="wait" custom={direction}>
  <motion.div
    key={currentQuestionIndex}
    custom={direction}
    initial={{ x: direction > 0 ? 100 : -100, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    exit={{ x: direction > 0 ? -100 : 100, opacity: 0 }}
    transition={{ duration: 0.25, ease: "easeInOut" }}
  >
    {/* Question content */}
  </motion.div>
</AnimatePresence>
```

### Questionnaire Content (PRD Reference)

All 5 questions and their options must be in Traditional Chinese. The weights determine which sleep type is most likely:

- **入睡困難型 (difficulty):** Takes long to fall asleep, irregular schedule
- **淺眠易醒型 (light):** Wakes frequently, light sleeper, body discomfort
- **焦慮思緒型 (anxious):** Racing thoughts, worry, mental stress

Design weights so each question contributes meaningfully but no single question determines the result.

### Prescription Data Structure

Each sleep type gets a unique prescription:

```typescript
const prescriptions: Record<SleepType, Prescription> = {
  difficulty: {
    sleepType: 'difficulty',
    planName: '入睡困難急救包',
    totalDays: 7,
    currentDay: 5,
    breathing: { name: '4-7-8 呼吸法', duration: '3 分鐘', expert: '江醫師引導' },
    soundscapeLocationId: 'tamsui',
    coachTip: '今天試著比昨天早 15 分鐘上床',
  },
  light: {
    sleepType: 'light',
    planName: '深層好眠計畫',
    totalDays: 10,
    currentDay: 3,
    breathing: { name: '腹式呼吸法', duration: '5 分鐘', expert: '林醫師引導' },
    soundscapeLocationId: 'alishan',
    coachTip: '睡前一小時調暗室內光線，幫助身體準備入睡',
  },
  anxious: {
    sleepType: 'anxious',
    planName: '安心入眠療程',
    totalDays: 14,
    currentDay: 7,
    breathing: { name: '正念呼吸法', duration: '4 分鐘', expert: '王心理師引導' },
    soundscapeLocationId: 'keelung',
    coachTip: '試著在睡前寫下三件今天感恩的事',
  },
};
```

### Critical Anti-Patterns

- **NO React Router** for question navigation — use internal state `currentQuestionIndex`
- **NO localStorage** to persist answers — page refresh resets (intentional)
- **NO Context** for sleep type — pass via `onComplete` callback to App.tsx
- **SleepAssessment does NOT import or know about TabBar**

### Existing Code Integration

- **App.tsx already has** `onboardingComplete` and `sleepType` state from Story 5.1
- Change defaults: `onboardingComplete: false`, `sleepType: null`
- Conditional rendering: `!onboardingComplete ? <SleepAssessment> : <TabBar + tabs>`
- This story builds on Story 5.1's tab infrastructure

### Files to Create/Modify

| File | Action | Details |
|------|--------|---------|
| `src/data/sleep.ts` | **Create** | Questions, type definitions, prescriptions, journey stats, calculateSleepType |
| `src/components/SleepAssessment.tsx` | **Create** | Fullscreen questionnaire + result page |
| `src/App.tsx` | **Modify** | Change defaults, add SleepAssessment render, handleOnboardingComplete |

### Dependencies

- **Story 5.1:** Tab infrastructure, Phase 2 types, TabBar component must exist
- **Types from 5.1:** SleepType, SleepQuestion, SleepOption, SleepTypeInfo, Prescription, JourneyStats

### What This Story Does NOT Include

- No TonightPage content (Epic 6) — Tonight tab still shows placeholder after onboarding
- No MyJourneyPage content (Epic 7)
- No actual interactive breathing exercises

### Project Structure After This Story

```
src/
├── components/
│   ├── TaiwanMap.tsx            # existing — unchanged
│   ├── LocationDot.tsx          # existing — unchanged
│   ├── LocationDetail.tsx       # existing — unchanged
│   ├── SoundscapePlayer.tsx     # existing — unchanged
│   ├── LockOverlay.tsx          # existing — unchanged
│   ├── TabBar.tsx               # from Story 5.1
│   └── SleepAssessment.tsx      # NEW — questionnaire + result
├── hooks/
│   └── useAudioPlayer.ts       # existing — unchanged
├── data/
│   ├── locations.ts             # existing — unchanged
│   └── sleep.ts                 # NEW — all Phase 2 data
├── types/
│   └── index.ts                 # extended in Story 5.1
├── App.tsx                      # MODIFIED — SleepAssessment integration, default changes
├── index.css
└── main.tsx
```

### References

- [Source: _bmad-output/planning-artifacts/architecture.md#Decision 9] — SleepAssessment internal architecture
- [Source: _bmad-output/planning-artifacts/architecture.md#Decision 10] — Sleep data model, weighted scoring
- [Source: _bmad-output/planning-artifacts/epics.md#Story 5.2] — Acceptance criteria, questionnaire details
- [Source: _bmad-output/planning-artifacts/prd.md#P2-2 Sleep Assessment Questionnaire] — Question content, FR24-FR31
- [Source: _bmad-output/project-context.md#Motion (NOT Framer Motion)] — Animation patterns
- [Source: _bmad-output/project-context.md#React Patterns] — Arrow function + named export

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

- No debug issues encountered.

### Completion Notes List

- Task 1: Created `src/data/sleep.ts` with 5 questions (Traditional Chinese), weighted options, 3 sleep type definitions, 3 prescriptions, journey stats, and `calculateSleepType` function. 20 unit tests.
- Task 2: Created `src/components/SleepAssessment.tsx` with internal state management (`currentQuestionIndex`, `answers`), progress indicator, option buttons with auto-advance, back navigation preserving answers, horizontal slide animation via `AnimatePresence`, and result screen. 19 unit tests.
- Task 3: Result view integrated within SleepAssessment — type name in large text (h1 text-4xl), description, approach, amber CTA button. Centered dark theme layout. 4 additional style tests.
- Task 4: Integrated into App.tsx — changed `onboardingComplete` default to `false`, `sleepType` to `null`, added `handleOnboardingComplete` callback, conditional SleepAssessment render, TabBar hidden during onboarding. Updated all 60+ existing App tests with `completeOnboarding` helper. 3 new onboarding integration tests.
- All 8 acceptance criteria verified and satisfied.
- All 227 unit tests pass. TypeScript and ESLint clean.

### Change Log

- 2026-02-01: Implemented Story 5.2 — Sleep Assessment Questionnaire & Type Result (all 4 tasks, 8 ACs)
- 2026-02-01: Code Review — Fixed 6 issues (3M/3L): initial animation bug, empty array guard, weight integration tests, deduplicated test helper

### File List

- `src/data/sleep.ts` — **Created** — Questions, type infos, prescriptions, journey stats, calculateSleepType
- `src/components/SleepAssessment.tsx` — **Created** — Fullscreen questionnaire + result component
- `src/App.tsx` — **Modified** — onboardingComplete=false, sleepType=null, SleepAssessment integration, handleOnboardingComplete
- `tests/unit/sleep.test.ts` — **Created** — 20 tests for data/sleep.ts
- `tests/unit/SleepAssessment.test.tsx` — **Created** — 19 tests for SleepAssessment component
- `tests/unit/App.test.tsx` — **Modified** — Added completeOnboarding helper, updated all tests, added 3 onboarding flow tests
