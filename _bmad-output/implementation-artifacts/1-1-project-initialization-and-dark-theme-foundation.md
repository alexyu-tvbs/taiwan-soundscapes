# Story 1.1: Project Initialization & Dark Theme Foundation

Status: review

## Story

As a developer,
I want to initialize the project with the correct tech stack and dark theme,
So that the development environment is ready and the visual foundation matches the "好眠秘境" dark atmosphere.

## Acceptance Criteria

1. **Given** the project does not yet exist **When** the developer runs the initialization commands **Then** a new Vite + React + TypeScript project is created with Tailwind CSS v4 (`@tailwindcss/vite` plugin) and Motion 12.x installed **And** the directory structure contains `src/components/`, `src/hooks/`, `src/data/`, `src/types/`

2. **Given** the project is initialized **When** the developer runs `npm run dev` and opens the page **Then** the page displays a deep navy/charcoal dark-themed background as the default visual style (FR17) **And** Tailwind CSS utilities are functional in JSX

3. **Given** the project needs a location data model **When** the developer inspects `src/types/index.ts` and `src/data/locations.ts` **Then** TypeScript types define `Location` with fields: id, name (zh/en), coordinates (x, y), status ('unlocked' | 'locked'), audioPath, imagePath, unlockCondition **And** `locations.ts` contains all 10 locations with correct status (3 unlocked, 7 locked) using `as const`

## Tasks / Subtasks

