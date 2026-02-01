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

**Phase 2 Expansion:** Building on the completed map prototype, Phase 2 elevates the product from "Taiwan sound map" to "sleep coach concept." A sleep assessment onboarding flow, a personalized "Tonight" homepage with sleep prescriptions, a progress-tracking "My Journey" tab, and a "Product Story" page are layered on top of the existing map experience. This transforms the demo narrative from showcasing a single feature to demonstrating a complete sleep solution with clear product thinking. All additions remain static frontend — no backend or data persistence required.

**Goal:** Selected into Top 3 by judge Gaod for IP proposal. The prototype itself is the pitch — no additional explanation needed.

**Constraints:** 1 person (Alex Yu) + AI tools, web-only, free/placeholder assets.

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

### Measurable Outcomes (Phase 1)

- All core interactions (explore + unlock) are functional
- At least 3 explorable soundscapes + 7 locked locations demonstrated
- Visual quality reaches "ready to demo on stage" level

### Phase 2 Success Criteria

**Perception Shift:**

- After the demo, the judge can articulate: "This is a sleep solution, not just a sound player"
- The onboarding questionnaire makes the judge feel "this app understands my sleep problem"
- The "Tonight" page communicates that the product delivers a personalized plan, not just content
- The "Product Story" page demonstrates deep product thinking and competitive awareness

**Functional Completeness:**

- Sleep questionnaire → type result → "Tonight" homepage flow works end-to-end
- Tab navigation between Tonight / Explore / My Journey is smooth and intuitive
- Clicking a soundscape recommendation on "Tonight" navigates to the map and plays the corresponding audio
- Product Story page clearly conveys the product vision, differentiation, and design philosophy

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

### Journey 3 (Phase 2): Sleep Coach Demo — Full Narrative Flow

**Scenario:** The same competition demo, but now the prototype tells a richer story. Alex presents the expanded version to Gaod and the audience.

**Act 1 — "This App Knows Me":**
Alex opens the prototype. Instead of jumping straight to the map, a sleep assessment appears: 5 simple questions about sleep habits. He fills them in. The result page appears: "You are the **Difficulty Falling Asleep** type — your mind races at bedtime, making it hard to wind down." Below: "We've prepared a 7-day rescue plan for you." He taps "Start My Plan." The audience leans in — this isn't a sound player.

**Act 2 — "Tonight's Prescription":**
The "Tonight" tab appears as the homepage. A progress bar shows "Day 5 of 7 — Sleep Difficulty Rescue Plan." Below, two prescription cards: a breathing exercise ("4-7-8 Breathing · 3 min · Dr. Jiang") and a soundscape recommendation ("Tamsui River Sunset · calming water sounds"). Alex taps the soundscape card — the app navigates to the Explore tab and begins playing the Tamsui soundscape on the map. The transition feels seamless: the coach prescribed it, the map delivers it.

**Act 3 — "I'm Making Progress":**
Alex switches to the "My Journey" tab. Cumulative stats appear: 12 completed sessions, 5-day streak, 5 soundscapes unlocked. A warm message reads: "You've been starting bedtime prep before 11 PM for 3 days — great habit forming!" The audience understands: this app tracks behavior, not sleep hours. No anxiety, only encouragement.

**Act 4 — "They've Thought This Through":**
Alex taps a "Product Story" link. A beautifully designed page unfolds — the product vision, competitive positioning, target audience, and design philosophy. It explains why this is a "sleep coach" not a "white noise player," how 健康 2.0 expert integration creates a moat, and why anti-anxiety design matters. Gaod thinks: "They haven't just built a prototype — they've done the product thinking."

**Resolution:**
Gaod's mental scorecard updates: "Phase 1 showed creative execution. Phase 2 shows product depth. This team understands what it takes to go from prototype to real product."

### Journey Requirements Summary

| Capability | Source | Phase | Description |
|---|---|---|---|
| **Landing visual impact** | Journey 1 & 2 | 1 | Taiwan map + brand tagline visible on open, establish concept within 30 seconds |
| **Map interaction** | Journey 1 & 2 | 1 | Click location to trigger soundscape playback + scene image transition |
| **Soundscape player** | Journey 1 | 1 | Play, pause, volume control; background playback without interrupting exploration |
| **Unlock mechanic display** | Journey 1 & 2 | 1 | Locked locations show unlock conditions, communicate gamification concept |
| **Self-guided experience** | Journey 2 | 1 | No verbal explanation needed to understand the full concept (Gaod operates independently) |
| **Visual polish** | Journey 2 | 1 | Presentation-grade quality: dark theme + soft glow dots + scene photography |
| **Sleep assessment onboarding** | Journey 3 | 2 | 5-question questionnaire → sleep type result → personalized plan entry |
| **Personalized "Tonight" homepage** | Journey 3 | 2 | Progress bar + prescription cards (breathing + soundscape) + coach tip |
| **Cross-tab navigation** | Journey 3 | 2 | Soundscape recommendation links directly to map playback on Explore tab |
| **Progress & achievements** | Journey 3 | 2 | "My Journey" tab showing cumulative stats and positive reinforcement |
| **Product Story page** | Journey 3 | 2 | Product vision, competitive positioning, design philosophy — embedded pitch |

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

