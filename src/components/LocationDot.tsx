import { motion } from 'motion/react'
import type { Location } from '../types'

interface LocationDotProps {
  location: Location
  isSelected: boolean
  onClick: (id: string) => void
}

export const LocationDot = ({ location, isSelected, onClick }: LocationDotProps) => {
  const isUnlocked = location.status === 'unlocked'

  if (isUnlocked) {
    return (
      <g>
        <motion.circle
          data-testid={`location-dot-${location.id}`}
          cx={location.coordinates.x}
          cy={location.coordinates.y}
          r={isSelected ? 8 : 6}
          fill="#F59E0B"
          filter={isSelected ? 'url(#glow-strong)' : 'url(#glow)'}
          initial={false}
          animate={{
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
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
          whileHover={{ scale: 1.2 }}
          className="cursor-pointer"
          style={{ pointerEvents: 'auto', transformBox: 'fill-box', transformOrigin: 'center', willChange: 'opacity' }}
        >
          <title>{location.name}</title>
        </motion.circle>
      </g>
    )
  }

  return (
    <g>
      <motion.circle
        data-testid={`location-dot-${location.id}`}
        cx={location.coordinates.x}
        cy={location.coordinates.y}
        r={6}
        fill="#64748B"
        opacity={0.4}
        whileHover={{ opacity: 0.6 }}
        transition={{ duration: 0.2 }}
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
      </motion.circle>
      <g
        data-testid={`lock-icon-${location.id}`}
        transform={`translate(${location.coordinates.x}, ${location.coordinates.y})`}
        opacity={0.6}
        aria-hidden="true"
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
    </g>
  )
}
