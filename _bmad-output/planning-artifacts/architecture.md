---
stepsCompleted:
  - 1
  - 2
  - 3
  - 4
  - 5
  - 6
  - 7
  - 8
inputDocuments:
  - _bmad-output/planning-artifacts/prd.md
workflowType: 'architecture'
project_name: 'taiwan-soundscapes'
user_name: 'Alex Yu'
date: '2026-01-30'
lastStep: 8
status: 'complete'
completedAt: '2026-01-30'
phase2UpdatedAt: '2026-02-01'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we
work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:** 20 FRs across 5 categories — Map Exploration (5), Soundscape Playback (5), Unlock System (3), Location Content (3), Visual Experience (4). All requirements are frontend-only with zero backend dependencies. The core interaction model is: SVG map → location selection → audio playback + scene imagery.

**Non-Functional Requirements:** 7 NFRs focused on perceived performance (2s page load, 500ms audio start, 60fps SVG interactions) and browser compatibility (Chrome + Safari latest). No security, compliance, or scalability NFRs — appropriate for a competition prototype.

**Scale & Complexity:** Low

- Primary domain: Web Frontend (SPA)
- Complexity level: Low (single-page prototype, no backend, no persistence)
- Estimated architectural components: 6 React components + audio management + SVG map system

### Technical Constraints & Dependencies

- **One-person team + AI tools, one-week timeline** — architecture must minimize setup overhead and maximize productivity
- **PRD prescribes tech stack:** React + Vite + Tailwind CSS + Framer Motion — architecture should validate and refine, not replace
- **Custom SVG map** (not Mapbox/Leaflet) — visual impact prioritized over geographic accuracy
- **Mixed audio sources:** HTML5 Audio API for local files + optional YouTube IFrame API embeds — architecture must abstract audio source differences
- **Static deployment** (Vercel/Netlify) — no server-side rendering, no server functions needed
- **No persistence** — prototype resets on refresh, React state only (useState/useContext)
- **Free/placeholder assets** — architecture should make asset swapping straightforward for future production

### Cross-Cutting Concerns Identified

- **Audio State Management:** Play/pause/volume state must synchronize across map selection, player controls, and location switching (stop previous → start new). Single audio context needed.
- **Location Data Model:** Each location carries multiple states (unlocked/locked, selected/unselected, playing/paused) plus associated assets (audio source, photo, name, unlock condition). A unified data model prevents inconsistency.
- **SVG Coordinate System:** Location markers need precise positioning on the Taiwan map SVG. The coordinate system must be maintainable and allow easy addition of new locations.
- **Visual State Synchronization:** Map dot glow/dim states, player UI, and location detail panel must all reflect the same underlying state without drift.
- **Audio Source Abstraction:** YouTube embeds and direct audio files have different APIs — an abstraction layer prevents source-specific logic from leaking into UI components.

## Starter Template Evaluation

### Primary Technology Domain

Web Frontend SPA — based on PRD-specified React + Vite stack for a single-page interactive prototype.

### Starter Options Considered

**Option A: Official Vite `react-ts` template (Selected)**
- Minimal, official, well-maintained
- Tailwind CSS v4 setup requires only `@tailwindcss/vite` plugin (no config file needed)
- Full control over dependencies with zero unnecessary boilerplate

**Option B: Community Vite + React + Tailwind starters**
- Pre-integrated Tailwind, but likely v3 (not v4)
- Variable maintenance quality
- Risk of outdated dependencies and unwanted extras

### Selected Starter: Official Vite `react-ts` Template

**Rationale for Selection:** Cleanest starting point for a 1-week prototype. Tailwind CSS v4's new Vite plugin makes manual setup trivial (2 commands + 2 file edits). Community starters add maintenance risk without meaningful time savings.

**Initialization Command:**

```bash
npm create vite@latest taiwan-soundscapes -- --template react-ts
cd taiwan-soundscapes
npm install
npm install tailwindcss @tailwindcss/vite
npm install motion
```

**Architectural Decisions Provided by Starter:**

**Language & Runtime:** TypeScript with Vite's default tsconfig (strict mode, ESNext target)

**Styling Solution:** Tailwind CSS v4 via `@tailwindcss/vite` plugin — zero-config, automatic content detection, CSS-first configuration. Setup: add plugin to `vite.config.ts`, replace CSS with `@import "tailwindcss"`.

**Animation Library:** Motion 12.x (formerly Framer Motion) — production-grade React animation with layout, gesture, and scroll animation support. Import as `motion` package.

