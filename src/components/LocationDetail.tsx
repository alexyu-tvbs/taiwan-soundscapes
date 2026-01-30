import { useState } from 'react'
import type { Location } from '../types'

interface LocationDetailProps {
  location: Location
  isPlaying: boolean
}

export const LocationDetail = ({ location }: LocationDetailProps) => {
  const [errorImagePath, setErrorImagePath] = useState<string | null>(null)
  const imageError = errorImagePath === location.imagePath

  return (
    <div
      data-testid="location-detail"
      className="bg-slate-800/80 backdrop-blur rounded-xl p-4 max-w-md"
    >
      {imageError ? (
        <div
          data-testid="image-placeholder"
          className="w-full rounded-lg aspect-video bg-slate-700 flex items-center justify-center"
        >
          <span className="text-slate-500 text-sm">Image unavailable</span>
        </div>
      ) : (
        <img
          src={location.imagePath}
          alt={location.nameEn}
          className="w-full rounded-lg object-cover aspect-video"
          onError={() => {
            console.warn(`Failed to load image: ${location.imagePath}`)
            setErrorImagePath(location.imagePath)
          }}
        />
      )}
      <h2 className="text-xl font-bold mt-3">{location.name}</h2>
      <p className="text-slate-400 text-sm">{location.nameEn}</p>
    </div>
  )
}
