import type { Location } from '../types'

interface LocationDotProps {
  location: Location
  isSelected: boolean
  onClick: (id: string) => void
}

export const LocationDot = ({ location, isSelected, onClick }: LocationDotProps) => {
  const isUnlocked = location.status === 'unlocked'
  return (
    <g>
      <circle
        data-testid={`location-dot-${location.id}`}
        cx={location.coordinates.x}
        cy={location.coordinates.y}
        r={isSelected ? 8 : 6}
        fill={isUnlocked ? '#F59E0B' : '#64748B'}
        opacity={isUnlocked ? 1 : 0.4}
        onClick={() => onClick(location.id)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onClick(location.id)
          }
        }}
        tabIndex={0}
        role="button"
        aria-label={location.name}
        className="cursor-pointer"
      >
        <title>{location.name}</title>
      </circle>
      {!isUnlocked && (
        <text
          data-testid={`lock-icon-${location.id}`}
          x={location.coordinates.x}
          y={location.coordinates.y + 1}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={8}
          fill="white"
          opacity={0.6}
          style={{ pointerEvents: 'none' }}
        >
          🔒
        </text>
      )}
    </g>
  )
}