**Build Tooling:** Vite 7.x — native ESM dev server, optimized production builds, HMR

**Testing Framework:** Vitest 4.x available if needed (same config as Vite, zero additional setup) — optional for prototype scope

**Code Organization:** Vite default `src/` structure, to be extended with component-based organization

**Development Experience:** Vite HMR for instant feedback, TypeScript type checking, ESLint via Vite plugin ecosystem

**Note:** Project initialization using this command should be the first implementation story.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
- Component architecture, SVG map approach, audio management, data architecture, asset strategy

**Important Decisions (Shape Architecture):**
- Directory structure, deployment platform

**Deferred Decisions (Post-MVP):**
- YouTube embed integration, user persistence, authentication — all out of scope for prototype

### Frontend Architecture

**Decision 1: Component Organization — Feature-Layered Structure**
- `components/` (UI), `hooks/` (logic), `data/` (static data), `types/` (TypeScript types)
- Rationale: Balanced separation of concerns for ~6 components without over-engineering

**Decision 2: SVG Map — SimpleMaps SVG → React Component**
- Download SimpleMaps Taiwan SVG (19.1 KB, free, web-optimized)
- Convert to inline React component (`TaiwanMap.tsx`) for full control
- Location markers as SVG child elements within the map's coordinate system
- Rationale: Zero dependency, full visual control for dark theme + glow effects, Motion animation directly on SVG elements
- Source: https://simplemaps.com/resources/svg-tw

**Decision 3: Audio Management — Single HTML5 Audio + Custom Hook**
- One `useAudioPlayer` hook managing a shared `HTMLAudioElement`
- Supports play/pause/volume/switch operations
- YouTube embed deferred — all 3 soundscapes use local mp3 files
- Rationale: 3 playable soundscapes don't justify a multi-engine abstraction

**Decision 4: Static Data — TypeScript Constants File**
- Single `locations.ts` with typed array of all 10 locations
- Uses `as const` for type safety and IDE auto-completion
- Each entry: id, name, coordinates, status (unlocked/locked), audio path, image path, unlock condition
- Rationale: 10 records in one file is perfectly manageable

**Decision 5: Asset Strategy — Vite `public/` Directory**
- Audio files: `public/audio/*.mp3`
- Scene photos: `public/images/*.jpg`
- All assets stored locally for demo reliability (no external CDN dependency)
- Referenced by absolute path strings in `locations.ts`
- Rationale: Media files should not be bundled; local storage ensures demo stability

### Infrastructure & Deployment

**Decision 6: Deployment — Vercel**
- Static SPA deployment with zero configuration for Vite + React
- Free tier: 100 GB bandwidth/month, unlimited static sites
- Auto-preview URLs on git push for demo sharing
- Default `*.vercel.app` subdomain

### Project Directory Structure

```
src/
├── components/          # React UI components
│   ├── TaiwanMap.tsx
│   ├── LocationDot.tsx
│   ├── SoundscapePlayer.tsx
│   ├── LocationDetail.tsx
│   └── LockOverlay.tsx
├── hooks/               # Custom React hooks
│   └── useAudioPlayer.ts
├── data/                # Static data
│   └── locations.ts
├── types/               # TypeScript type definitions
│   └── index.ts
├── App.tsx
├── index.css
└── main.tsx

public/
├── audio/               # mp3 audio files (3 unlocked)
└── images/              # scene photographs (3 unlocked)
```

### Decisions Not Applicable (Prototype Scope)

- **Data Architecture:** No database — all data is static TypeScript constants
- **Authentication & Security:** No user system — prototype has no auth
- **API & Communication:** No backend API — pure frontend SPA
- **Monitoring & Logging:** Not needed for competition prototype

## Implementation Patterns & Consistency Rules

### Pattern Categories Defined

**Critical Conflict Points Identified:** 5 areas where AI agents could make different choices — code naming, component patterns, state management, error handling, Tailwind usage.

### Naming Patterns

**File Naming:**
- Components: PascalCase (`TaiwanMap.tsx`, `LocationDot.tsx`)
- Hooks: camelCase with `use` prefix (`useAudioPlayer.ts`)
- Data/types: camelCase (`locations.ts`, `index.ts`)

**Code Naming:**
- Components: PascalCase (`LocationDot`)
- Functions/variables: camelCase (`handleLocationClick`, `isPlaying`)
- Types/interfaces: PascalCase, no `I` prefix (`Location`, `AudioState`)
- Global constants: UPPER_SNAKE_CASE (`MAX_VOLUME`); data constants: camelCase (`locations`)

