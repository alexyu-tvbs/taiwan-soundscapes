import { useState } from 'react'
import { TaiwanMap } from './components/TaiwanMap'
import { SoundscapePlayer } from './components/SoundscapePlayer'
import { useAudioPlayer } from './hooks/useAudioPlayer'
import { locations } from './data/locations'

export const App = () => {
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null)
  const audioPlayer = useAudioPlayer()

  const selectedLocation = locations.find((l) => l.id === selectedLocationId) ?? null
  const isUnlockedSelection = selectedLocation?.status === 'unlocked'

  const handleSelect = (id: string) => {
    setSelectedLocationId(id)
    const loc = locations.find((l) => l.id === id)
    if (loc?.status === 'unlocked') {
      audioPlayer.play(loc.audioPath)
    }
  }

  return (
    <div className="bg-slate-900 text-white min-h-screen">
      <header className="text-center py-6">
        <h1 data-testid="brand-tagline" className="text-2xl font-bold">
          好眠秘境 — 用耳朵旅行台灣
        </h1>
      </header>
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
  )
}