### Phase 2 — Sleep Coach Concept Validation

**Objective:** Elevate the prototype from "Taiwan sound map" to "sleep coach with Taiwan soundscapes." All additions are static frontend — no backend, no data persistence. The purpose is to strengthen the competition demo narrative.

**Constraint:** Still a static SPA. Questionnaire results and progress data are not persisted (page refresh resets state). Branching logic is simple frontend conditionals, not a recommendation engine.

#### P2-1: Bottom Tab Navigation

| Tab | Label | Content |
|-----|-------|---------|
| Tab 1 | 今晚 (Tonight) | Sleep prescription homepage (new, default after onboarding) |
| Tab 2 | 探索 (Explore) | Existing Taiwan soundscape map (relocated from fullscreen) |
| Tab 3 | 我的 (My Journey) | Progress tracking and achievements (new) |

- Active tab has visual indicator
- Tab bar is persistent across all three views
- On first visit (before onboarding is completed), tabs are not shown; the questionnaire is fullscreen

#### P2-2: Sleep Assessment Questionnaire (Onboarding)

5-question flow presented on first visit:

| # | Question | Purpose |
|---|----------|---------|
| Q1 | 躺上床後多久能睡著？ | Assess sleep onset difficulty |
| Q2 | 晚上會醒來嗎？ | Assess sleep continuity |
| Q3 | 早上起床的感覺？ | Assess sleep quality |
| Q4 | 睡前腦袋的狀態？ | Assess pre-sleep anxiety |
| Q5 | 影響睡眠最大的因素？ | Determine prescription direction |

Each question has 3-4 multiple-choice options. UI is one question per screen with progress indicator.

**Branching logic:** Simple priority-based — the "most severe" answer determines the type. No complex scoring model.

#### P2-3: Sleep Type Result Page

3 possible results:

| Type | Trigger | Display |
|------|---------|---------|
| 入睡困難型 (Difficulty Falling Asleep) | Q1 answer indicates > 30 min | Breathing exercises + slow-rhythm soundscapes |
| 淺眠易醒型 (Light Sleeper) | Q2 answer indicates frequent waking | Continuous stable ambient sounds |
| 焦慮思緒型 (Anxious Mind) | Q4 answer indicates racing thoughts | Mindfulness guidance + nature soundscapes |

Result page shows: type name, brief description, recommended approach, and a "Start My Plan" CTA button.

#### P2-4: "Tonight" Homepage

Static prescription page displayed as Tab 1 after onboarding:

- **Plan progress bar:** "入睡困難急救包 — 第 5 天 / 共 7 天" (hardcoded)
- **Breathing exercise card:** Display-only card showing "4-7-8 呼吸法 · 3 分鐘 · 江醫師引導". Tapping shows a static info overlay (no interactive animation).
- **Soundscape recommendation card:** Shows a recommended location from the map. Tapping navigates to the Explore tab and auto-selects that location for playback.
- **Coach tip:** One-liner at the bottom (e.g., "今天試著比昨天早 15 分鐘上床")

The prescription content varies by sleep type result (3 variants of card content) but the layout is identical.

#### P2-5: "My Journey" Page

Static achievement display as Tab 3:

- Cumulative stats (hardcoded): completed sessions, longest streak, unlocked soundscapes
- Positive reinforcement message (e.g., "你連續 3 天在 11 點前開始準備睡覺，這是很棒的習慣！")
- Current plan progress (mirrors the progress bar from "Tonight")

#### P2-6: Existing Map Integration

- The existing fullscreen map moves into Tab 2 ("Explore")
- Add a collection progress indicator above the map: "已收集 3/10 個台灣聲景"
- Add a hint linking back to the sleep plan: "完成「入睡困難急救包」即可解鎖：台東稻田"
- All existing map functionality (location dots, audio playback, lock overlays) remains unchanged

#### P2-7: Product Story Page

A dedicated page (accessible via a link/button in the app — e.g., an info icon in the header or a section in "My Journey") that presents the product's concept and design thinking. Content drawn from the product discussion document:

- **Product Vision:** From "white noise player" to "sleep coach" — why this product exists
- **Competitive Landscape:** How this positions against Calm, Headspace, Tide, Endel — and what none of them do
- **Target Audience:** Who this is for and the core insight from 5 Whys analysis
- **Design Philosophy:** Anti-anxiety gamification, positive reinforcement, "track behavior not outcomes"
- **Differentiation Moat:** Expert backing (健康 2.0) + Taiwan cultural identity + program integration
- **Full Product Roadmap:** Where this goes beyond the prototype (assessment → prescription → tracking → adjustment loop)

This page is presentation-grade — clean typography, structured sections, possibly with simple illustrations or icons. It serves as an embedded pitch deck that judges can explore at their own pace.

#### Phase 2 — Explicitly Out of Scope

- Breathing exercise interactive animation (display card only)
- Data persistence across page refreshes
- Real personalization engine or recommendation algorithm
- Push notifications or time-based triggers
- User accounts or authentication
- Backend services of any kind

### Phase 3 (Out of Scope for Prototype)

- Real field recordings from actual Taiwan locations
- User accounts / data persistence
- Social sharing features
- Subscription payment system
- Mobile App version
- Apple Health integration
- Audio mixing functionality
- Offline download support
- Detailed sleep data analytics

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
- **FR13:** User can see unlock conditions presented in encouraging language using a positive-achievement pattern (e.g., "[positive action] to unlock [reward]"), with no countdown timers or punishment framing

### Location Content

- **FR14:** User can see 3 unlocked locations with full audio and imagery: 淡水河夕陽, 阿里山雲海, 基隆港浪
- **FR15:** User can see 7 locked locations with names and unlock prompts: 蘭嶼飛魚季, 太魯閣溪流, 日月潭晨曦, 墾丁星空, 合歡山銀河, 台東稻浪, 玉山頂風聲
- **FR16:** User can verify each unlocked location has a unique audio source and scene photograph

### Visual Experience

- **FR17:** User can see a dark-themed interface as the default visual style
- **FR18:** User can see a glow animation effect on unlocked location markers
- **FR19:** User can see a dimmed/muted visual state with lock icon on locked location markers
- **FR20:** User can see an animated visual transition (300-500ms duration, no frame drops below 30fps) when selecting a location

### Phase 2: Tab Navigation

- **FR21:** User can navigate between three tabs: Tonight (今晚), Explore (探索), My Journey (我的)
- **FR22:** Tab bar is persistent and visible across all three views with active state indicator
- **FR23:** Tab bar is hidden during the onboarding questionnaire flow

### Phase 2: Sleep Assessment Questionnaire

- **FR24:** User is presented with a 5-question sleep assessment on first visit (before accessing the main app)
- **FR25:** Each question displays one at a time with a progress indicator (e.g., "3 of 5")
- **FR26:** Each question offers 3-4 multiple-choice options; user must select one to proceed
- **FR27:** User can navigate back to previous questions to change answers
- **FR28:** Upon completing all 5 questions, the system determines one of 3 sleep types based on simple priority logic

### Phase 2: Sleep Type Result

- **FR29:** User sees their sleep type result with: type name, brief description, recommended approach summary, and a "Start My Plan" button
- **FR30:** The 3 possible results are: 入睡困難型 (Difficulty Falling Asleep), 淺眠易醒型 (Light Sleeper), 焦慮思緒型 (Anxious Mind)
- **FR31:** Tapping "Start My Plan" dismisses the onboarding and enters the main app on the "Tonight" tab

### Phase 2: Tonight Homepage

- **FR32:** User can see a plan progress bar showing plan name, current day, total days, and percentage
- **FR33:** User can see a breathing exercise card displaying exercise name, duration, and expert name (display only — not interactive)
- **FR34:** User can see a soundscape recommendation card linked to a specific map location
- **FR35:** User can tap the soundscape recommendation card to navigate to the Explore tab and auto-play the recommended location's audio
- **FR36:** User can see a coach tip message at the bottom of the page
- **FR37:** Prescription card content varies based on the sleep type determined during onboarding (3 content variants)

### Phase 2: My Journey Page

- **FR38:** User can see cumulative achievement stats: completed sessions, longest streak, unlocked soundscapes (all hardcoded values)
- **FR39:** User can see a positive reinforcement message highlighting a recent behavior pattern
- **FR40:** User can see their current plan progress (consistent with the Tonight tab progress bar)

### Phase 2: Map Integration Updates

- **FR41:** User can see a collection progress indicator above the map ("已收集 X/10 個台灣聲景")
- **FR42:** User can see a hint linking a locked location to the sleep plan (e.g., "完成「入睡困難急救包」即可解鎖：台東稻田")

### Phase 2: Product Story Page