### Component Patterns

**Declaration Style:** Arrow function + named export
```tsx
export const LocationDot = ({ id, name, status }: LocationDotProps) => {
  // ...
};
```

**Props Typing:** Separate interface, named `[Component]Props`
```tsx
interface LocationDotProps {
  id: string;
  name: string;
  status: 'unlocked' | 'locked';
}
```

**Composition over render props** — use children and component composition for this project's complexity level.

### State Management Patterns

- **App.tsx** owns global state: `selectedLocation`, `isPlaying`
- **useAudioPlayer** hook encapsulates audio logic, returns `{ play, pause, setVolume, isPlaying }`
- **Prop drilling, not Context** — 5 components, max 2 levels deep; Context is over-engineering
- **Immutable state updates** — always use `setState(prev => ...)`

### Error Handling Patterns

- Audio/image load failures: **silent degradation** — show default state, no crash
- No ErrorBoundary needed for prototype scope
- `console.warn` for non-critical errors, `console.error` for real problems
- Never throw errors from UI event handlers

### Tailwind Usage Patterns

- **Utility classes directly in JSX** — standard Tailwind approach
- Extract repeated visual patterns into **components, not CSS classes**
- **No `@apply`** — unnecessary abstraction for prototype
- Dark theme via Tailwind: base background on `<body>` or root `<div>`

### Enforcement Guidelines

**All AI Agents MUST:**
- Follow PascalCase for components, camelCase for functions/variables
- Use arrow function + named export for all components
- Use prop drilling (not Context) for state passing
- Handle audio/image errors with silent degradation
- Write Tailwind utilities inline in JSX

**Anti-Patterns to Avoid:**
- `ILocation` or `LocationInterface` — use `Location`
- `function LocationDot()` — use `export const LocationDot = () =>`
- Creating a Context or Redux store for shared state
- Using `@apply` or custom CSS classes instead of Tailwind utilities
- Throwing errors from event handlers or audio operations

## Project Structure & Boundaries

### Complete Project Directory Structure

```
taiwan-soundscapes/
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts              # React + Tailwind CSS plugins
├── .gitignore
├── index.html                  # Vite entry HTML, dark theme <body>
│
├── src/
│   ├── main.tsx                # React DOM entry point
│   ├── App.tsx                 # Root layout, global state (selectedLocation, isPlaying)
│   ├── index.css               # @import "tailwindcss" + custom CSS variables
│   │
│   ├── components/
│   │   ├── TaiwanMap.tsx       # SVG Taiwan map (SimpleMaps converted), renders LocationDots
│   │   ├── LocationDot.tsx     # Single map marker: glow (unlocked) or dim (locked)
│   │   ├── SoundscapePlayer.tsx # Audio controls: play/pause, volume slider
│   │   ├── LocationDetail.tsx  # Scene photo + location name overlay panel
│   │   └── LockOverlay.tsx     # Locked location modal: name + unlock condition
│   │
│   ├── hooks/
│   │   └── useAudioPlayer.ts   # HTML5 Audio management: play, pause, setVolume, switchTrack
│   │
│   ├── data/
│   │   └── locations.ts        # 10 location records (typed, as const)
│   │
│   └── types/
│       └── index.ts            # Location, AudioState, LocationStatus types
│
└── public/
    ├── audio/
    │   ├── tamsui.mp3          # 淡水河夕陽
    │   ├── alishan.mp3         # 阿里山雲海
    │   └── keelung.mp3         # 基隆港浪
    └── images/
        ├── tamsui.jpg          # 淡水河夕陽 scene photo
        ├── alishan.jpg         # 阿里山雲海 scene photo
        └── keelung.jpg         # 基隆港浪 scene photo
```

### Architectural Boundaries

**Component Boundaries:**

```
App.tsx (state owner)
├── TaiwanMap (receives: locations, selectedId, onSelect)
│   └── LocationDot × 10 (receives: location, isSelected, onClick)
├── LocationDetail (receives: selectedLocation, isPlaying)
├── SoundscapePlayer (receives: isPlaying, volume, onPlay, onPause, onVolumeChange)
└── LockOverlay (receives: lockedLocation, onClose)
```

- **App.tsx** is the single state owner — no component manages its own shared state
- All child components are **pure presentational** — they receive props and emit callbacks
- **useAudioPlayer** is called only in App.tsx, its return values passed down as props

