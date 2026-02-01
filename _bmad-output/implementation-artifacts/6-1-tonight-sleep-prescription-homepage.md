# Story 6.1: Tonight Sleep Prescription Homepage

Status: ready-for-dev

## Story

As a user,
I want to see my personalized sleep prescription for tonight,
So that I know exactly what breathing exercise and soundscape to use before bed.

## Acceptance Criteria

1. **Given** the user has completed onboarding with a determined sleep type **When** the user views the Tonight tab **Then** a `TonightPage` component displays with the user's personalized plan

2. **Given** TonightPage is displayed **When** the user views the top section **Then** a plan progress bar shows: plan name (e.g., "入睡困難急救包"), current day (e.g., "第 5 天"), total days (e.g., "共 7 天"), and a visual percentage indicator (FR32)

3. **Given** TonightPage is displayed **When** the user views the prescription cards **Then** a breathing exercise `PrescriptionCard` (type='breathing') displays: exercise name (e.g., "4-7-8 呼吸法"), duration (e.g., "3 分鐘"), and expert name (e.g., "江醫師引導") (FR33) **And** the breathing card is display-only — tapping shows a static info overlay, no interactive animation

4. **Given** TonightPage is displayed **When** the user views the soundscape prescription card **Then** a soundscape `PrescriptionCard` (type='soundscape') displays a recommended location from the map (e.g., "淡水河夕陽 · 舒緩水聲") (FR34)

5. **Given** the soundscape recommendation card is displayed **When** the user taps the soundscape card **Then** App.tsx executes: `setActiveTab('explore')`, `setSelectedLocationId(locationId)`, `audioPlayer.play(location.audioPath)` (FR35) **And** the Explore tab activates with the recommended location selected and audio playing

6. **Given** TonightPage is displayed **When** the user scrolls to the bottom **Then** a coach tip message is visible (e.g., "今天試著比昨天早 15 分鐘上床") (FR36)

7. **Given** the user's sleep type is one of 3 types **When** the prescription content is loaded from `data/sleep.ts` **Then** the plan name, breathing exercise, soundscape recommendation, and coach tip all vary based on the determined sleep type (FR37) **And** `data/sleep.ts` contains 3 complete `Prescription` variants — one per sleep type

## Tasks / Subtasks

