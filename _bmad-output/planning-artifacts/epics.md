---
stepsCompleted:
  - step-01-validate-prerequisites
  - step-02-design-epics
  - step-03-create-stories
  - step-04-final-validation
status: complete
phase2CompletedAt: '2026-02-01'
inputDocuments:
  - _bmad-output/planning-artifacts/prd.md
  - _bmad-output/planning-artifacts/architecture.md
phase1Status: complete
phase1CompletedAt: '2026-01-30'
phase2Status: complete
---

# taiwan-soundscapes - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for taiwan-soundscapes, decomposing the
requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable
stories.

## Requirements Inventory

### Functional Requirements

FR1: User can view an interactive Taiwan map as the primary interface upon page load
FR2: User can see location markers on the map, visually distinguished as unlocked (glowing) or locked (dimmed)
FR3: User can click an unlocked location marker to select it and trigger its soundscape
FR4: User can click a locked location marker to view its unlock condition
FR5: User can see the brand tagline "好眠秘境 — 用耳朵旅行台灣" on the main interface
FR6: User can hear audio playback when an unlocked location is selected
FR7: User can pause and resume the currently playing soundscape
FR8: User can adjust the volume of the playing soundscape
FR9: User can see a scene photograph associated with the currently playing location
FR10: User can switch between unlocked locations, stopping the previous soundscape and starting the new one
FR11: User can see a lock indicator on locations that are not yet unlocked
FR12: User can view the specific unlock condition for each locked location (e.g., "連續好眠 14 天")
FR13: User can see unlock conditions presented in encouraging language using a positive-achievement pattern (e.g., "[positive action] to unlock [reward]"), with no countdown timers or punishment framing
FR14: System displays 3 unlocked locations with full audio and imagery: 淡水河夕陽, 阿里山雲海, 基隆港浪
FR15: System displays 7 locked locations with names and unlock prompts: 蘭嶼飛魚季, 太魯閣溪流, 日月潭晨曦, 墾丁星空, 合歡山銀河, 台東稻浪, 玉山頂風聲
FR16: Each unlocked location has a unique audio source and scene photograph
FR17: System presents a dark-themed interface as the default visual style
FR18: Unlocked location markers display a glow animation effect
FR19: Locked location markers display a dimmed/muted visual state with lock icon
FR20: User can see an animated visual transition (300-500ms duration, no frame drops below 30fps) when selecting a location
FR21: User can navigate between three tabs: Tonight (今晚), Explore (探索), My Journey (我的)
FR22: Tab bar is persistent and visible across all three views with active state indicator
FR23: Tab bar is hidden during the onboarding questionnaire flow
FR24: User is presented with a 5-question sleep assessment on first visit (before accessing the main app)
FR25: Each question displays one at a time with a progress indicator (e.g., "3 of 5")
FR26: Each question offers 3-4 multiple-choice options; user must select one to proceed
FR27: User can navigate back to previous questions to change answers
FR28: Upon completing all 5 questions, the system determines one of 3 sleep types based on simple priority logic
FR29: User sees their sleep type result with: type name, brief description, recommended approach summary, and a "Start My Plan" button
FR30: The 3 possible results are: 入睡困難型 (Difficulty Falling Asleep), 淺眠易醒型 (Light Sleeper), 焦慮思緒型 (Anxious Mind)
FR31: Tapping "Start My Plan" dismisses the onboarding and enters the main app on the "Tonight" tab
FR32: User can see a plan progress bar showing plan name, current day, total days, and percentage
FR33: User can see a breathing exercise card displaying exercise name, duration, and expert name (display only — not interactive)
FR34: User can see a soundscape recommendation card linked to a specific map location
FR35: User can tap the soundscape recommendation card to navigate to the Explore tab and auto-play the recommended location's audio
FR36: User can see a coach tip message at the bottom of the page
FR37: Prescription card content varies based on the sleep type determined during onboarding (3 content variants)
FR38: User can see cumulative achievement stats: completed sessions, longest streak, unlocked soundscapes (all hardcoded values)
FR39: User can see a positive reinforcement message highlighting a recent behavior pattern
FR40: User can see their current plan progress (consistent with the Tonight tab progress bar)
FR41: User can see a collection progress indicator above the map ("已收集 X/10 個台灣聲景")
FR42: User can see a hint linking a locked location to the sleep plan (e.g., "完成「入睡困難急救包」即可解鎖：台東稻田")
FR43: User can access a Product Story page from within the app
FR44: Product Story page displays: product vision, competitive landscape, target audience, design philosophy, differentiation moat, and product roadmap
FR45: Product Story page is a scrollable page with clear section headings, readable body text (minimum 16px equivalent), visual hierarchy, and content completable in under 3 minutes of reading
FR46: User can return to the main app from the Product Story page