**Data Flow:**

```
User clicks LocationDot
  → LocationDot calls onSelect(locationId)
    → App.tsx updates selectedLocation state
      → If unlocked: useAudioPlayer.play(audioPath), show LocationDetail
      → If locked: show LockOverlay with unlock condition
```

**No API Boundaries** — pure frontend, no external service calls.

**No Data Boundaries** — all data is static TypeScript constants loaded at build time.

### Requirements to Structure Mapping

**Map Exploration (FR1-FR5):**
- FR1 (interactive map on load): `App.tsx` → `TaiwanMap.tsx`
- FR2 (location markers): `TaiwanMap.tsx` → `LocationDot.tsx`
- FR3 (click unlocked): `LocationDot.tsx` → `App.tsx` callback
- FR4 (click locked): `LocationDot.tsx` → `LockOverlay.tsx`
- FR5 (brand tagline): `App.tsx` header section

**Soundscape Playback (FR6-FR10):**
- FR6 (audio playback): `useAudioPlayer.ts`
- FR7 (pause/resume): `SoundscapePlayer.tsx` → `useAudioPlayer.ts`
- FR8 (volume): `SoundscapePlayer.tsx` → `useAudioPlayer.ts`
- FR9 (scene photo): `LocationDetail.tsx`
- FR10 (switch locations): `App.tsx` state update → `useAudioPlayer.ts`

**Unlock System (FR11-FR13):**
- FR11 (lock indicator): `LocationDot.tsx` locked visual state
- FR12 (unlock condition): `LockOverlay.tsx` + `locations.ts` data
- FR13 (warm language): `locations.ts` unlock condition strings

**Location Content (FR14-FR16):**
- FR14 (3 unlocked): `locations.ts` + `public/audio/` + `public/images/`
- FR15 (7 locked): `locations.ts` name + unlock condition fields
- FR16 (unique assets): `public/audio/*.mp3` + `public/images/*.jpg`

**Visual Experience (FR17-FR20):**
- FR17 (dark theme): `index.html` body class + `index.css` + Tailwind utilities
- FR18 (glow animation): `LocationDot.tsx` Motion animation
- FR19 (dimmed locked): `LocationDot.tsx` Tailwind opacity/filter
- FR20 (smooth transition): `LocationDetail.tsx` Motion animate

### Cross-Cutting Concerns

- **Audio state** crosses TaiwanMap selection → SoundscapePlayer controls → LocationDetail display
- **Selected location** affects TaiwanMap highlighting, LocationDetail content, SoundscapePlayer track
- Both managed by App.tsx as single source of truth, passed via props

### Development Workflow

- `npm run dev` → Vite dev server with HMR
- `npm run build` → Production build to `dist/`
- `npm run preview` → Preview production build locally
- Vercel auto-deploys from git push, serves `dist/` as static SPA

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:** All technology choices verified compatible — React 19 + Vite 7.x + Tailwind CSS v4 + Motion 12.x. SimpleMaps SVG inline approach supports Motion SVG animation. HTML5 Audio API is standard across target browsers. Vercel static deployment matches Vite build output. No contradictory decisions found.

**Pattern Consistency:** Naming conventions (PascalCase components, camelCase functions) align with React ecosystem standards. Arrow function + named export pattern is consistent across all components. Prop drilling appropriate for 5 components / 2 levels. Tailwind utility-first approach matches v4 best practices.

**Structure Alignment:** Feature-layered directory fully supports all architectural decisions. public/ directory aligns with Vite static asset handling. Single state owner (App.tsx) matches prop drilling pattern.

### Requirements Coverage Validation ✅

**Functional Requirements:** All 20 FRs have explicit architectural support with file-level mapping (see Project Structure & Boundaries section).

**Non-Functional Requirements:** All 7 NFRs addressed — performance via Vite optimization + local assets + lightweight SVG; browser compatibility via standard Web APIs.

### Implementation Readiness Validation ✅

**Decision Completeness:** All 6 decisions documented with rationale and verified technology versions.

**Structure Completeness:** Complete directory tree, component boundary tree with props, and data flow diagram all defined.

**Pattern Completeness:** 5 pattern categories defined with examples and anti-patterns.

### Gap Analysis Results

**Critical Gaps:** None

**Important Gaps:** None

**Minor Notes:**
1. Safari audio autoplay policy — handled by existing click-to-play interaction pattern
2. SVG location coordinates — to be determined during implementation, supported by locations.ts data model

