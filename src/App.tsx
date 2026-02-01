import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { TaiwanMap } from './components/TaiwanMap'
import { LocationDetail } from './components/LocationDetail'
import { SoundscapePlayer } from './components/SoundscapePlayer'
import { LockOverlay } from './components/LockOverlay'
import { TabBar } from './components/TabBar'
import { useAudioPlayer } from './hooks/useAudioPlayer'
import { locations } from './data/locations'
import type { Location, Tab, SleepType } from './types'

export const App = () => {
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null)
  const [lockedLocation, setLockedLocation] = useState<Location | null>(null)
  const [activeTab, setActiveTab] = useState<Tab>('tonight')
  const [onboardingComplete, setOnboardingComplete] = useState(true)
  const [sleepType, setSleepType] = useState<SleepType | null>('difficulty')
  const [showProductStory, setShowProductStory] = useState(false)
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

  // Phase 2 state — setters/values activated in upcoming stories
  void setOnboardingComplete; void setSleepType; void sleepType // Story 5.2
  void showProductStory // Epic 8

  const handleTabChange = (tab: Tab) => {
    if (activeTab === 'explore' && tab !== 'explore') {
      audioPlayer.pause()
    }
    setActiveTab(tab)
  }

  return (
    <div className="bg-slate-900 text-white min-h-screen flex flex-col">
      <header className="relative text-center py-6">
        <h1 data-testid="brand-tagline" className="text-2xl font-bold">
          好眠秘境 — 用耳朵旅行台灣
        </h1>
        {onboardingComplete && (
          <button
            data-testid="product-story-btn"
            onClick={() => setShowProductStory(true)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors text-lg"
            aria-label="Product Story"
          >
            ℹ️
          </button>
        )}
      </header>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={`flex-1 flex flex-col${onboardingComplete ? ' pb-16' : ''}`}
        >
          {activeTab === 'tonight' && (
            <main className="flex-1 flex items-center justify-center px-8">
              <div className="text-center text-slate-400">
                <p className="text-lg">今晚的處方 — Coming in Epic 6</p>
              </div>
            </main>
          )}
          {activeTab === 'explore' && (
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
          )}
          {activeTab === 'journey' && (
            <main className="flex-1 flex items-center justify-center px-8">
              <div className="text-center text-slate-400">
                <p className="text-lg">我的旅程 — Coming in Epic 7</p>
              </div>
            </main>
          )}
        </motion.div>
      </AnimatePresence>
      <AnimatePresence>
        {activeTab === 'explore' && isUnlockedSelection && selectedLocation && (
          <motion.div
            key="player"
            className={`fixed left-0 right-0 ${onboardingComplete ? 'bottom-16' : 'bottom-0'} z-30`}
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
      {onboardingComplete && (
        <TabBar activeTab={activeTab} onTabChange={handleTabChange} />
      )}
    </div>
  )
}
