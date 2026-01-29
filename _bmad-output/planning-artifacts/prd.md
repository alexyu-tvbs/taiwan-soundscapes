---
stepsCompleted:
  - step-01-init
  - step-02-discovery
  - step-03-success
  - step-04-journeys
  - step-05-domain-skipped
  - step-06-innovation
  - step-07-project-type
  - step-08-scoping
  - step-09-functional
  - step-10-nonfunctional
  - step-11-polish
  - step-12-complete
inputDocuments:
  - _bmad-output/analysis/brainstorming-session-2026-01-21.md
  - _bmad-output/analysis/sleep-ideas-formatted-2026-01-25.md
  - _bmad-output/analysis/sleep-top5-feature-specs-2026-01-25.md
documentCounts:
  briefs: 0
  research: 0
  brainstorming: 1
  projectDocs: 0
  analysis: 3
workflowType: 'prd'
classification:
  projectType: web_app
  domain: general
  complexity: low
  projectContext: greenfield
  competitionContext: true
  timeConstraint: 1-week
  prototypeOnly: true
---

# Product Requirements Document - Taiwan Soundscapes

**Author:** Alex Yu **Date:** 2026-01-29

## Executive Summary

Taiwan Soundscapes (好眠秘境) is a web-based prototype for the internal "好眠服務 Prototype 提案大賽" competition. It reimagines white noise as a "sound journey across Taiwan" — replacing the conventional playlist UI with an interactive Taiwan map where users explore real locations and hear their soundscapes.

**Core Concept:** An interactive SVG Taiwan map where glowing locations play unique audio soundscapes paired with scene photography. Locked locations demonstrate a gamification mechanic — users unlock hidden soundscapes by maintaining good sleep habits. The design deliberately inverts industry anxiety patterns: no countdowns, no punishment, only warm encouragement.

**Goal:** Selected into Top 3 by judge Gaod for IP proposal. The prototype itself is the pitch — no additional explanation needed.

**Constraints:** 1 person (Alex Yu) + AI tools, 1 week, web-only, free/placeholder assets.

## Success Criteria

### User Success

- Users understand "this is a Taiwan sound journey" within the first 30 seconds of opening the prototype
- Clicking a map location triggers a delightful "wow, I can hear this place" surprise moment
- Free soundscapes are freely explorable; locked locations intuitively communicate "I want to unlock more"
- The overall experience feels like "sound travel", not "white noise player"

### Business Success (Competition-Oriented)

- Selected into **Top 3** by judge Gaod for IP proposal
- Judge understands three things within **1 minute**: creative concept, visual quality, commercial moat (Taiwan local = impossible for international brands to replicate)
- The prototype itself is the best pitch — no additional explanation needed to convince

### Technical Success (Prototype Standard)

- Web page runs smoothly in browser, no installation required
- Audio playback works correctly with visual feedback
- Map interactions are fluid and visual polish reaches presentation-grade quality

### Measurable Outcomes

- All core interactions (explore + unlock) are functional
- At least 3 explorable soundscapes + 7 locked locations demonstrated
- Visual quality reaches "ready to demo on stage" level

## User Journeys

### Journey 1: Demo Explorer — Xiao Xun (Colleague/Audience)

**Scenario:** Xiao Xun is a colleague sitting in the conference room watching each contestant's Prototype demo. After several presentations, it's Alex's turn.

**Opening Scene:**
Xiao Xun opens the link on her laptop and sees a Taiwan map emerging against a dark background, with several locations glowing softly. The header reads "好眠秘境 — 用耳朵旅行台灣" (Sleep Sanctuary — Travel Taiwan with Your Ears). She thinks: "This looks different from a typical white noise app."

**Rising Action:**
She clicks the glowing "淡水河夕陽" (Tamsui River Sunset) location. The view transitions to a riverside sunset photo as gentle water sounds and distant boat horns fill her headphones. She feels transported to the Tamsui riverbank. She then clicks "阿里山雲海" (Alishan Sea of Clouds) — insect chirps and morning forest sounds play alongside a cloud-sea photograph.