### Architecture Completeness Checklist

**✅ Requirements Analysis**
- [x] Project context thoroughly analyzed
- [x] Scale and complexity assessed (Low)
- [x] Technical constraints identified
- [x] Cross-cutting concerns mapped

**✅ Architectural Decisions**
- [x] Critical decisions documented with versions
- [x] Technology stack fully specified
- [x] Integration patterns defined
- [x] Performance considerations addressed

**✅ Implementation Patterns**
- [x] Naming conventions established
- [x] Component patterns defined
- [x] State management patterns specified
- [x] Error handling patterns documented
- [x] Tailwind usage patterns defined

**✅ Project Structure**
- [x] Complete directory structure defined
- [x] Component boundaries established
- [x] Data flow mapped
- [x] Requirements to structure mapping complete

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION

**Confidence Level:** High — low complexity prototype with well-established technology stack, clear boundaries, and comprehensive patterns.

**Key Strengths:**
- Zero backend complexity — pure frontend SPA eliminates entire categories of architectural risk
- Proven tech stack — React + Vite + Tailwind is industry standard with extensive tooling support
- Clear component boundaries with single state owner — prevents state synchronization issues
- Local assets eliminate external dependency risk for demo reliability

**Areas for Future Enhancement (Post-Prototype):**
- Audio source abstraction layer (if YouTube embeds needed)
- Context API migration (if component tree deepens beyond 3 levels)
- Responsive design system (if mobile support required)
- Asset CDN migration (if production deployment needed)

### Implementation Handoff

**AI Agent Guidelines:**
- Follow all architectural decisions exactly as documented
- Use implementation patterns consistently across all components
- Respect project structure and boundaries
- Refer to this document for all architectural questions

**First Implementation Priority:** Initialize project using the starter command documented in the Starter Template Evaluation section.

## Architecture Completion Summary

### Workflow Completion

**Architecture Decision Workflow:** COMPLETED ✅
**Total Steps Completed:** 8
**Date Completed:** 2026-01-30
**Document Location:** `_bmad-output/planning-artifacts/architecture.md`

### Final Architecture Deliverables

**Complete Architecture Document**
- All architectural decisions documented with specific versions
- Implementation patterns ensuring AI agent consistency
- Complete project structure with all files and directories
- Requirements to architecture mapping
- Validation confirming coherence and completeness

**Implementation Ready Foundation**
- 6 architectural decisions made
- 5 implementation pattern categories defined
- 6 architectural components specified (5 React components + 1 custom hook)
- 27 requirements fully supported (20 FRs + 7 NFRs)

**AI Agent Implementation Guide**
- Technology stack with verified versions
- Consistency rules that prevent implementation conflicts
- Project structure with clear boundaries
- Component boundary tree with props and data flow

### Development Sequence

1. Initialize project using documented starter template command
2. Configure Tailwind CSS v4 plugin and dark theme base
3. Download SimpleMaps Taiwan SVG and convert to React component
4. Implement TypeScript types and location data constants
5. Build core components following established patterns
6. Add audio management hook and playback controls
7. Integrate Motion animations for glow effects and transitions
8. Source and add placeholder audio files and scene photographs
9. Deploy to Vercel for demo

---

**Phase 1 Architecture Status:** READY FOR IMPLEMENTATION ✅

**Document Maintenance:** Update this architecture when major technical decisions are made during implementation.

---

## Phase 2: Sleep Coach Architecture Additions

_Updated: 2026-02-01 — Architectural decisions for Phase 2 (Sleep Coach Concept Validation) based on PRD sections P2-1 through P2-7 and FR21-FR46._

### Phase 2 Context

Phase 2 elevates the prototype from "Taiwan sound map" to "sleep coach concept." All additions remain static frontend — no backend, no data persistence. The existing Phase 1 map experience is preserved and relocated into a tab-based navigation structure.

**New Scope:** 7 new components, 26 new FRs (FR21-FR46), updated NFR coverage (FR1-FR46).

**Constraint:** Page refresh resets all state (onboarding, sleep type, tab position). This is acceptable for a competition prototype.

### Decision 7: Navigation — Pure State Conditional Rendering

**Decision:** No React Router. Tab switching and onboarding flow controlled entirely by React state in App.tsx.

**Rationale:** This is a competition demo prototype with no need for URL-based navigation, browser history, or shareable deep links. Conditional rendering is consistent with the Phase 1 architecture pattern and avoids adding a new dependency.

