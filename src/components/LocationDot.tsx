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
        <g
          data-testid={`lock-icon-${location.id}`}
          transform={`translate(${location.coordinates.x}, ${location.coordinates.y})`}
          opacity={0.6}
          style={{ pointerEvents: 'none' }}
        >
          <rect x={-2.5} y={-0.5} width={5} height={4} rx={0.7} fill="white" />
          <path
            d="M-1.5,-0.5 V-2.5 A1.5,1.5 0 0,1 1.5,-2.5 V-0.5"
            fill="none"
            stroke="white"
            strokeWidth={1}
            strokeLinecap="round"
          />
        </g>
      )}
    </g>
  )
}
