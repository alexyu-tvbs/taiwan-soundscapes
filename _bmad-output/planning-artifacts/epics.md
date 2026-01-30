---
stepsCompleted:
  - step-01-validate-prerequisites
  - step-02-design-epics
  - step-03-create-stories
  - step-04-final-validation
status: complete
completedAt: '2026-01-30'
inputDocuments:
  - _bmad-output/planning-artifacts/prd.md
  - _bmad-output/planning-artifacts/architecture.md
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
FR13: User can see unlock conditions presented in warm, positive language (no countdowns, no punishment framing)
FR14: System displays 3 unlocked locations with full audio and imagery: 淡水河夕陽, 阿里山雲海, 基隆港浪
FR15: System displays 7 locked locations with names and unlock prompts: 蘭嶼飛魚季, 太魯閣溪流, 日月潭晨曦, 墾丁星空, 合歡山銀河, 台東稻浪, 玉山頂風聲
FR16: Each unlocked location has a unique audio source and scene photograph
FR17: System presents a dark-themed interface as the default visual style
FR18: Unlocked location markers display a glow animation effect
FR19: Locked location markers display a dimmed/muted visual state with lock icon
FR20: User can see a smooth visual transition when selecting a location

### NonFunctional Requirements

NFR1: Map page loads and renders within 2 seconds on standard broadband connection
NFR2: Audio playback begins within 500ms of clicking an unlocked location
NFR3: SVG map interactions (hover, click) respond at 60fps with no visible lag
NFR4: Switching between locations transitions smoothly without audio glitching or visual stutter
NFR5: Scene photographs load within 1 second of location selection (acceptable to lazy-load)
NFR6: All features function correctly in Chrome (latest) as the primary demo browser
NFR7: All features function correctly in Safari (latest) as secondary browser

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