**Implementation:**

```tsx
// App.tsx state additions
const [activeTab, setActiveTab] = useState<Tab>('tonight');
const [onboardingComplete, setOnboardingComplete] = useState(false);
const [showProductStory, setShowProductStory] = useState(false);
```

**Rendering Logic:**

```
if !onboardingComplete → SleepAssessment (fullscreen, no TabBar)
if onboardingComplete → TabBar + active tab content
if showProductStory → ProductStory (fullscreen overlay, above everything)
```

### Decision 8: State Management — Extended Prop Drilling

**Decision:** All Phase 2 state remains in App.tsx, passed via props. No Context API.

**Rationale:** The component tree remains 2 levels deep maximum. 8 state variables in App.tsx is manageable. Context solves deep prop threading problems that don't exist in this architecture.

**Complete App.tsx State Model (Phase 1 + Phase 2):**

| State | Type | Purpose |
|---|---|---|
| `selectedLocationId` | `string \| null` | Currently selected map location (Phase 1) |
| `lockedLocation` | `Location \| null` | Currently shown locked location overlay (Phase 1) |
| `audioPlayer.*` | hook return | Audio playback state (Phase 1) |
| `activeTab` | `Tab` | Current tab: 'tonight' \| 'explore' \| 'journey' (Phase 2) |
| `onboardingComplete` | `boolean` | Whether questionnaire is finished (Phase 2) |
| `sleepType` | `SleepType \| null` | Determined sleep type from questionnaire (Phase 2) |
| `showProductStory` | `boolean` | Product Story overlay visibility (Phase 2) |

### Decision 9: Phase 2 Component Architecture

**7 new components** integrated into the existing flat component structure:

```
App.tsx (all state owner)
│
├── if !onboardingComplete:
│   └── SleepAssessment
│       ├── (internal) QuestionScreen × 5
│       └── SleepTypeResult
│
├── if onboardingComplete:
│   ├── TabBar
│   │
│   ├── if activeTab === 'tonight':
│   │   └── TonightPage
│   │       └── PrescriptionCard × 2
│   │
│   ├── if activeTab === 'explore':
│   │   ├── CollectionProgress
│   │   ├── TaiwanMap → LocationDot × 10 (existing)
│   │   ├── LocationDetail (existing)
│   │   ├── SoundscapePlayer (existing)
│   │   └── LockOverlay (existing)
│   │
│   └── if activeTab === 'journey':
│       └── MyJourneyPage
│
└── if showProductStory:
    └── ProductStory (fullscreen overlay)
```

**Component Props Definitions:**

| Component | Props | Responsibility |
|---|---|---|
| `SleepAssessment` | `onComplete(sleepType: SleepType)` | 5-question flow + result page; manages internal question state |
| `TonightPage` | `sleepType: SleepType, onNavigateToLocation(id: string)` | Prescription homepage with progress bar, cards, coach tip |
| `PrescriptionCard` | `type: 'breathing' \| 'soundscape', content: PrescriptionCardContent, onTap?()` | Reusable card for breathing exercise or soundscape recommendation |
| `MyJourneyPage` | `sleepType: SleepType, onOpenProductStory()` | Achievement stats + reinforcement message + progress |
| `TabBar` | `activeTab: Tab, onTabChange(tab: Tab)` | Bottom tab navigation with active state indicator |
| `ProductStory` | `onClose()` | Scrollable product vision page |
| `CollectionProgress` | `unlockedCount: number, totalCount: number, hintText: string` | Collection indicator above map |

**SleepAssessment Internal Architecture:**

SleepAssessment manages its own internal state (currentQuestionIndex, answers) and only communicates the final result to App.tsx via `onComplete`. The question screens and result page are rendered internally — no need for App.tsx to know about question navigation.

### Decision 10: Data Architecture — Sleep Data Model

**New file: `data/sleep.ts`** containing all Phase 2 static data.

**Questionnaire Data:**

```typescript
interface SleepQuestion {
  id: string;
  question: string;
  options: SleepOption[];
}

interface SleepOption {
  label: string;
  value: string;
  weight: Partial<Record<SleepType, number>>;
}
```

**Sleep Type Definitions:**

```typescript
type SleepType = 'difficulty' | 'light' | 'anxious';

interface SleepTypeInfo {
  type: SleepType;
  name: string;        // 入睡困難型 / 淺眠易醒型 / 焦慮思緒型
  description: string;
  approach: string;
}
```

**Prescription Content (3 variants):**

