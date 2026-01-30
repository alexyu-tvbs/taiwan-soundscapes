import { useState } from 'react'
import { TaiwanMap } from './components/TaiwanMap'
import { LocationDetail } from './components/LocationDetail'
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
    } else {
      audioPlayer.pause()
    }
  }

  return (
    <div className="bg-slate-900 text-white min-h-screen flex flex-col">
      <header className="text-center py-6">
        <h1 data-testid="brand-tagline" className="text-2xl font-bold">
          好眠秘境 — 用耳朵旅行台灣
        </h1>
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
  )
}
