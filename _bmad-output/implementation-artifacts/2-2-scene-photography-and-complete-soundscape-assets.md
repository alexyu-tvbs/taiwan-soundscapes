# Story 2.2: Scene Photography & Complete Soundscape Assets

Status: ready-for-dev

## Story

As a user,
I want to see a scene photograph when exploring a soundscape,
So that I feel transported to the real Taiwan location.

## Acceptance Criteria

1. **Given** the user has selected an unlocked location **When** the soundscape is playing **Then** a scene photograph for that location is displayed in the `LocationDetail` panel (FR9) **And** the location name is shown alongside the photograph

2. **Given** the prototype requires 3 complete soundscapes **When** the user explores each unlocked location **Then** 淡水河夕陽 displays a unique river/sunset scene photo with water/harbor ambient audio (FR14, FR16) **And** 阿里山雲海 displays a unique mountain/cloud scene photo with forest/insect ambient audio (FR14, FR16) **And** 基隆港浪 displays a unique harbor/wave scene photo with ocean wave ambient audio (FR14, FR16)

3. **Given** the user switches between unlocked locations **When** a new location is selected **Then** the scene photograph updates to match the newly selected location **And** audio files are sourced as local mp3 in `public/audio/` and photos as jpg in `public/images/`

## Tasks / Subtasks

