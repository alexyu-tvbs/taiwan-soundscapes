---
project_name: 'taiwan-soundscapes'
user_name: 'Alex Yu'
date: '2026-01-30'
sections_completed:
  - technology_stack
  - language_rules
  - framework_rules
  - code_quality
  - critical_rules
status: 'complete'
---

# Project Context for AI Agents

_Critical rules and patterns for taiwan-soundscapes. Focus on unobvious details._

---

## Technology Stack & Versions

- **Runtime:** Node.js 20.19+
- **Framework:** React 19 + TypeScript (strict mode)
- **Build:** Vite 7.x
- **Styling:** Tailwind CSS v4 via `@tailwindcss/vite` plugin — NO `tailwind.config.js`, NO `@tailwind` directives
- **Animation:** Motion 12.x (`import { motion } from "motion/react"`, NOT `framer-motion`)
- **Audio:** HTML5 Audio API only (no Web Audio API, no YouTube embed)
- **Deployment:** Vercel static SPA

## Critical Implementation Rules

### Tailwind CSS v4 (NOT v3)

- CSS entry: `@import "tailwindcss"` — do NOT use `@tailwind base/components/utilities`
- Vite plugin: `@tailwindcss/vite` in `vite.config.ts` — no PostCSS config needed
- No `tailwind.config.js` file — v4 uses CSS-first configuration
- No `@apply` directive — use utility classes inline in JSX

### Motion (NOT Framer Motion)

- Package name: `motion` (not `framer-motion`)
- Import: `import { motion, AnimatePresence } from "motion/react"`
- Can animate SVG elements directly (`motion.circle`, `motion.path`)
- Use for: glow pulse on LocationDot, transitions on LocationDetail, fade on LockOverlay

### React Patterns

- **Components:** Arrow function + named export (`export const Foo = () => {}`)
- **Props:** Separate `interface FooProps {}`, no `I` prefix
- **State owner:** App.tsx only — all children are presentational
- **State passing:** Prop drilling only — NO Context, NO Redux, NO Zustand
- **State updates:** Always immutable (`setState(prev => ...)`)
- **Hook location:** `useAudioPlayer` called in App.tsx only, values passed as props

### SVG Map Rules

- Source: SimpleMaps Taiwan SVG converted to inline React component
- Location markers are SVG child elements (`<circle>`) inside the map's `<svg>`
- Coordinates use SVG viewBox coordinate system — NOT CSS pixels
- Do NOT use CSS absolute positioning for markers on top of SVG

### Audio Management

- Single shared `HTMLAudioElement` — never create multiple Audio instances
- `useAudioPlayer` hook returns `{ play, pause, setVolume, isPlaying, currentTrack }`
- On location switch: stop current → load new → play (no crossfade)
- Audio load failure: `console.warn` + show default state, never throw

### Asset Rules

- Audio: `public/audio/*.mp3` — referenced as `/audio/tamsui.mp3` (absolute path)
- Images: `public/images/*.jpg` — referenced as `/images/tamsui.jpg`
- NEVER import media files via ES module — always use public/ path strings
- All assets local — no external CDN URLs

### File Naming

- Components: PascalCase (`TaiwanMap.tsx`)
- Hooks: camelCase with `use` prefix (`useAudioPlayer.ts`)
- Data/types: camelCase (`locations.ts`)
- Assets: kebab-case or simple lowercase (`tamsui.mp3`, `alishan.jpg`)

### Data Architecture

- All location data in `src/data/locations.ts` as typed `as const` array
- Each location: `{ id, name, nameEn, coordinates: {x, y}, status, audioPath, imagePath, unlockCondition }`
- Status is `'unlocked' | 'locked'` — no other states
- 3 unlocked + 7 locked = 10 total, hardcoded

### Dark Theme

- Dark background set on root element (body or root div)
- Use Tailwind dark palette: `bg-slate-900`, `text-white`, etc.
- Glow effects: CSS `box-shadow` or SVG `filter` with warm amber/gold tones
- Locked locations: `opacity-40` or similar dimming

### Critical Don't-Miss Rules

- **NO backend, NO API calls, NO fetch requests** — everything is static
- **NO data persistence** — prototype resets on every page refresh
- **NO user authentication** — no login, no accounts
- **NO responsive design required** — desktop-first, demo browser is Chrome
- **NO `tailwind.config.js`** — Tailwind v4 does not use this file
- **NO `framer-motion` import** — package is now `motion`
- **Browser targets:** Chrome (latest) primary, Safari (latest) secondary only