- [ ] Task 1: Create PrescriptionCard component (AC: #3, #4)
  - [ ] 1.1 Create `src/components/PrescriptionCard.tsx`
  - [ ] 1.2 Props: `PrescriptionCardProps { type: 'breathing' | 'soundscape'; title: string; subtitle: string; detail: string; onTap?: () => void }`
  - [ ] 1.3 Breathing card: icon + exercise name + duration + expert, display-only style
  - [ ] 1.4 Soundscape card: icon + location name + description, tappable style with arrow/chevron indicator
  - [ ] 1.5 Style: `bg-slate-800 rounded-xl p-4` with subtle border, dark theme consistent
  - [ ] 1.6 Tappable cards: add `cursor-pointer hover:bg-slate-700/50` transition

- [ ] Task 2: Create TonightPage component (AC: #1, #2, #3, #4, #6)
  - [ ] 2.1 Create `src/components/TonightPage.tsx`
  - [ ] 2.2 Props: `TonightPageProps { sleepType: SleepType; onNavigateToLocation: (locationId: string) => void }`
  - [ ] 2.3 Load prescription data from `data/sleep.ts` based on `sleepType`
  - [ ] 2.4 Progress bar section: plan name, "第 {currentDay} 天 / 共 {totalDays} 天", visual progress bar (percentage fill with amber-400)
  - [ ] 2.5 Breathing PrescriptionCard: pass breathing data from prescription
  - [ ] 2.6 Soundscape PrescriptionCard: pass soundscape recommendation, `onTap={() => onNavigateToLocation(prescription.soundscapeLocationId)}`
  - [ ] 2.7 Coach tip at bottom: `prescription.coachTip` in styled quote/tip box
  - [ ] 2.8 Layout: vertical stack with gap, scrollable if needed, centered max-width container

- [ ] Task 3: Integrate TonightPage into App.tsx (AC: #1, #5)
  - [ ] 3.1 Replace Tonight placeholder with `<TonightPage sleepType={sleepType!} onNavigateToLocation={handleNavigateToLocation} />`
  - [ ] 3.2 Implement `handleNavigateToLocation(locationId: string)`:
    ```
    1. setActiveTab('explore')
    2. setSelectedLocationId(locationId)
    3. Find location in locations array
    4. audioPlayer.play(location.audioPath)
    ```
  - [ ] 3.3 Reuse existing `handleSelect` logic pattern from Phase 1
  - [ ] 3.4 Verify tab switch + auto-play works end-to-end

## Dev Notes

### Cross-Tab Navigation (Decision 11)

The critical interaction in this story is **Tonight → Explore auto-play (FR35)**:

```
User taps soundscape card on TonightPage
  → TonightPage calls onNavigateToLocation(locationId)
    → App.tsx handleNavigateToLocation:
      1. setActiveTab('explore')
      2. setSelectedLocationId(locationId)
      3. audioPlayer.play(locations.find(l => l.id === locationId)!.audioPath)
```

This reuses the existing `handleSelect` pattern from Phase 1. The only addition is `setActiveTab('explore')` before triggering selection.

### PrescriptionCard Design

Two card variants share the same component:

**Breathing Card (display-only):**
```
┌─────────────────────────────┐
│ 🫁  4-7-8 呼吸法              │
│    3 分鐘 · 江醫師引導         │
└─────────────────────────────┘
```

**Soundscape Card (tappable):**
```
┌─────────────────────────────┐
│ 🎵  淡水河夕陽 · 舒緩水聲    → │
│    點擊前往聆聽                 │
└─────────────────────────────┘
```

### Progress Bar

```
入睡困難急救包
第 5 天 / 共 7 天
[████████████░░░░░] 71%
```

Visual: `bg-slate-700` track, `bg-amber-400` fill, rounded corners.

### Prescription Data Access

```typescript
import { prescriptions } from '../data/sleep';
import { locations } from '../data/locations';

// In TonightPage:
const prescription = prescriptions[sleepType];
const recommendedLocation = locations.find(l => l.id === prescription.soundscapeLocationId);
```

All prescription data was created in Story 5.2's `data/sleep.ts`. This story only reads it.

### Critical Anti-Patterns

- **TonightPage does NOT directly control audio** — it delegates via `onNavigateToLocation` callback to App.tsx
- **TonightPage does NOT import useAudioPlayer** — only App.tsx manages audio
- **PrescriptionCard breathing variant has NO interactive behavior** — display only, no animated breathing guide
- **No hardcoded prescription data in components** — all data comes from `data/sleep.ts`

### Files to Create/Modify

| File | Action | Details |
|------|--------|---------|
| `src/components/PrescriptionCard.tsx` | **Create** | Reusable card for breathing/soundscape |
| `src/components/TonightPage.tsx` | **Create** | Tonight tab main content |
| `src/App.tsx` | **Modify** | Replace Tonight placeholder, add handleNavigateToLocation |

### Dependencies

- **Story 5.1:** Tab infrastructure, TabBar, Phase 2 state in App.tsx
- **Story 5.2:** `data/sleep.ts` with prescriptions, sleepType available in App.tsx state
- **Phase 1 audio:** `useAudioPlayer` and `locations.ts` for cross-tab navigation

### What This Story Does NOT Include

- No interactive breathing exercise animation (display card only)
- No audio playback within TonightPage (delegates to Explore tab)
- No real progress tracking (all values hardcoded)

### Project Structure After This Story

```
src/
├── components/
│   ├── TaiwanMap.tsx            # existing
│   ├── LocationDot.tsx          # existing
│   ├── LocationDetail.tsx       # existing
│   ├── SoundscapePlayer.tsx     # existing
│   ├── LockOverlay.tsx          # existing
│   ├── TabBar.tsx               # from Story 5.1
│   ├── SleepAssessment.tsx      # from Story 5.2
│   ├── TonightPage.tsx          # NEW
│   └── PrescriptionCard.tsx     # NEW
├── hooks/
│   └── useAudioPlayer.ts       # existing
├── data/
│   ├── locations.ts             # existing
│   └── sleep.ts                 # from Story 5.2
├── types/
│   └── index.ts                 # extended in Story 5.1
├── App.tsx                      # MODIFIED — TonightPage integration, handleNavigateToLocation
├── index.css
└── main.tsx
```

### References

- [Source: _bmad-output/planning-artifacts/architecture.md#Decision 11] — Cross-tab navigation flow
- [Source: _bmad-output/planning-artifacts/architecture.md#Decision 9] — TonightPage, PrescriptionCard props
- [Source: _bmad-output/planning-artifacts/epics.md#Story 6.1] — Acceptance criteria
- [Source: _bmad-output/planning-artifacts/prd.md#P2-4 Tonight Tab] — FR32-FR37
- [Source: _bmad-output/project-context.md#React Patterns] — Component conventions

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