- [x] Task 1: Initialize Vite + React + TypeScript project (AC: #1)
  - [x] 1.1 Run `npm create vite@latest taiwan-soundscapes -- --template react-ts` in the project root's parent directory, then move contents to project root (or init in place if empty)
  - [x] 1.2 Run `npm install`
  - [x] 1.3 Run `npm install tailwindcss @tailwindcss/vite`
  - [x] 1.4 Run `npm install motion`
  - [x] 1.5 Create directory structure: `src/components/`, `src/hooks/`, `src/data/`, `src/types/`
  - [x] 1.6 Verify `npm run dev` starts without errors

- [x] Task 2: Configure Tailwind CSS v4 + Dark Theme (AC: #2)
  - [x] 2.1 Add `@tailwindcss/vite` plugin to `vite.config.ts`
  - [x] 2.2 Replace `src/index.css` contents with `@import "tailwindcss";`
  - [x] 2.3 Set dark background on root element in `App.tsx` using Tailwind: `bg-slate-900 text-white min-h-screen`
  - [x] 2.4 Remove all Vite default boilerplate (logos, counter, default styles)
  - [x] 2.5 Verify dark theme renders correctly in browser

- [x] Task 3: Create TypeScript types (AC: #3)
  - [x] 3.1 Create `src/types/index.ts` with `Location` type and `LocationStatus` type
  - [x] 3.2 Location type fields: `id: string`, `name: string`, `nameEn: string`, `coordinates: { x: number, y: number }`, `status: LocationStatus`, `audioPath: string`, `imagePath: string`, `unlockCondition: string`
  - [x] 3.3 LocationStatus: `'unlocked' | 'locked'`

- [x] Task 4: Create location data constants (AC: #3)
  - [x] 4.1 Create `src/data/locations.ts` with typed array of all 10 locations using `as const` assertion
  - [x] 4.2 3 unlocked locations: 淡水河夕陽 (tamsui), 阿里山雲海 (alishan), 基隆港浪 (keelung)
  - [x] 4.3 7 locked locations: 蘭嶼飛魚季, 太魯閣溪流, 日月潭晨曦, 墾丁星空, 合歡山銀河, 台東稻浪, 玉山頂風聲
  - [x] 4.4 Audio paths: `/audio/{id}.mp3`, image paths: `/images/{id}.jpg`
  - [x] 4.5 SVG coordinates: Use placeholder values (will be refined in Story 1.2 when the SVG map is integrated)
  - [x] 4.6 Unlock conditions: Warm, positive zh-tw language (e.g., "連續好眠 14 天，解鎖這片海洋")

## Dev Notes

### Critical Implementation Rules

**Tailwind CSS v4 (NOT v3) — Most Common Mistake:**
- CSS entry: `@import "tailwindcss"` — do NOT use `@tailwind base/components/utilities`
- Vite plugin: `@tailwindcss/vite` in `vite.config.ts` — NO PostCSS config needed
- NO `tailwind.config.js` file — v4 uses CSS-first configuration
- NO `@apply` directive — use utility classes inline in JSX

**Motion (NOT Framer Motion):**
- Package name: `motion` (not `framer-motion`)
- Import: `import { motion, AnimatePresence } from "motion/react"`
- Installed in this story but not used until later stories

**React Patterns:**
- Components: Arrow function + named export (`export const Foo = () => {}`)
- Props: Separate `interface FooProps {}`, no `I` prefix
- State owner: App.tsx only — all children are presentational
- State passing: Prop drilling only — NO Context, NO Redux, NO Zustand

**Vite Config Example:**
```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

**index.css Content (entire file):**
```css
@import "tailwindcss";
```

**Asset Path Rules:**
- Audio: `public/audio/*.mp3` — referenced as `/audio/tamsui.mp3` (absolute path string)
- Images: `public/images/*.jpg` — referenced as `/images/tamsui.jpg`
- NEVER import media files via ES module — always use public/ path strings

**File Naming Conventions:**
- Components: PascalCase (`TaiwanMap.tsx`)
- Hooks: camelCase with `use` prefix (`useAudioPlayer.ts`)
- Data/types: camelCase (`locations.ts`)
- Assets: kebab-case or simple lowercase (`tamsui.mp3`)

**Dark Theme Palette:**
- Background: `bg-slate-900`
- Text: `text-white`
- Glow effects (future stories): warm amber/gold tones via CSS box-shadow or SVG filter

### Location Data Reference

| # | Name (zh) | Name (en) | ID | Status | Unlock Condition |
|---|-----------|-----------|-----|--------|------------------|
| 1 | 淡水河夕陽 | Tamsui River Sunset | tamsui | unlocked | — |
| 2 | 阿里山雲海 | Alishan Sea of Clouds | alishan | unlocked | — |
| 3 | 基隆港浪 | Keelung Harbor Waves | keelung | unlocked | — |
| 4 | 蘭嶼飛魚季 | Lanyu Flying Fish Festival | lanyu | locked | 連續好眠 14 天，解鎖這片海洋 |
| 5 | 太魯閣溪流 | Taroko Gorge Stream | taroko | locked | 好眠 21 天，走進太魯閣的溪谷 |
| 6 | 日月潭晨曦 | Sun Moon Lake Dawn | sunmoonlake | locked | 累積好眠 30 晚，迎接日月潭的第一道光 |
| 7 | 墾丁星空 | Kenting Starry Sky | kenting | locked | 連續好眠 7 天，仰望墾丁的星空 |
| 8 | 合歡山銀河 | Hehuan Mountain Milky Way | hehuan | locked | 好眠 45 天，在合歡山遇見銀河 |
| 9 | 台東稻浪 | Taitung Rice Waves | taitung | locked | 連續好眠 10 天，聆聽稻浪的聲音 |
| 10 | 玉山頂風聲 | Jade Mountain Summit Wind | yushan | locked | 累積好眠 60 晚，攻頂玉山聽風 |

### Project Structure Notes

Target directory structure after this story:
```
taiwan-soundscapes/
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts              # React + @tailwindcss/vite plugins
├── .gitignore
├── .nvmrc                      # Node.js version pinning
├── index.html
├── src/
│   ├── main.tsx
│   ├── App.tsx                 # Dark bg-slate-900 root, minimal placeholder
│   ├── index.css               # @import "tailwindcss" ONLY
│   ├── components/             # Empty, ready for Story 1.2
│   ├── hooks/                  # Empty, ready for Story 2.1
│   ├── data/
│   │   └── locations.ts        # 10 locations typed as const
│   └── types/
│       └── index.ts            # Location, LocationStatus types
└── public/
    ├── audio/                  # Empty, placeholder for mp3 files
    └── images/                 # Empty, placeholder for jpg files
```

### What This Story Does NOT Include

- No SVG map (Story 1.2)
- No components other than App.tsx shell
- No audio playback (Story 2.1)
- No Motion animations (Story 4.1)
- No lock overlay (Story 3.1)
- Coordinates in locations.ts are placeholders — exact SVG coordinates determined in Story 1.2

### References

- [Source: _bmad-output/planning-artifacts/architecture.md#Starter Template Evaluation] — Initialization commands and Tailwind v4 setup
- [Source: _bmad-output/planning-artifacts/architecture.md#Implementation Patterns & Consistency Rules] — Naming, component, and state patterns
- [Source: _bmad-output/planning-artifacts/architecture.md#Project Directory Structure] — Complete file tree
- [Source: _bmad-output/planning-artifacts/prd.md#Project Scope & Location Plan] — 10 location details and status
- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.1] — Acceptance criteria and user story
- [Source: _bmad-output/project-context.md] — Critical implementation rules (Tailwind v4, Motion, React patterns)

## Dev Agent Record

### Agent Model Used
Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References
- Node.js version warning (20.18.3 vs required 20.19+) — does not block build or dev; .nvmrc added for team alignment

### Completion Notes List
- Initialized Vite + React + TypeScript project from `create-vite@8.2.0` template `react-ts`
- Installed `tailwindcss@^4.1.18`, `@tailwindcss/vite@^4.1.18`, `motion@^12.29.2`
- Configured `vite.config.ts` with `@tailwindcss/vite` plugin per Tailwind v4 spec
- Replaced `index.css` with `@import "tailwindcss"` only (v4 pattern)
- Created `App.tsx` with `bg-slate-900 text-white min-h-screen` dark theme root
- Removed all Vite boilerplate (App.css, assets/, vite.svg)
- Created `src/types/index.ts` with `Location` interface and `LocationStatus` type
- Created `src/data/locations.ts` with 10 locations (3 unlocked, 7 locked), `as const` assertion
- Created directory structure: `src/components/`, `src/hooks/`, `public/audio/`, `public/images/`
- Added `.nvmrc` (20.19.0) and `engines` field in package.json per user request
- Fixed package name from `taiwan-soundscapes-init` to `taiwan-soundscapes`
- All validations passed: `tsc -b` (zero errors), `vite build` (success), `eslint .` (zero errors)

### Change Log
- 2026-01-30: Story 1.1 implemented — Project initialized with Vite + React + TS, Tailwind v4, Motion, dark theme, types, and location data

### File List
- package.json (modified — name, engines added)
- .nvmrc (new)
- .gitignore (new)
- vite.config.ts (modified — added tailwindcss plugin)
- tsconfig.json (from template)
- tsconfig.app.json (from template)
- tsconfig.node.json (from template)
- eslint.config.js (from template)
- index.html (from template)
- src/main.tsx (from template)
- src/App.tsx (modified — dark theme, boilerplate removed)
- src/index.css (modified — Tailwind v4 import only)
- src/vite-env.d.ts (from template)
- src/types/index.ts (new)
- src/data/locations.ts (new)
- src/components/ (new, empty)
- src/hooks/ (new, empty)
- public/audio/ (new, empty)
- public/images/ (new, empty)
