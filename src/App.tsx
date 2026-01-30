import { useState } from 'react'
import { TaiwanMap } from './components/TaiwanMap'
import { locations } from './data/locations'

export const App = () => {
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null)

  return (
    <div className="bg-slate-900 text-white min-h-screen">
      <header className="text-center py-6">
        <h1 data-testid="brand-tagline" className="text-2xl font-bold">
          好眠秘境 — 用耳朵旅行台灣
        </h1>
      </header>
      <TaiwanMap
        locations={[...locations]}
        selectedLocationId={selectedLocationId}
        onSelect={setSelectedLocationId}
      />
    </div>
  )
}