### NonFunctional Requirements

NFR1: Map page loads and renders within 2 seconds on standard broadband connection
NFR2: Audio playback begins within 500ms of clicking an unlocked location
NFR3: SVG map interactions (hover, click) respond at 60fps with no visible lag
NFR4: Switching between locations completes audio crossfade within 500ms and visual transition within 300-500ms with no dropped frames
NFR5: Scene photographs load within 1 second of location selection
NFR6: All functional requirements (FR1-FR46) pass manual verification in Chrome (latest) as the primary demo browser
NFR7: All functional requirements (FR1-FR46) pass manual verification in Safari (latest) as secondary browser

### Additional Requirements

- **Starter Template:** Official Vite `react-ts` template — project initialization command (`npm create vite@latest taiwan-soundscapes -- --template react-ts`) is the first implementation story
- **Tailwind CSS v4** via `@tailwindcss/vite` plugin, CSS-first configuration (no config file needed)
- **Motion 12.x** (formerly Framer Motion) for glow effects, transitions, and SVG element animations
- **SimpleMaps Taiwan SVG** (19.1 KB, free) downloaded and converted to inline React component (`TaiwanMap.tsx`)
- **Single HTML5 Audio + custom `useAudioPlayer` hook** — all 3 soundscapes use local mp3 files, YouTube embed deferred
- **Static data model:** Single `locations.ts` TypeScript constants file with typed array of all 10 locations (`as const`)
- **All assets stored locally** in `public/audio/` and `public/images/` for demo reliability (no external CDN)
- **Vercel deployment** for static SPA with auto-preview URLs on git push
- **Feature-layered directory:** `components/`, `hooks/`, `data/`, `types/` under `src/`
- **App.tsx as single state owner** with prop drilling (not Context) — max 2 levels deep
- **Component pattern:** Arrow function + named export, separate `[Component]Props` interface
- **Naming:** PascalCase components, camelCase functions/variables, no `I` prefix on types
- **Error handling:** Silent degradation for audio/image load failures, no ErrorBoundary
- **Tailwind usage:** Utilities inline in JSX, no `@apply`, extract repeated patterns into components

**Phase 2 Additional Requirements (from Architecture Decisions 7-12):**
- **No React Router:** Tab switching and onboarding flow controlled entirely by React state in App.tsx (conditional rendering)
- **Extended prop drilling:** All Phase 2 state remains in App.tsx, passed via props. No Context API.
- **7 new components:** `SleepAssessment`, `TonightPage`, `PrescriptionCard`, `MyJourneyPage`, `TabBar`, `ProductStory`, `CollectionProgress`
- **New data file:** `data/sleep.ts` containing questionnaire data, sleep type definitions, prescription content (3 variants), journey stats
- **Weighted scoring:** Sleep type determination uses weighted scoring — each answer contributes weight points to sleep types, highest sum wins
- **Cross-tab navigation:** TonightPage → `onNavigateToLocation(locationId)` → App.tsx executes `setActiveTab('explore')` + `setSelectedLocationId` + `audioPlayer.play()`
- **ProductStory entry points:** Header info icon (always visible when tabs shown) + link in MyJourneyPage. Renders as fullscreen overlay.
- **SoundscapePlayer positioning:** Adjusted to `bottom-16` (above TabBar) when TabBar is visible. TabBar at `z-40`, SoundscapePlayer at `z-30`
- **SleepAssessment internal state:** Manages its own `currentQuestionIndex` and `answers` — only communicates final result to App.tsx via `onComplete(sleepType)`
- **Animation patterns (Phase 2):** Tab transitions use `AnimatePresence mode="wait"` (fade). Onboarding questions use horizontal slide. ProductStory uses slide-up from bottom.
- **Anti-patterns:** No React Router, no localStorage persistence, no Context for sleep type, SoundscapePlayer must not be aware of TabBar

### FR Coverage Map