**Climax:**
She notices some map locations are dimmed with lock icons. Curious, she clicks "蘭嶼飛魚季" (Lanyu Flying Fish Festival). A gentle prompt appears: "連續好眠 14 天，解鎖這片海洋" (14 consecutive good sleep nights to unlock this ocean). The realization hits — this isn't just a player; it's a system for "collecting Taiwan's sounds by sleeping well."

**Resolution:**
After the demo ends, Xiao Xun reopens the webpage on her own and listens to every glowing location. She messages the group chat: "I liked Alex's the best — that Taiwan map is stunning."

### Journey 2: Judge Gaod — Evaluation Perspective

**Scenario:** Gaod is evaluating all contestants' Prototypes today, scoring each one. He values creativity, visual presentation, and commercial potential. He's already seen several decent proposals.

**Opening Scene:**
Gaod opens Alex's Prototype link. A dark-themed Taiwan map appears with locations marked by soft glowing dots. First impression: "Visual quality is solid — this looks different from the others."

**Rising Action:**
He clicks a glowing location; a soundscape begins playing with an accompanying scene photo. He clicks another — different sound, different scenery. The concept forms in his mind: "This uses Taiwan's local sounds as white noise." He notices some locations are locked; clicking them reveals unlock conditions. The gamification mechanic becomes clear.

**Climax:**
Gaod runs his mental evaluation: "Creativity — Taiwan map plus sound travel, this concept has a hook. Visual — the map presentation exceeds typical prototype quality. Commercial — Taiwan-local content is a moat that international brands cannot replicate, and the unlock mechanic drives user retention."

**Resolution:**
He places Taiwan Soundscapes in his Top 3 shortlist. During final selection, he writes: "Clear concept, polished visuals, complete business logic. Recommended for IP proposal."

### Journey Requirements Summary

| Capability | Source | Description |
|---|---|---|
| **Landing visual impact** | Journey 1 & 2 | Taiwan map + brand tagline visible on open, establish concept within 30 seconds |
| **Map interaction** | Journey 1 & 2 | Click location to trigger soundscape playback + scene image transition |
| **Soundscape player** | Journey 1 | Play, pause, volume control; background playback without interrupting exploration |
| **Unlock mechanic display** | Journey 1 & 2 | Locked locations show unlock conditions, communicate gamification concept |
| **Self-guided experience** | Journey 2 | No verbal explanation needed to understand the full concept (Gaod operates independently) |
| **Visual polish** | Journey 2 | Presentation-grade quality: dark theme + soft glow dots + scene photography |

## Innovation & Novel Patterns

### Detected Innovation Areas

**1. Category Redefinition: From Playlist to Sound Map**
Existing white noise products use a "select audio file → press play" UI paradigm. Taiwan Soundscapes flips the interaction model from "playlist" to "geographic exploration" — the map IS the interface, clicking a location IS selecting a track. This is not a feature improvement; it is a category redefinition.

**Prototype demonstration:** Opening the app reveals a Taiwan map (not an audio file list); all interactions revolve around the map.

**2. Local Culture × Health Behavior: An Irreplicable Moat**
Binding "Taiwan geographic identity" with "sleep habit formation" — collect Taiwan's sounds by sleeping well. This combination has no precedent in the global market: Calm does general meditation, Tide does nature sounds, but no one uses a "national cultural map" as the core product engine.

**Prototype demonstration:** All location names are real Taiwan destinations (Alishan, Lanyu, Taroko, etc.), paired with local scene photography so judges instantly recognize "this is Taiwan."

**3. Anti-Anxiety Gamification: Deliberately Inverting Industry Norms**
Industry convention uses scores, leaderboards, and countdown timers to drive behavior — often creating anxiety. Taiwan Soundscapes intentionally reverses this: no "X days remaining" display, no punishment for breaks, surprises are bonuses rather than requirements.

**Prototype demonstration:** Locked location prompts use warm, positive language ("14 consecutive good sleep nights to unlock this ocean") rather than countdowns or warnings.

### Validation Approach