- **FR43:** User can access a Product Story page from within the app
- **FR44:** Product Story page displays: product vision, competitive landscape, target audience, design philosophy, differentiation moat, and product roadmap
- **FR45:** Product Story page is a scrollable page with clear section headings, readable body text (minimum 16px equivalent), visual hierarchy distinguishing headings from body content, and content completable in under 3 minutes of reading
- **FR46:** User can return to the main app from the Product Story page

## Non-Functional Requirements

### Performance

- **NFR1:** Map page loads and renders within 2 seconds on standard broadband connection
- **NFR2:** Audio playback begins within 500ms of clicking an unlocked location
- **NFR3:** SVG map interactions (hover, click) respond at 60fps with no visible lag
- **NFR4:** Switching between locations completes audio crossfade within 500ms and visual transition within 300-500ms with no dropped frames
- **NFR5:** Scene photographs load within 1 second of location selection

### Browser Compatibility

- **NFR6:** All functional requirements (FR1-FR46) pass manual verification in Chrome (latest) as the primary demo browser
- **NFR7:** All functional requirements (FR1-FR46) pass manual verification in Safari (latest) as secondary browser

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

**Phase 1 Components (Existing):**

| Component | Responsibility |
|---|---|
| `App` | Root layout, dark theme, global audio state |
| `TaiwanMap` | SVG map rendering, location dots, glow effects |
| `LocationDot` | Individual clickable location (unlocked/locked state) |
| `SoundscapePlayer` | Audio playback controls (play/pause/volume/fade-out) |
| `LocationDetail` | Scene photo + location name + description overlay |
| `LockOverlay` | Locked location prompt with unlock condition message |

**Phase 2 Components (New):**

| Component | Responsibility |
|---|---|
| `TabBar` | Bottom tab navigation with active state indicator |
| `SleepAssessment` | 5-question onboarding flow with progress indicator |
| `SleepTypeResult` | Result page showing sleep type + description + CTA |
| `TonightPage` | Prescription homepage: progress bar, cards, coach tip |
| `PrescriptionCard` | Individual card for breathing exercise or soundscape recommendation |
| `MyJourneyPage` | Achievement stats + reinforcement message + progress |
| `ProductStory` | Scrollable page presenting product concept and vision |

### State Management

- React useState/useContext sufficient (no Redux needed)
- Phase 1 state: current playing location, playback state, unlock states
- Phase 2 state: onboarding completion flag, determined sleep type, active tab
- No persistence required (prototype resets on refresh)
- Sleep type result is held in memory and drives content variants on Tonight page

### Implementation Considerations

- **SVG Map:** Use or create a simplified Taiwan outline SVG, position location dots with absolute coordinates
- **Audio:** Preload audio files for unlocked locations; locked locations don't need audio loaded
- **Dark Theme:** Tailwind `dark` class as default, deep navy/charcoal background
- **Glow Effects:** CSS `box-shadow` or SVG `filter` for location dot glow animation
- **Scene Photos:** Free stock photos from Unsplash/Pexels for Taiwan locations

## Risk Mitigation

### Phase 1 Risks

| Risk Type | Risk | Mitigation |
|---|---|---|
| **Technical** | SVG map interaction not polished enough, fails to convey "category redefinition" | Prioritize map visuals — this is the first impression |
| **Technical** | Audio playback inconsistent across browsers | Pre-test Chrome + Safari; designate demo browser |
| **Content** | Placeholder audio sources reduce immersion | Select atmospheric free audio sources; pair with high-quality scene photography to compensate |
| **Market** | Concept not understood by judge | Brand tagline + self-guided UI lets concept speak for itself; locked location prompt copy must be clear |
| **Resource** | One week not enough for all features | Locked locations have zero audio cost; build core 3 soundscapes + map first, then polish |

### Phase 2 Risks

| Risk Type | Risk | Mitigation |
|---|---|---|
| **Scope** | Phase 2 additions dilute focus from the core map experience | Tab navigation preserves the map as a dedicated tab; onboarding can be skipped in demo by going directly to any tab |
| **UX** | Onboarding questionnaire feels slow during a time-constrained demo | Keep questions to 5, one per screen, with quick tap-to-answer UI; entire flow should complete in under 30 seconds |
| **Narrative** | "Tonight" page with hardcoded data feels fake | Use realistic dates and progress values; the demo is about communicating the concept, not proving real functionality |
| **Content** | Product Story page content is too long or dense for judges | Structure with clear headings, keep each section to 2-3 sentences, use visual hierarchy to enable scanning |
| **Technical** | Adding tabs and new pages introduces layout regressions on existing map | Wrap existing map in Explore tab container without modifying internal map logic; test transitions between tabs |
| **Design** | Visual consistency between new Phase 2 pages and existing Phase 1 polish | Reuse existing dark theme, color palette, typography, and Motion animation patterns from Phase 1 |