| FR | Epic | Description |
|----|------|-------------|
| FR1 | Epic 1 | Interactive Taiwan map as primary interface on page load |
| FR2 | Epic 1 | Location markers visually distinguished (glowing/dimmed) |
| FR5 | Epic 1 | Brand tagline display |
| FR17 | Epic 1 | Dark-themed interface as default |
| FR3 | Epic 2 | Click unlocked location to trigger soundscape |
| FR6 | Epic 2 | Audio playback on location selection |
| FR7 | Epic 2 | Pause and resume soundscape |
| FR8 | Epic 2 | Volume adjustment |
| FR9 | Epic 2 | Scene photograph display |
| FR10 | Epic 2 | Switch between locations (stop previous, start new) |
| FR14 | Epic 2 | 3 unlocked locations with full audio and imagery |
| FR16 | Epic 2 | Each unlocked location has unique audio + photo |
| FR4 | Epic 3 | Click locked location to view unlock condition |
| FR11 | Epic 3 | Lock indicator on locked locations |
| FR12 | Epic 3 | Specific unlock condition display per location |
| FR13 | Epic 3 | Warm, positive language for unlock conditions |
| FR15 | Epic 3 | 7 locked locations with names and prompts |
| FR18 | Epic 4 | Glow animation on unlocked markers |
| FR19 | Epic 4 | Dimmed/muted visual state with lock icon |
| FR20 | Epic 4 | Smooth visual transition on location selection |
| FR21 | Epic 5 | Three-tab navigation (Tonight/Explore/Journey) |
| FR22 | Epic 5 | Persistent tab bar with active state indicator |
| FR23 | Epic 5 | Tab bar hidden during onboarding |
| FR24 | Epic 5 | 5-question sleep assessment on first visit |
| FR25 | Epic 5 | One question at a time with progress indicator |
| FR26 | Epic 5 | 3-4 multiple-choice options per question |
| FR27 | Epic 5 | Navigate back to previous questions |
| FR28 | Epic 5 | Determine sleep type from questionnaire |
| FR29 | Epic 5 | Sleep type result page with CTA |
| FR30 | Epic 5 | 3 possible sleep type results |
| FR31 | Epic 5 | "Start My Plan" enters Tonight tab |
| FR32 | Epic 6 | Plan progress bar |
| FR33 | Epic 6 | Breathing exercise card (display only) |
| FR34 | Epic 6 | Soundscape recommendation card |
| FR35 | Epic 6 | Tap recommendation → Explore + auto-play |
| FR36 | Epic 6 | Coach tip message |
| FR37 | Epic 6 | Content varies by sleep type (3 variants) |
| FR38 | Epic 7 | Cumulative achievement stats |
| FR39 | Epic 7 | Positive reinforcement message |
| FR40 | Epic 7 | Current plan progress |
| FR41 | Epic 7 | Collection progress indicator above map |
| FR42 | Epic 7 | Hint linking locked location to sleep plan |
| FR43 | Epic 8 | Access Product Story from app |
| FR44 | Epic 8 | Product Story content |
| FR45 | Epic 8 | Scrollable page with visual hierarchy |
| FR46 | Epic 8 | Return to main app |

## Epic List

### Epic 1: Taiwan Map Interface Foundation
Users can open the page and see a dark-themed interactive Taiwan map with glowing and dimmed location markers and the brand tagline "好眠秘境 — 用耳朵旅行台灣", establishing the "sound journey across Taiwan" concept within 30 seconds.
**FRs covered:** FR1, FR2, FR5, FR17

### Epic 2: Soundscape Exploration & Playback
Users can click any unlocked location on the map to hear its unique soundscape and see its scene photograph, with full playback controls (play/pause/volume) and the ability to freely switch between locations to explore different Taiwan soundscapes.
**FRs covered:** FR3, FR6, FR7, FR8, FR9, FR10, FR14, FR16

### Epic 3: Unlock System & Gamification Display
Users can click locked locations to discover the gamification mechanic — warm unlock condition prompts communicate "collect Taiwan's sounds by sleeping well", differentiating this from a standard white noise player and demonstrating the commercial moat.
**FRs covered:** FR4, FR11, FR12, FR13, FR15

### Epic 4: Visual Polish & Presentation Quality
The complete experience reaches presentation-grade quality with fluid glow animations on unlocked markers, polished dimmed states with lock icons on locked markers, and smooth visual transitions when selecting locations — ready for stage demo.
**FRs covered:** FR18, FR19, FR20
**NFRs addressed:** NFR1-NFR7 (performance and browser compatibility validated across all epics)

