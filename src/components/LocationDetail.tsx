import type { Location } from '../types'

interface LocationDetailProps {
  location: Location
  isPlaying: boolean
}

export const LocationDetail = ({ location }: LocationDetailProps) => {
  return (
    <div
      data-testid="location-detail"
      className="bg-slate-800/80 backdrop-blur rounded-xl p-4 max-w-md"
    >
      <img
        src={location.imagePath}
        alt={location.nameEn}
        className="w-full rounded-lg object-cover aspect-video"
        onError={(e) => {
          console.warn(`Failed to load image: ${location.imagePath}`)
          ;(e.target as HTMLImageElement).style.display = 'none'
        }}
      />
      <h2 className="text-xl font-bold mt-3">{location.name}</h2>
      <p className="text-slate-400 text-sm">{location.nameEn}</p>
    </div>
  )
}