```typescript
interface Prescription {
  sleepType: SleepType;
  planName: string;              // e.g. "入睡困難急救包"
  totalDays: number;
  currentDay: number;            // hardcoded
  breathing: {
    name: string;                // "4-7-8 呼吸法"
    duration: string;            // "3 分鐘"
    expert: string;              // "江醫師引導"
  };
  soundscapeLocationId: string;  // references locations.ts id
  coachTip: string;
}
```

**My Journey Stats (hardcoded):**

```typescript
interface JourneyStats {
  completedSessions: number;
  longestStreak: number;
  unlockedSoundscapes: number;
  reinforcementMessage: string;
}
```

**Sleep Type Determination Logic:**

Weighted scoring — each answer option contributes weight points to one or more sleep types. After 5 questions, sum weights per type and select the highest. This is implemented as a single `reduce` over the answers array. Simple, deterministic, and testable.

### Decision 11: Cross-Tab Navigation Flow

**Critical Interaction: Tonight → Explore auto-play (FR35)**

```
TonightPage: user taps soundscape recommendation card
  → calls onNavigateToLocation(locationId)
    → App.tsx executes (synchronously):
      1. setActiveTab('explore')
      2. setSelectedLocationId(locationId)
      3. audioPlayer.play(location.audioPath)
```

This reuses the existing `handleSelect` logic from Phase 1. The only addition is `setActiveTab('explore')` before triggering selection.

**Product Story Navigation:**

Accessible from two entry points:
1. Info icon in the app header (always visible when tabs are shown)
2. Link/button in MyJourneyPage

Both set `showProductStory = true`. ProductStory renders as a fullscreen overlay above all tab content. Close button sets `showProductStory = false`.

### Decision 12: Existing Component Impact Assessment

| Component | Change Required | Details |
|---|---|---|
| `App.tsx` | **Major** | New state variables, tab rendering logic, onboarding flow, cross-tab navigation handlers |
| `SoundscapePlayer.tsx` | **Minor** | Adjust positioning: `bottom-16` (above TabBar) instead of `bottom-0` when TabBar is visible |
| `types/index.ts` | **Extension** | Add `SleepType`, `Tab`, `SleepQuestion`, `SleepOption`, `Prescription`, `JourneyStats` types |
| `TaiwanMap.tsx` | **None** | Unchanged — wrapped inside explore tab container |
| `LocationDot.tsx` | **None** | Unchanged |
| `LocationDetail.tsx` | **None** | Unchanged |
| `LockOverlay.tsx` | **None** | Unchanged |
| `useAudioPlayer.ts` | **None** | Unchanged |
| `locations.ts` | **None** | Unchanged |

**SoundscapePlayer + TabBar Positioning:**

- TabBar: `fixed bottom-0` (always at screen bottom when visible)
- SoundscapePlayer: `fixed bottom-16` (sits above TabBar when audio is playing)
- Z-index: TabBar at `z-40`, SoundscapePlayer at `z-30` — TabBar always on top

### Updated Project Directory Structure

```
src/
├── components/
│   ├── TaiwanMap.tsx            # existing — SVG map
│   ├── LocationDot.tsx          # existing — map markers
│   ├── LocationDetail.tsx       # existing — scene photo + name
│   ├── SoundscapePlayer.tsx     # existing — audio controls (positioning adjusted)
│   ├── LockOverlay.tsx          # existing — locked location modal
│   ├── TabBar.tsx               # NEW — bottom tab navigation
│   ├── SleepAssessment.tsx      # NEW — 5-question onboarding + result page
│   ├── TonightPage.tsx          # NEW — prescription homepage
│   ├── PrescriptionCard.tsx     # NEW — breathing/soundscape card
│   ├── MyJourneyPage.tsx        # NEW — achievements + progress
│   ├── ProductStory.tsx         # NEW — product vision overlay
│   └── CollectionProgress.tsx   # NEW — collection indicator
├── hooks/
│   └── useAudioPlayer.ts       # existing — unchanged
├── data/
│   ├── locations.ts             # existing — unchanged
│   └── sleep.ts                 # NEW — questions, types, prescriptions, journey stats
├── types/
│   └── index.ts                 # extended with Phase 2 types
├── App.tsx                      # major updates for Phase 2
├── index.css
└── main.tsx
```

### Phase 2 Requirements to Structure Mapping