### Epic 5: Sleep Assessment & App Navigation
Users complete a 5-question sleep assessment on first visit, discover their personalized sleep type (入睡困難型/淺眠易醒型/焦慮思緒型), and enter a tabbed app with three sections — Tonight, Explore (existing map), and My Journey — establishing the "sleep coach" concept and transforming the prototype from a sound map into a personalized sleep solution.
**FRs covered:** FR21, FR22, FR23, FR24, FR25, FR26, FR27, FR28, FR29, FR30, FR31

### Epic 6: Tonight Sleep Prescription Homepage
Users see their personalized "Tonight" sleep prescription with a plan progress bar, breathing exercise card, soundscape recommendation card, and coach tip — all content varying by sleep type. Tapping the soundscape recommendation navigates to the Explore tab and auto-plays the recommended location's audio, seamlessly connecting the sleep coach with the sound map.
**FRs covered:** FR32, FR33, FR34, FR35, FR36, FR37

### Epic 7: My Journey & Collection Progress
Users track their sleep journey progress with cumulative achievement stats, positive reinforcement messaging, and plan progress on the My Journey tab. The Explore tab gains a collection progress indicator and unlock hints that connect soundscape collection to the sleep plan, reinforcing the "collect Taiwan's sounds by sleeping well" narrative.
**FRs covered:** FR38, FR39, FR40, FR41, FR42

### Epic 8: Product Story
Users access a dedicated Product Story page presenting the product vision, competitive landscape, target audience, design philosophy, differentiation moat, and product roadmap — an embedded pitch that demonstrates deep product thinking to competition judges.
**FRs covered:** FR43, FR44, FR45, FR46

## Epic 1: Taiwan Map Interface Foundation

Users can open the page and see a dark-themed interactive Taiwan map with glowing and dimmed location markers and the brand tagline "好眠秘境 — 用耳朵旅行台灣", establishing the "sound journey across Taiwan" concept within 30 seconds.

### Story 1.1: Project Initialization & Dark Theme Foundation

As a developer,
I want to initialize the project with the correct tech stack and dark theme,
So that the development environment is ready and the visual foundation matches the "好眠秘境" dark atmosphere.

**Acceptance Criteria:**

**Given** the project does not yet exist
**When** the developer runs the initialization commands
**Then** a new Vite + React + TypeScript project is created with Tailwind CSS v4 (`@tailwindcss/vite` plugin) and Motion 12.x installed
**And** the directory structure contains `src/components/`, `src/hooks/`, `src/data/`, `src/types/`

**Given** the project is initialized
**When** the developer runs `npm run dev` and opens the page
**Then** the page displays a deep navy/charcoal dark-themed background as the default visual style (FR17)
**And** Tailwind CSS utilities are functional in JSX

**Given** the project needs a location data model
**When** the developer inspects `src/types/index.ts` and `src/data/locations.ts`
**Then** TypeScript types define `Location` with fields: id, name (zh/en), coordinates (x, y), status ('unlocked' | 'locked'), audioPath, imagePath, unlockCondition
**And** `locations.ts` contains all 10 locations with correct status (3 unlocked, 7 locked) using `as const`

### Story 1.2: Interactive Taiwan Map with Location Markers & Brand Tagline

As a user,
I want to see an interactive Taiwan map with location markers upon page load,
So that I immediately understand this is a geographic sound exploration experience.

**Acceptance Criteria:**

**Given** the user opens the page in a browser
**When** the page finishes loading
**Then** an SVG Taiwan map (converted from SimpleMaps) is displayed prominently on the dark background (FR1)
**And** the map is centered and sized appropriately for the viewport

**Given** the Taiwan map is displayed
**When** the user looks at the map
**Then** 10 location markers are visible at geographically appropriate positions on the map (FR2)
**And** 3 unlocked locations (淡水河夕陽, 阿里山雲海, 基隆港浪) appear bright/visible
**And** 7 locked locations appear dimmed/muted (basic visual distinction, no animation yet)

**Given** the page is loaded
**When** the user views the interface
**Then** the brand tagline "好眠秘境 — 用耳朵旅行台灣" is visible in the header area (FR5)
**And** the tagline uses styling consistent with the dark theme

