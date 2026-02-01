import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { TaiwanMap } from './components/TaiwanMap'
import { LocationDetail } from './components/LocationDetail'
import { SoundscapePlayer } from './components/SoundscapePlayer'
import { LockOverlay } from './components/LockOverlay'
import { useAudioPlayer } from './hooks/useAudioPlayer'
import { locations } from './data/locations'
import type { Location } from './types'

export const App = () => {
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null)
  const [lockedLocation, setLockedLocation] = useState<Location | null>(null)
  const audioPlayer = useAudioPlayer()

  const selectedLocation = locations.find((l) => l.id === selectedLocationId) ?? null
  const isUnlockedSelection = selectedLocation?.status === 'unlocked'

  const handleSelect = (id: string) => {
    const loc = locations.find((l) => l.id === id)
    if (!loc) return

    if (loc.status === 'unlocked') {
      setSelectedLocationId(id)
      setLockedLocation(null)
      audioPlayer.play(loc.audioPath)
    } else {
      setLockedLocation(loc)
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
        <AnimatePresence>
          {isUnlockedSelection && selectedLocation && (
            <motion.div
              key="detail-panel"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <LocationDetail
                location={selectedLocation}
                isPlaying={audioPlayer.isPlaying}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <AnimatePresence>
        {isUnlockedSelection && selectedLocation && (
          <motion.div
            key="player"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
          >
            <SoundscapePlayer
              isPlaying={audioPlayer.isPlaying}
              volume={audioPlayer.volume}
              locationName={selectedLocation.name}
              onPlay={() => audioPlayer.resume()}
              onPause={() => audioPlayer.pause()}
              onVolumeChange={audioPlayer.setVolume}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {lockedLocation && (
          <LockOverlay
            location={lockedLocation}
            onClose={() => setLockedLocation(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
