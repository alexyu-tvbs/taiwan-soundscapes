import { useEffect, useRef } from 'react'
import type { Location } from '../types'

interface LockOverlayProps {
  location: Location
  onClose: () => void
}

export const LockOverlay = ({ location, onClose }: LockOverlayProps) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    closeButtonRef.current?.focus()
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div
      data-testid="lock-overlay"
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        data-testid="lock-overlay-panel"
        className="bg-slate-800 rounded-2xl p-8 max-w-sm text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-4xl mb-4">🔒</div>
        <h2 className="text-xl font-bold text-white mb-1">{location.name}</h2>
        <p className="text-slate-400 text-sm mb-4">{location.nameEn}</p>
        <p className="text-amber-300 text-lg">{location.unlockCondition}</p>
        <button
          ref={closeButtonRef}
          data-testid="lock-overlay-close"
          className="mt-6 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white text-sm"
          onClick={onClose}
        >
          關閉
        </button>
      </div>
    </div>
  )
}