**Given** the map has location markers
**When** the user hovers over any location dot
**Then** the location name is displayed (tooltip or label)

## Epic 2: Soundscape Exploration & Playback

Users can click any unlocked location on the map to hear its unique soundscape and see its scene photograph, with full playback controls (play/pause/volume) and the ability to freely switch between locations to explore different Taiwan soundscapes.

### Story 2.1: Audio Playback Engine & Player Controls

As a user,
I want to click an unlocked location and hear its soundscape with playback controls,
So that I can experience the sound of each Taiwan location.

**Acceptance Criteria:**

**Given** the map is displayed with unlocked location markers
**When** the user clicks an unlocked location (e.g., 淡水河夕陽)
**Then** audio playback begins for that location's soundscape (FR3, FR6)
**And** the `SoundscapePlayer` component becomes visible with active controls

**Given** a soundscape is currently playing
**When** the user clicks the pause button
**Then** audio playback pauses
**And** the button changes to a play icon (FR7)

**Given** a soundscape is paused
**When** the user clicks the play button
**Then** audio playback resumes from where it was paused (FR7)

**Given** a soundscape is playing
**When** the user adjusts the volume slider
**Then** the audio volume changes in real-time to match the slider position (FR8)

**Given** a soundscape is playing for one location
**When** the user clicks a different unlocked location
**Then** the previous soundscape stops and the new location's soundscape begins playing (FR10)
**And** there is no audio overlap or glitching during the switch

### Story 2.2: Scene Photography & Complete Soundscape Assets

As a user,
I want to see a scene photograph when exploring a soundscape,
So that I feel transported to the real Taiwan location.

**Acceptance Criteria:**

**Given** the user has selected an unlocked location
**When** the soundscape is playing
**Then** a scene photograph for that location is displayed in the `LocationDetail` panel (FR9)
**And** the location name is shown alongside the photograph

**Given** the prototype requires 3 complete soundscapes
**When** the user explores each unlocked location
**Then** 淡水河夕陽 displays a unique river/sunset scene photo with water/harbor ambient audio (FR14, FR16)
**And** 阿里山雲海 displays a unique mountain/cloud scene photo with forest/insect ambient audio (FR14, FR16)
**And** 基隆港浪 displays a unique harbor/wave scene photo with ocean wave ambient audio (FR14, FR16)

**Given** the user switches between unlocked locations
**When** a new location is selected
**Then** the scene photograph updates to match the newly selected location
**And** audio files are sourced as local mp3 in `public/audio/` and photos as jpg in `public/images/`

## Epic 3: Unlock System & Gamification Display

Users can click locked locations to discover the gamification mechanic — warm unlock condition prompts communicate "collect Taiwan's sounds by sleeping well", differentiating this from a standard white noise player and demonstrating the commercial moat.

### Story 3.1: Locked Location Interaction & Unlock Condition Display

As a user,
I want to click a locked location and see its unlock condition in warm language,
So that I understand the gamification mechanic and feel motivated to "collect Taiwan's sounds by sleeping well."

**Acceptance Criteria:**

**Given** the map displays locked location markers
**When** the user views the locked locations
**Then** each locked location shows a visible lock indicator distinguishing it from unlocked locations (FR11)

**Given** a locked location is visible on the map
**When** the user clicks a locked location (e.g., 蘭嶼飛魚季)
**Then** a `LockOverlay` modal/panel appears displaying the location name and its specific unlock condition (FR4, FR12)
**And** the overlay can be dismissed by the user

**Given** unlock conditions are displayed
**When** the user reads the unlock condition text
**Then** the language is warm and positive (e.g., "連續好眠 14 天，解鎖這片海洋") with no countdowns, no punishment framing, and no anxiety-inducing language (FR13)

**Given** the prototype has 7 locked locations
**When** the user clicks each locked location in sequence
**Then** all 7 locations display their unique name and unlock condition prompt (FR15):
- 蘭嶼飛魚季 (Lanyu Flying Fish Festival)
- 太魯閣溪流 (Taroko Gorge Stream)
- 日月潭晨曦 (Sun Moon Lake Dawn)
- 墾丁星空 (Kenting Starry Sky)
- 合歡山銀河 (Hehuan Mountain Milky Way)
- 台東稻浪 (Taitung Rice Waves)
- 玉山頂風聲 (Jade Mountain Summit Wind)

## Epic 4: Visual Polish & Presentation Quality