The competition itself serves as the first round of validation:
- Does the judge understand "map = interface" category redefinition within 60 seconds?
- Does the judge feel the emotional connection and commercial moat of "Taiwan local"?
- Does the gentle unlock mechanic language make the judge feel "this is different from other apps"?

## Project Scope & Location Plan

### MVP Strategy

**Approach:** Experience MVP — demonstrate the core "Taiwan sound journey" experience through a functional web prototype that convinces judges within 60 seconds.

**Resource:** 1 person (Alex Yu) + AI tools, 1 week.

### MVP Feature Set (Phase 1 — Prototype)

**Core Journeys Supported:** Demo Explorer + Judge Evaluation

**Must-Have Capabilities (All P0):**

| # | Feature | Description |
|---|---|---|
| 1 | SVG Taiwan Map | Dark background + Taiwan outline + location markers |
| 2 | 3 Playable Soundscapes | Click glowing dot → audio playback + scene photo |
| 3 | 7 Locked Locations | Dimmed + lock icon + unlock condition prompt |
| 4 | Soundscape Player | Play/Pause/Volume controls |
| 5 | Brand Tagline | "好眠秘境 — 用耳朵旅行台灣" |
| 6 | Location State Visuals | Glowing (unlocked) vs dimmed (locked) |

**Location Plan (10 locations):**

| Status | Location | Asset Requirements |
|---|---|---|
| ✅ Unlocked | 淡水河夕陽 (Tamsui River Sunset) | Audio + photo |
| ✅ Unlocked | 阿里山雲海 (Alishan Sea of Clouds) | Audio + photo |
| ✅ Unlocked | 基隆港浪 (Keelung Harbor Waves) | Audio + photo |
| 🔒 Locked | 蘭嶼飛魚季 (Lanyu Flying Fish Festival) | Name + prompt only |
| 🔒 Locked | 太魯閣溪流 (Taroko Gorge Stream) | Name + prompt only |
| 🔒 Locked | 日月潭晨曦 (Sun Moon Lake Dawn) | Name + prompt only |
| 🔒 Locked | 墾丁星空 (Kenting Starry Sky) | Name + prompt only |
| 🔒 Locked | 合歡山銀河 (Hehuan Mountain Milky Way) | Name + prompt only |
| 🔒 Locked | 台東稻浪 (Taitung Rice Waves) | Name + prompt only |
| 🔒 Locked | 玉山頂風聲 (Jade Mountain Summit Wind) | Name + prompt only |

### Audio Asset Strategy

Audio sources for the prototype can use a flexible approach:
- **YouTube embeds** (via IFrame API with hidden player UI) for existing Taiwan nature sound videos
- **Free audio files** (Freesound.org, Pixabay, Mixkit) for direct browser playback
- **Mixed approach** is acceptable — prototype does not require uniform source; functionality demonstration is the priority

### Phase 2 (Add If Time Permits)

- Unlock celebration animation
- Soundscape story cards (location description + photo + story)
- Collection progress display ("3/10 locations collected")
- Background color gradient shifts by time of day

### Phase 3 (Out of Scope for Prototype)

- Real field recordings from actual Taiwan locations
- User accounts / data persistence
- Social sharing features
- Subscription payment system
- Mobile App version

## Functional Requirements

### Map Exploration

- **FR1:** User can view an interactive Taiwan map as the primary interface upon page load
- **FR2:** User can see location markers on the map, visually distinguished as unlocked (glowing) or locked (dimmed)
- **FR3:** User can click an unlocked location marker to select it and trigger its soundscape
- **FR4:** User can click a locked location marker to view its unlock condition
- **FR5:** User can see the brand tagline "好眠秘境 — 用耳朵旅行台灣" on the main interface

### Soundscape Playback

- **FR6:** User can hear audio playback when an unlocked location is selected
- **FR7:** User can pause and resume the currently playing soundscape
- **FR8:** User can adjust the volume of the playing soundscape
- **FR9:** User can see a scene photograph associated with the currently playing location
- **FR10:** User can switch between unlocked locations, stopping the previous soundscape and starting the new one