**Tab Navigation (FR21-FR23):**
- FR21 (3-tab navigation): `App.tsx` → `TabBar.tsx`
- FR22 (persistent tab bar with active indicator): `TabBar.tsx`
- FR23 (tab bar hidden during onboarding): `App.tsx` conditional rendering

**Sleep Assessment Questionnaire (FR24-FR28):**
- FR24 (5-question assessment on first visit): `SleepAssessment.tsx`
- FR25 (one question at a time + progress): `SleepAssessment.tsx` internal state
- FR26 (3-4 multiple-choice options): `SleepAssessment.tsx` + `data/sleep.ts`
- FR27 (navigate back to previous questions): `SleepAssessment.tsx` internal state
- FR28 (determine sleep type): `data/sleep.ts` weighted scoring logic

**Sleep Type Result (FR29-FR31):**
- FR29 (result page with type info + CTA): `SleepAssessment.tsx` (SleepTypeResult internal view)
- FR30 (3 possible results): `data/sleep.ts` SleepTypeInfo definitions
- FR31 ("Start My Plan" enters Tonight tab): `SleepAssessment.tsx` → `onComplete` → `App.tsx`

**Tonight Homepage (FR32-FR37):**
- FR32 (plan progress bar): `TonightPage.tsx`
- FR33 (breathing exercise card): `PrescriptionCard.tsx` type='breathing'
- FR34 (soundscape recommendation card): `PrescriptionCard.tsx` type='soundscape'
- FR35 (tap recommendation → Explore tab + auto-play): `TonightPage.tsx` → `onNavigateToLocation` → `App.tsx`
- FR36 (coach tip message): `TonightPage.tsx`
- FR37 (content varies by sleep type): `data/sleep.ts` Prescription variants

**My Journey Page (FR38-FR40):**
- FR38 (cumulative stats): `MyJourneyPage.tsx` + `data/sleep.ts` JourneyStats
- FR39 (positive reinforcement message): `MyJourneyPage.tsx` + `data/sleep.ts`
- FR40 (plan progress): `MyJourneyPage.tsx`

**Map Integration Updates (FR41-FR42):**
- FR41 (collection progress indicator): `CollectionProgress.tsx`
- FR42 (unlock hint linking to sleep plan): `CollectionProgress.tsx` hintText prop

**Product Story Page (FR43-FR46):**
- FR43 (accessible from within app): header info icon + `MyJourneyPage.tsx` link
- FR44 (product vision content): `ProductStory.tsx`
- FR45 (scrollable with visual hierarchy): `ProductStory.tsx` Tailwind typography
- FR46 (return to main app): `ProductStory.tsx` `onClose` prop

### Phase 2 Implementation Patterns

**All Phase 1 patterns remain in effect.** The following additions apply to Phase 2 components:

**Tab Type:**
```typescript
type Tab = 'tonight' | 'explore' | 'journey';
```

**New Component Patterns:**
- Phase 2 components follow identical patterns: arrow function + named export, PascalCase, separate Props interface
- `SleepAssessment` is the only component with significant internal state (question index, answers array) — all other new components are presentational

**Animation Patterns for Phase 2:**
- Tab transitions: `AnimatePresence` with `mode="wait"` for content switching (fade, not slide)
- Onboarding questions: horizontal slide transition between questions
- Product Story: slide-up from bottom (fullscreen overlay entrance)
- All Motion animations follow Phase 1 conventions (motion/react import, animate prop)

**Anti-Patterns (Phase 2 additions):**
- Do NOT use React Router or any URL-based navigation
- Do NOT persist onboarding state to localStorage (refresh = reset is intentional)
- Do NOT add Context for sleep type — pass via props from App.tsx
- Do NOT make SoundscapePlayer aware of TabBar — handle positioning in App.tsx layout

### Phase 2 Validation

**Decision Compatibility:** All Phase 2 decisions are additive — no Phase 1 decisions are overridden or contradicted. The same tech stack (React 19 + Vite 7 + Tailwind v4 + Motion 12) supports all new components. State management pattern (prop drilling from App.tsx) scales to the expanded component set without breaking the 2-level depth constraint.

**Requirements Coverage:** All 26 new FRs (FR21-FR46) have explicit architectural support with component-level mapping. Updated NFR6-7 coverage (FR1-FR46) is supported by the same browser compatibility approach.

**Implementation Readiness:** All 6 new architectural decisions (7-12) documented with rationale. New component tree, props, data model, and cross-tab flow are fully specified.

**Phase 2 Architecture Status:** READY FOR IMPLEMENTATION ✅