The complete experience reaches presentation-grade quality with fluid glow animations on unlocked markers, polished dimmed states with lock icons on locked markers, and smooth visual transitions when selecting locations — ready for stage demo.

### Story 4.1: Location Marker Animations & Visual States

As a user,
I want to see animated glow effects on unlocked locations and polished lock icons on locked locations,
So that the map feels alive and the visual quality reaches presentation-grade.

**Acceptance Criteria:**

**Given** the map displays unlocked location markers
**When** the page is loaded and idle
**Then** unlocked markers display a continuous soft glow pulse animation using Motion (FR18)
**And** the glow effect conveys warmth and invites interaction

**Given** the map displays locked location markers
**When** the user views the locked locations
**Then** locked markers appear in a dimmed/muted visual state with a visible lock icon overlay (FR19)
**And** the contrast between unlocked (glowing) and locked (dimmed + icon) is immediately obvious

**Given** the glow animations are running
**When** the user interacts with the map (hover, click)
**Then** animations do not interfere with click targets or cause visual jank

### Story 4.2: Transition Polish & Performance Validation

As a user,
I want smooth visual transitions when selecting locations and a fast, responsive experience,
So that the demo feels professional and fluid on stage.

**Acceptance Criteria:**

**Given** the user clicks a location (unlocked or locked)
**When** the corresponding panel (LocationDetail or LockOverlay) appears
**Then** the panel animates in with a smooth Motion transition (fade, slide, or scale) (FR20)
**And** dismissing the panel also uses a smooth exit animation

**Given** the prototype is loaded in Chrome (latest)
**When** the page loads on a standard broadband connection
**Then** the map renders within 2 seconds (NFR1)
**And** clicking an unlocked location starts audio within 500ms (NFR2)
**And** SVG map hover and click interactions respond at 60fps with no visible lag (NFR3)

**Given** the user switches between locations
**When** audio and visuals transition
**Then** there is no audio glitching or visual stutter during the switch (NFR4)
**And** scene photographs load within 1 second of selection (NFR5)

**Given** the prototype must work across browsers
**When** the full experience is tested in Chrome (latest) and Safari (latest)
**Then** all features function correctly in both browsers (NFR6, NFR7)

## Epic 5: Sleep Assessment & App Navigation

Users complete a 5-question sleep assessment on first visit, discover their personalized sleep type (入睡困難型/淺眠易醒型/焦慮思緒型), and enter a tabbed app with three sections — Tonight, Explore (existing map), and My Journey — establishing the "sleep coach" concept and transforming the prototype from a sound map into a personalized sleep solution.

### Story 5.1: Tab Navigation & App Shell Restructure

As a user,
I want to navigate between Tonight, Explore, and My Journey tabs,
So that I can access different sections of the sleep coach app.

**Acceptance Criteria:**

**Given** Phase 1 is complete with fullscreen map experience
**When** the app shell is restructured for Phase 2
**Then** App.tsx adds Phase 2 state: `activeTab` (Tab), `onboardingComplete` (boolean), `sleepType` (SleepType | null), `showProductStory` (boolean)
**And** `types/index.ts` is extended with `Tab`, `SleepType`, `SleepQuestion`, `SleepOption`, `Prescription`, `JourneyStats` types

**Given** the user has completed onboarding (onboardingComplete = true)
**When** the user views the app
**Then** a bottom `TabBar` component is visible with three tabs: 今晚 (Tonight), 探索 (Explore), 我的 (My Journey) (FR21)
**And** the active tab has a visual indicator distinguishing it from inactive tabs (FR22)

**Given** the TabBar is visible
**When** the user taps a different tab
**Then** the view switches to the selected tab's content using `AnimatePresence mode="wait"` (fade transition)
**And** the Explore tab displays the existing Phase 1 map experience (TaiwanMap + LocationDot + LocationDetail + LockOverlay + SoundscapePlayer)
**And** Tonight and My Journey tabs display placeholder content (to be replaced in Epics 6 and 7)

**Given** the user has NOT completed onboarding (onboardingComplete = false)
**When** the user opens the app
**Then** the TabBar is NOT visible (FR23)
**And** the full screen is available for the onboarding flow (implemented in Story 5.2)

**Given** a soundscape is playing on the Explore tab
**When** the TabBar is visible
**Then** `SoundscapePlayer` is positioned at `bottom-16` (above TabBar) with `z-30`
**And** TabBar is at `z-40`, always on top of the player

