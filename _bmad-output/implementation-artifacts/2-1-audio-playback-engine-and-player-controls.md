# Story 2.1: Audio Playback Engine & Player Controls

Status: ready-for-dev

## Story

As a user,
I want to click an unlocked location and hear its soundscape with playback controls,
So that I can experience the sound of each Taiwan location.

## Acceptance Criteria

1. **Given** the map is displayed with unlocked location markers **When** the user clicks an unlocked location (e.g., 淡水河夕陽) **Then** audio playback begins for that location's soundscape (FR3, FR6) **And** the `SoundscapePlayer` component becomes visible with active controls

2. **Given** a soundscape is currently playing **When** the user clicks the pause button **Then** audio playback pauses **And** the button changes to a play icon (FR7)

3. **Given** a soundscape is paused **When** the user clicks the play button **Then** audio playback resumes from where it was paused (FR7)

4. **Given** a soundscape is playing **When** the user adjusts the volume slider **Then** the audio volume changes in real-time to match the slider position (FR8)

5. **Given** a soundscape is playing for one location **When** the user clicks a different unlocked location **Then** the previous soundscape stops and the new location's soundscape begins playing (FR10) **And** there is no audio overlap or glitching during the switch

## Tasks / Subtasks

- [ ] Task 1: Create `useAudioPlayer` custom hook (AC: #1, #2, #3, #4, #5)
  - [ ] 1.1 Create `src/hooks/useAudioPlayer.ts`
  - [ ] 1.2 Create a single shared `HTMLAudioElement` instance (via `useRef`) — NEVER create multiple Audio instances
  - [ ] 1.3 Expose API: `{ play: (src: string) => void, pause: () => void, resume: () => void, setVolume: (v: number) => void, isPlaying: boolean, currentTrack: string | null, volume: number }`
  - [ ] 1.4 `play(src)`: If same track and paused → resume; if different track → stop current, set new src, play
  - [ ] 1.5 `pause()`: Pause current audio, update isPlaying state
  - [ ] 1.6 `resume()`: Resume from paused position
  - [ ] 1.7 `setVolume(v)`: Set volume (0-1 range) on the HTMLAudioElement in real-time
  - [ ] 1.8 Handle audio `ended` event to reset isPlaying state
  - [ ] 1.9 Handle audio load errors: `console.warn` + reset to default state — NEVER throw

- [ ] Task 2: Create `SoundscapePlayer` component (AC: #1, #2, #3, #4)
  - [ ] 2.1 Create `src/components/SoundscapePlayer.tsx`
  - [ ] 2.2 Props: `SoundscapePlayerProps { isPlaying: boolean; volume: number; locationName: string; onPlay: () => void; onPause: () => void; onVolumeChange: (volume: number) => void }`
  - [ ] 2.3 Play/Pause toggle button — shows play icon when paused, pause icon when playing
  - [ ] 2.4 Volume slider — HTML `<input type="range">` styled with Tailwind, range 0-1 (step 0.01)
  - [ ] 2.5 Display current location name
  - [ ] 2.6 Component hidden when no location is selected (conditional render in App.tsx)
  - [ ] 2.7 Dark theme styling: semi-transparent background panel, white text/icons

- [ ] Task 3: Integrate audio into App.tsx (AC: #1, #5)
  - [ ] 3.1 Call `useAudioPlayer()` in App.tsx — this is the ONLY place the hook is called
  - [ ] 3.2 On location select (from TaiwanMap onSelect callback):
    - If unlocked → call `audioPlayer.play(location.audioPath)`
    - If locked → do NOT play (lock overlay is Story 3.1)
  - [ ] 3.3 Pass audio state and callbacks down to SoundscapePlayer as props
  - [ ] 3.4 Render SoundscapePlayer conditionally when a location is selected and unlocked
  - [ ] 3.5 Find selected location from `locations` data using `selectedLocationId`

- [ ] Task 4: Source placeholder audio files (AC: #1)
  - [ ] 4.1 Add 3 placeholder mp3 files to `public/audio/`:
    - `tamsui.mp3` — water/river ambient sound
    - `alishan.mp3` — forest/insect ambient sound
    - `keelung.mp3` — ocean wave ambient sound
  - [ ] 4.2 Use royalty-free sources: Freesound.org, Pixabay Audio, or Mixkit
  - [ ] 4.3 Target duration: 30-60 seconds minimum (looping can be added later)
  - [ ] 4.4 If unable to source audio files, create minimal silent/tone mp3 placeholders so the flow works

## Dev Notes

### Audio Architecture — Single HTMLAudioElement Pattern

**CRITICAL: One audio instance only.** This is the most important architectural constraint for this story.

```ts
// CORRECT: Single shared HTMLAudioElement
export const useAudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(new Audio());
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);
  const [volume, setVolumeState] = useState(1);

  const play = useCallback((src: string) => {
    const audio = audioRef.current;
    if (currentTrack === src && audio.paused) {
      audio.play().catch(() => console.warn('Audio play failed'));
      setIsPlaying(true);
      return;
    }
    audio.src = src;
    audio.volume = volume;
    audio.play().catch(() => console.warn('Audio play failed'));
    setCurrentTrack(src);
    setIsPlaying(true);
  }, [currentTrack, volume]);

  // ... pause, resume, setVolume, cleanup
};

// WRONG: Creating multiple Audio instances
const play = (src: string) => {
  const audio = new Audio(src);  // NEVER do this
  audio.play();
};
```

**Location switch sequence:** Stop current → set new src → play. No crossfade, no overlap.

**Error handling:** Audio load/play failures use `console.warn` and reset to default state. NEVER throw from audio operations. The `.play()` call returns a Promise — always `.catch()` it.

### Audio File References

Audio files live in `public/audio/` and are referenced by absolute path strings from `locations.ts`:
- `/audio/tamsui.mp3`
- `/audio/alishan.mp3`
- `/audio/keelung.mp3`

NEVER use ES module imports for audio files. Always reference as path strings.

### SoundscapePlayer Component Pattern

```tsx
interface SoundscapePlayerProps {
  isPlaying: boolean;
  volume: number;
  locationName: string;
  onPlay: () => void;
  onPause: () => void;
  onVolumeChange: (volume: number) => void;
}

export const SoundscapePlayer = ({
  isPlaying, volume, locationName, onPlay, onPause, onVolumeChange
}: SoundscapePlayerProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-800/90 backdrop-blur p-4">
      <div className="flex items-center justify-center gap-4">
        <span className="text-white">{locationName}</span>
        <button onClick={isPlaying ? onPause : onPlay}>
          {isPlaying ? '⏸' : '▶'}
        </button>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => onVolumeChange(Number(e.target.value))}
        />
      </div>
    </div>
  );
};
```

### App.tsx Integration Pattern

```tsx
export const App = () => {
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const audioPlayer = useAudioPlayer();  // ONLY called here

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
    <div className="bg-slate-900 text-white min-h-screen">
      <header>...</header>
      <TaiwanMap
        locations={locations}
        selectedLocationId={selectedLocationId}
        onSelect={handleSelect}
      />
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

### Browser Audio Considerations

- **Chrome autoplay policy:** Audio play triggered by user click is allowed (our interaction model). No autoplay on page load.
- **Safari audio policy:** Same — click-triggered play works. The `.play()` Promise rejection must be caught.
- **Volume range:** HTMLAudioElement volume is 0.0 to 1.0. Map slider directly.

### Dependencies on Previous Stories

This story builds on:
- **Story 1.1:** Project setup, TypeScript types (`Location` type with `audioPath` field), `locations.ts` data with audio paths
- **Story 1.2:** TaiwanMap + LocationDot components, App.tsx with `selectedLocationId` state and `onSelect` handler

**Key integration point:** Story 1.2 already has `selectedLocationId` state and `onSelect` callback in App.tsx. This story extends `onSelect` to also trigger audio playback for unlocked locations.

### What This Story Does NOT Include

- No scene photograph display (Story 2.2)
- No lock overlay for locked locations (Story 3.1)
- No glow animations (Story 4.1)
- No transition animations (Story 4.2)
- No audio looping (can be added later if needed)
- Clicking a locked location does nothing in this story (handled in Story 3.1)

### Project Structure After This Story

```
src/
├── components/
│   ├── TaiwanMap.tsx           # From Story 1.2
│   ├── LocationDot.tsx         # From Story 1.2
│   └── SoundscapePlayer.tsx    # NEW — Audio playback controls
├── hooks/
│   └── useAudioPlayer.ts      # NEW — HTML5 Audio management hook
├── data/
│   └── locations.ts            # From Story 1.1 (updated coords in 1.2)
├── types/
│   └── index.ts                # From Story 1.1
├── App.tsx                     # UPDATED — integrates useAudioPlayer + SoundscapePlayer
├── index.css
└── main.tsx

public/
├── audio/
│   ├── tamsui.mp3              # NEW — placeholder audio
│   ├── alishan.mp3             # NEW — placeholder audio
│   └── keelung.mp3             # NEW — placeholder audio
└── images/                     # Empty (Story 2.2)
```

### References

- [Source: _bmad-output/planning-artifacts/architecture.md#Frontend Architecture — Decision 3] — Single HTML5 Audio + custom hook, YouTube deferred
- [Source: _bmad-output/planning-artifacts/architecture.md#Project Structure & Boundaries] — SoundscapePlayer receives isPlaying, volume, callbacks
- [Source: _bmad-output/planning-artifacts/architecture.md#State Management Patterns] — useAudioPlayer encapsulates logic, App.tsx owns state
- [Source: _bmad-output/planning-artifacts/architecture.md#Error Handling Patterns] — Silent degradation for audio failures
- [Source: _bmad-output/planning-artifacts/epics.md#Story 2.1] — Acceptance criteria
- [Source: _bmad-output/planning-artifacts/prd.md#Soundscape Playback] — FR6, FR7, FR8, FR10
- [Source: _bmad-output/project-context.md#Audio Management] — Single HTMLAudioElement, useAudioPlayer API, switch sequence

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