- [ ] Task 1: Create `LocationDetail` component (AC: #1)
  - [ ] 1.1 Create `src/components/LocationDetail.tsx`
  - [ ] 1.2 Props: `LocationDetailProps { location: Location; isPlaying: boolean }`
  - [ ] 1.3 Display scene photograph using `<img>` with `src={location.imagePath}`
  - [ ] 1.4 Display location name (zh) prominently
  - [ ] 1.5 Display location English name as subtitle
  - [ ] 1.6 Dark theme styling: panel with semi-transparent background, rounded corners
  - [ ] 1.7 Handle image load failure: `console.warn`, show fallback state (dark placeholder) — NEVER throw

- [ ] Task 2: Integrate LocationDetail into App.tsx (AC: #1, #3)
  - [ ] 2.1 Import `LocationDetail` into `App.tsx`
  - [ ] 2.2 Render `LocationDetail` conditionally when an unlocked location is selected
  - [ ] 2.3 Pass `selectedLocation` object and `isPlaying` state as props
  - [ ] 2.4 Panel updates automatically when `selectedLocationId` changes (React re-render)
  - [ ] 2.5 Position: side panel or overlay area — NOT covering the map entirely

- [ ] Task 3: Source scene photographs for 3 unlocked locations (AC: #2)
  - [ ] 3.1 Add 3 scene photos to `public/images/`:
    - `tamsui.jpg` — 淡水河夕陽: river/harbor sunset scene (Tamsui area)
    - `alishan.jpg` — 阿里山雲海: mountain with sea of clouds (Alishan area)
    - `keelung.jpg` — 基隆港浪: harbor with ocean waves (Keelung area)
  - [ ] 3.2 Source from royalty-free: Unsplash, Pexels, or Pixabay
  - [ ] 3.3 Optimize images: reasonable resolution for web display (1200-1600px wide), compressed jpg
  - [ ] 3.4 If unable to source real Taiwan photos, use atmospheric nature photos that match the theme

- [ ] Task 4: Verify complete audio + photo pairing (AC: #2)
  - [ ] 4.1 Verify all 3 unlocked locations have both audio AND photo assets:
    - `/audio/tamsui.mp3` + `/images/tamsui.jpg`
    - `/audio/alishan.mp3` + `/images/alishan.jpg`
    - `/audio/keelung.mp3` + `/images/keelung.jpg`
  - [ ] 4.2 Click each unlocked location → verify audio plays AND photo displays simultaneously
  - [ ] 4.3 Switch between locations → verify both audio and photo update together without glitches

## Dev Notes

### LocationDetail Component Pattern

```tsx
interface LocationDetailProps {
  location: Location;
  isPlaying: boolean;
}

export const LocationDetail = ({ location, isPlaying }: LocationDetailProps) => {
  return (
    <div className="bg-slate-800/80 backdrop-blur rounded-xl p-4 max-w-md">
      <img
        src={location.imagePath}
        alt={location.nameEn}
        className="w-full rounded-lg object-cover aspect-video"
        onError={(e) => {
          console.warn(`Failed to load image: ${location.imagePath}`);
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />
      <h2 className="text-xl font-bold mt-3">{location.name}</h2>
      <p className="text-slate-400 text-sm">{location.nameEn}</p>
    </div>
  );
};
```

### Image Path Rules — CRITICAL

- Images live in `public/images/` and are referenced as absolute path strings
- `locations.ts` already has `imagePath` field: `/images/tamsui.jpg`
- Use `<img src={location.imagePath}>` — NEVER use ES module import for images
- Example: `<img src="/images/tamsui.jpg" />` — Vite serves `public/` at root

```tsx
// CORRECT: Path string reference
<img src={location.imagePath} alt={location.nameEn} />

// WRONG: ES module import
import tamsui from '../assets/tamsui.jpg';  // NEVER do this for public/ assets
```

### App.tsx Integration — Layout Approach

The App.tsx layout needs to accommodate the map + LocationDetail side by side or as an overlay:

```tsx
export const App = () => {
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const audioPlayer = useAudioPlayer();

  const selectedLocation = locations.find(l => l.id === selectedLocationId) ?? null;
  const isUnlockedSelection = selectedLocation?.status === 'unlocked';

  const handleSelect = (id: string) => {
    setSelectedLocationId(id);
    const loc = locations.find(l => l.id === id);
    if (loc?.status === 'unlocked') {
      audioPlayer.play(loc.audioPath);
    }
  };

  return (
    <div className="bg-slate-900 text-white min-h-screen flex flex-col">
      <header className="text-center py-6">
        <h1 className="text-2xl font-bold">好眠秘境 — 用耳朵旅行台灣</h1>
      </header>
      <main className="flex-1 flex items-center justify-center gap-8 px-8">
        <TaiwanMap
          locations={locations}
          selectedLocationId={selectedLocationId}
          onSelect={handleSelect}
        />
        {isUnlockedSelection && selectedLocation && (
          <LocationDetail
            location={selectedLocation}
            isPlaying={audioPlayer.isPlaying}
          />
        )}
      </main>
      {isUnlockedSelection && selectedLocation && (
        <SoundscapePlayer
          isPlaying={audioPlayer.isPlaying}
          volume={audioPlayer.volume}
          locationName={selectedLocation.name}
          onPlay={() => audioPlayer.resume()}
          onPause={() => audioPlayer.pause()}
          onVolumeChange={audioPlayer.setVolume}
        />
      )}
    </div>
  );
};
```

**Layout decision:** Map on the left/center, LocationDetail panel on the right side. SoundscapePlayer fixed at bottom. This is a desktop-first prototype — no responsive design required.

### Scene Photo Sourcing Guide

| Location | Photo Theme | Search Keywords |
|----------|-------------|-----------------|
| 淡水河夕陽 | River sunset, golden hour, harbor | "Tamsui sunset", "Taiwan river sunset", "harbor golden hour" |
| 阿里山雲海 | Mountain cloud sea, forest mist | "Alishan sea of clouds", "Taiwan mountain clouds", "forest morning mist" |
| 基隆港浪 | Ocean waves, harbor, coastal | "Keelung harbor", "Taiwan ocean waves", "coastal harbor" |

**Photo requirements:**
- Landscape orientation (aspect-video / 16:9 recommended)
- Atmospheric, moody — match the dark theme aesthetic
- Resolution: 1200-1600px wide for sharp display
- Format: jpg, compressed for web (< 500KB each)

### Error Handling

- Image `onError`: `console.warn` + hide broken image or show dark placeholder
- NEVER throw errors from image loading
- If image fails, the LocationDetail should still show location name text

### Dependencies on Previous Stories

- **Story 1.1:** TypeScript types with `imagePath` field, `locations.ts` data
- **Story 1.2:** TaiwanMap component, App.tsx `selectedLocationId` state
- **Story 2.1:** `useAudioPlayer` hook, `SoundscapePlayer` component, audio playback integration in App.tsx

**Key integration:** This story adds `LocationDetail` alongside the existing `SoundscapePlayer`. Both appear when an unlocked location is selected. The App.tsx layout evolves from map-only to map + detail panel + bottom player.

### What This Story Does NOT Include

- No lock overlay for locked locations (Story 3.1)
- No glow animations on markers (Story 4.1)
- No transition animations on LocationDetail appearance (Story 4.2)
- No responsive layout — desktop Chrome is the demo browser
- Photo display is immediate (no lazy-loading optimization needed for 3 images)

### Project Structure After This Story

```
src/
├── components/
│   ├── TaiwanMap.tsx           # From Story 1.2
│   ├── LocationDot.tsx         # From Story 1.2
│   ├── SoundscapePlayer.tsx    # From Story 2.1
│   └── LocationDetail.tsx      # NEW — Scene photo + location name panel
├── hooks/
│   └── useAudioPlayer.ts      # From Story 2.1
├── data/
│   └── locations.ts            # From Story 1.1/1.2
├── types/
│   └── index.ts                # From Story 1.1
├── App.tsx                     # UPDATED — adds LocationDetail, refines layout
├── index.css
└── main.tsx

public/
├── audio/
│   ├── tamsui.mp3              # From Story 2.1
│   ├── alishan.mp3             # From Story 2.1
│   └── keelung.mp3             # From Story 2.1
└── images/
    ├── tamsui.jpg              # NEW — Tamsui river sunset scene
    ├── alishan.jpg             # NEW — Alishan cloud sea scene
    └── keelung.jpg             # NEW — Keelung harbor waves scene
```

### References

- [Source: _bmad-output/planning-artifacts/architecture.md#Frontend Architecture — Decision 5] — Asset strategy, public/ directory, local storage
- [Source: _bmad-output/planning-artifacts/architecture.md#Project Structure & Boundaries] — LocationDetail receives selectedLocation, isPlaying
- [Source: _bmad-output/planning-artifacts/architecture.md#Error Handling Patterns] — Silent degradation for image load failures
- [Source: _bmad-output/planning-artifacts/epics.md#Story 2.2] — Acceptance criteria
- [Source: _bmad-output/planning-artifacts/prd.md#Soundscape Playback] — FR9 (scene photo), FR14/FR16 (unique assets)
- [Source: _bmad-output/planning-artifacts/prd.md#Audio Asset Strategy] — Free audio sources, local mp3
- [Source: _bmad-output/project-context.md#Asset Rules] — public/ paths, no ES module imports, no external CDN

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