### Story 5.2: Sleep Assessment Questionnaire & Type Result

As a user,
I want to answer a sleep assessment and discover my personalized sleep type,
So that I understand my sleep challenge and receive a tailored plan.

**Acceptance Criteria:**

**Given** the user opens the app for the first time (onboardingComplete = false)
**When** the app loads
**Then** a fullscreen `SleepAssessment` component is displayed (FR24)
**And** no TabBar is visible

**Given** the SleepAssessment is displayed
**When** the user sees the first question
**Then** one question is shown at a time with a progress indicator (e.g., "1 / 5") (FR25)
**And** each question offers 3-4 multiple-choice options (FR26)
**And** the user must select one option to proceed to the next question

**Given** the user is on question 2 or later
**When** the user wants to change a previous answer
**Then** a back button allows navigating to the previous question (FR27)
**And** the previously selected answer is preserved

**Given** the questionnaire uses data from `data/sleep.ts`
**When** the developer inspects the data file
**Then** `SleepQuestion[]` contains 5 questions with id, question text, and `SleepOption[]` per question
**And** each `SleepOption` has label, value, and `weight: Partial<Record<SleepType, number>>`
**And** questions and option text are in Traditional Chinese per PRD spec (Q1-Q5)

**Given** the user has answered all 5 questions
**When** the system calculates the sleep type (FR28)
**Then** weighted scores are summed per sleep type using a `reduce` over the answers array
**And** the sleep type with the highest total score is selected

**Given** the sleep type is determined
**When** the result page appears
**Then** the user sees: type name (e.g., "入睡困難型"), brief description, recommended approach summary, and a "開始我的計畫" (Start My Plan) button (FR29)
**And** the result is one of 3 possible types: 入睡困難型, 淺眠易醒型, 焦慮思緒型 (FR30)

**Given** the result page is displayed
**When** the user taps "開始我的計畫"
**Then** `onComplete(sleepType)` is called, App.tsx sets `onboardingComplete = true`, stores `sleepType`, and sets `activeTab = 'tonight'` (FR31)
**And** the TabBar appears and the Tonight tab content is visible

**Given** the onboarding uses animations
**When** the user navigates between questions
**Then** questions transition with a horizontal slide animation (per Architecture animation patterns)

## Epic 6: Tonight Sleep Prescription Homepage

Users see their personalized "Tonight" sleep prescription with a plan progress bar, breathing exercise card, soundscape recommendation card, and coach tip — all content varying by sleep type. Tapping the soundscape recommendation navigates to the Explore tab and auto-plays the recommended location's audio, seamlessly connecting the sleep coach with the sound map.

### Story 6.1: Tonight Sleep Prescription Homepage

As a user,
I want to see my personalized sleep prescription for tonight,
So that I know exactly what breathing exercise and soundscape to use before bed.

**Acceptance Criteria:**

**Given** the user has completed onboarding with a determined sleep type
**When** the user views the Tonight tab
**Then** a `TonightPage` component displays with the user's personalized plan

**Given** TonightPage is displayed
**When** the user views the top section
**Then** a plan progress bar shows: plan name (e.g., "入睡困難急救包"), current day (e.g., "第 5 天"), total days (e.g., "共 7 天"), and a visual percentage indicator (FR32)

**Given** TonightPage is displayed
**When** the user views the prescription cards
**Then** a breathing exercise `PrescriptionCard` (type='breathing') displays: exercise name (e.g., "4-7-8 呼吸法"), duration (e.g., "3 分鐘"), and expert name (e.g., "江醫師引導") (FR33)
**And** the breathing card is display-only — tapping shows a static info overlay, no interactive animation

**Given** TonightPage is displayed
**When** the user views the soundscape prescription card
**Then** a soundscape `PrescriptionCard` (type='soundscape') displays a recommended location from the map (e.g., "淡水河夕陽 · 舒緩水聲") (FR34)

**Given** the soundscape recommendation card is displayed
**When** the user taps the soundscape card
**Then** App.tsx executes: `setActiveTab('explore')`, `setSelectedLocationId(locationId)`, `audioPlayer.play(location.audioPath)` (FR35)
**And** the Explore tab activates with the recommended location selected and audio playing