### Unlock System

- **FR11:** User can see a lock indicator on locations that are not yet unlocked
- **FR12:** User can view the specific unlock condition for each locked location (e.g., "連續好眠 14 天")
- **FR13:** User can see unlock conditions presented in warm, positive language (no countdowns, no punishment framing)

### Location Content

- **FR14:** System displays 3 unlocked locations with full audio and imagery: 淡水河夕陽, 阿里山雲海, 基隆港浪
- **FR15:** System displays 7 locked locations with names and unlock prompts: 蘭嶼飛魚季, 太魯閣溪流, 日月潭晨曦, 墾丁星空, 合歡山銀河, 台東稻浪, 玉山頂風聲
- **FR16:** Each unlocked location has a unique audio source and scene photograph

### Visual Experience

- **FR17:** System presents a dark-themed interface as the default visual style
- **FR18:** Unlocked location markers display a glow animation effect
- **FR19:** Locked location markers display a dimmed/muted visual state with lock icon
- **FR20:** User can see a smooth visual transition when selecting a location

## Non-Functional Requirements

### Performance

- **NFR1:** Map page loads and renders within 2 seconds on standard broadband connection
- **NFR2:** Audio playback begins within 500ms of clicking an unlocked location
- **NFR3:** SVG map interactions (hover, click) respond at 60fps with no visible lag
- **NFR4:** Switching between locations transitions smoothly without audio glitching or visual stutter
- **NFR5:** Scene photographs load within 1 second of location selection (acceptable to lazy-load)

### Browser Compatibility

- **NFR6:** All features function correctly in Chrome (latest) as the primary demo browser
- **NFR7:** All features function correctly in Safari (latest) as secondary browser

## Technical Architecture

### Tech Stack

- **Architecture:** SPA (Single Page Application)
- **Framework:** React + Vite
- **Styling:** Tailwind CSS
- **Animation:** Framer Motion
- **Map:** Custom SVG Taiwan map (not Mapbox/Leaflet — visual impact over geographic accuracy)
- **Audio:** HTML5 Audio API (sources: free audio files + optional YouTube embeds)
- **Deployment:** Vercel or Netlify (static SPA)

### Component Structure

| Component | Responsibility |
|---|---|
| `App` | Root layout, dark theme, global audio state |
| `TaiwanMap` | SVG map rendering, location dots, glow effects |
| `LocationDot` | Individual clickable location (unlocked/locked state) |
| `SoundscapePlayer` | Audio playback controls (play/pause/volume/fade-out) |
| `LocationDetail` | Scene photo + location name + description overlay |
| `LockOverlay` | Locked location prompt with unlock condition message |

### State Management

- React useState/useContext sufficient (no Redux needed)
- Track: current playing location, playback state, unlock states
- No persistence required (prototype resets on refresh)

### Implementation Considerations

- **SVG Map:** Use or create a simplified Taiwan outline SVG, position location dots with absolute coordinates
- **Audio:** Preload audio files for unlocked locations; locked locations don't need audio loaded
- **Dark Theme:** Tailwind `dark` class as default, deep navy/charcoal background
- **Glow Effects:** CSS `box-shadow` or SVG `filter` for location dot glow animation
- **Scene Photos:** Free stock photos from Unsplash/Pexels for Taiwan locations

## Risk Mitigation

| Risk Type | Risk | Mitigation |
|---|---|---|
| **Technical** | SVG map interaction not polished enough, fails to convey "category redefinition" | Prioritize map visuals — this is the first impression |
| **Technical** | Audio playback inconsistent across browsers | Pre-test Chrome + Safari; designate demo browser |
| **Content** | Placeholder audio sources reduce immersion | Select atmospheric free audio sources; pair with high-quality scene photography to compensate |
| **Market** | Concept not understood by judge | Brand tagline + self-guided UI lets concept speak for itself; locked location prompt copy must be clear |
| **Resource** | One week not enough for all features | Locked locations have zero audio cost; build core 3 soundscapes + map first, then polish |