**Given** TonightPage is displayed
**When** the user scrolls to the bottom
**Then** a coach tip message is visible (e.g., "今天試著比昨天早 15 分鐘上床") (FR36)

**Given** the user's sleep type is one of 3 types
**When** the prescription content is loaded from `data/sleep.ts`
**Then** the plan name, breathing exercise, soundscape recommendation, and coach tip all vary based on the determined sleep type (FR37)
**And** `data/sleep.ts` contains 3 complete `Prescription` variants — one per sleep type

## Epic 7: My Journey & Collection Progress

Users track their sleep journey progress with cumulative achievement stats, positive reinforcement messaging, and plan progress on the My Journey tab. The Explore tab gains a collection progress indicator and unlock hints that connect soundscape collection to the sleep plan, reinforcing the "collect Taiwan's sounds by sleeping well" narrative.

### Story 7.1: My Journey Achievement Page

As a user,
I want to see my cumulative sleep journey stats and encouragement,
So that I feel motivated by my progress and want to continue.

**Acceptance Criteria:**

**Given** the user has completed onboarding and has a sleep type
**When** the user navigates to the My Journey tab
**Then** a `MyJourneyPage` component displays with achievement stats and progress

**Given** MyJourneyPage is displayed
**When** the user views the stats section
**Then** cumulative stats are visible: completed sessions (e.g., 12), longest streak (e.g., 5 days), unlocked soundscapes (e.g., 5) (FR38)
**And** all values are hardcoded from `data/sleep.ts` `JourneyStats`

**Given** MyJourneyPage is displayed
**When** the user views the reinforcement section
**Then** a positive reinforcement message is visible (e.g., "你連續 3 天在 11 點前開始準備睡覺，這是很棒的習慣！") (FR39)
**And** the message highlights a recent behavior pattern using warm, encouraging language

**Given** MyJourneyPage is displayed
**When** the user views the progress section
**Then** the current plan progress is displayed, consistent with the Tonight tab progress bar (same plan name, day, total days) (FR40)

### Story 7.2: Map Collection Progress & Unlock Hints

As a user,
I want to see my soundscape collection progress and know how to unlock more,
So that I understand the connection between my sleep plan and collecting Taiwan's sounds.

**Acceptance Criteria:**

**Given** the user is on the Explore tab with the map visible
**When** the map area loads
**Then** a `CollectionProgress` component is displayed above the map showing "已收集 3/10 個台灣聲景" (FR41)
**And** the count reflects the number of unlocked locations (3) out of total locations (10)

**Given** the CollectionProgress is visible
**When** the user reads the hint text below the count
**Then** a hint message links a locked location to the sleep plan (e.g., "完成「入睡困難急救包」即可解鎖：台東稻田") (FR42)
**And** the hint text varies based on the user's sleep type (referencing the active plan name from `data/sleep.ts`)

## Epic 8: Product Story

Users access a dedicated Product Story page presenting the product vision, competitive landscape, target audience, design philosophy, differentiation moat, and product roadmap — an embedded pitch that demonstrates deep product thinking to competition judges.

### Story 8.1: Product Story Page

As a user (competition judge),
I want to read the product's vision, competitive positioning, and design philosophy,
So that I understand the depth of product thinking behind this prototype.

**Acceptance Criteria:**

**Given** the user is in the tabbed app (onboarding complete)
**When** the user taps an info icon in the app header
**Then** a `ProductStory` component slides up as a fullscreen overlay (FR43)
**And** if MyJourneyPage exists (Epic 7), a link/button there also opens ProductStory

**Given** ProductStory is displayed
**When** the user reads the content
**Then** the page presents six content sections: product vision, competitive landscape, target audience, design philosophy, differentiation moat, and product roadmap (FR44)

**Given** ProductStory has content
**When** the user scrolls through the page
**Then** each section has a clear heading, readable body text (minimum 16px equivalent), and visual hierarchy distinguishing headings from body content (FR45)
**And** the total content is completable in under 3 minutes of reading
**And** the page uses Tailwind typography utilities consistent with the dark theme

**Given** the user is viewing ProductStory
**When** the user taps the close/back button
**Then** the overlay dismisses (slide-down animation) and the user returns to the previous view (FR46)
**And** App.tsx sets `showProductStory = false`

**Given** ProductStory renders as an overlay
**When** it is visible
**Then** it renders above all tab content and TabBar (highest z-index)
**And** the underlying tab state is preserved (no reset on close)
