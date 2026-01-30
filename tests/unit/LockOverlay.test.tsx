import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { LockOverlay } from '../../src/components/LockOverlay'
import type { Location } from '../../src/types'

const lockedLocation: Location = {
  id: 'lanyu',
  name: '蘭嶼飛魚季',
  nameEn: 'Lanyu Flying Fish Festival',
  coordinates: { x: 885, y: 1255 },
  status: 'locked',
  audioPath: '/audio/lanyu.mp3',
  imagePath: '/images/lanyu.jpg',
  unlockCondition: '連續好眠 14 天，解鎖這片海洋',
}

describe('LockOverlay Component — Display', () => {
  it('should render the overlay with data-testid="lock-overlay"', () => {
    const { container } = render(<LockOverlay location={lockedLocation} onClose={vi.fn()} />)
    expect(container.querySelector('[data-testid="lock-overlay"]')).not.toBeNull()
  })

  it('should display the location name prominently', () => {
    const { container } = render(<LockOverlay location={lockedLocation} onClose={vi.fn()} />)
    const panel = container.querySelector('[data-testid="lock-overlay-panel"]')
    expect(panel?.querySelector('h2')?.textContent).toBe('蘭嶼飛魚季')
  })

  it('should display the English name as subtitle', () => {
    const { container } = render(<LockOverlay location={lockedLocation} onClose={vi.fn()} />)
    const panel = container.querySelector('[data-testid="lock-overlay-panel"]')
    const subtitle = panel?.querySelectorAll('p')[0]
    expect(subtitle?.textContent).toBe('Lanyu Flying Fish Festival')
  })

  it('should display the unlock condition text', () => {
    const { container } = render(<LockOverlay location={lockedLocation} onClose={vi.fn()} />)
    const panel = container.querySelector('[data-testid="lock-overlay-panel"]')
    const condition = panel?.querySelectorAll('p')[1]
    expect(condition?.textContent).toBe('連續好眠 14 天，解鎖這片海洋')
  })

  it('should display a lock emoji', () => {
    const { container } = render(<LockOverlay location={lockedLocation} onClose={vi.fn()} />)
    const panel = container.querySelector('[data-testid="lock-overlay-panel"]')
    expect(panel?.textContent).toContain('🔒')
  })

  it('should have a close button', () => {
    const { container } = render(<LockOverlay location={lockedLocation} onClose={vi.fn()} />)
    const closeBtn = container.querySelector('[data-testid="lock-overlay-close"]')
    expect(closeBtn).not.toBeNull()
  })
})

describe('LockOverlay Component — Dismiss Behavior', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('should call onClose when close button is clicked', () => {
    const onClose = vi.fn()
    const { container } = render(<LockOverlay location={lockedLocation} onClose={onClose} />)
    const closeBtn = container.querySelector('[data-testid="lock-overlay-close"]')
    fireEvent.click(closeBtn!)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('should call onClose when backdrop is clicked', () => {
    const onClose = vi.fn()
    const { container } = render(<LockOverlay location={lockedLocation} onClose={onClose} />)
    const backdrop = container.querySelector('[data-testid="lock-overlay"]')
    fireEvent.click(backdrop!)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('should NOT call onClose when panel content is clicked', () => {
    const onClose = vi.fn()
    const { container } = render(<LockOverlay location={lockedLocation} onClose={onClose} />)
    const panel = container.querySelector('[data-testid="lock-overlay-panel"]')
    fireEvent.click(panel!)
    expect(onClose).not.toHaveBeenCalled()
  })

  it('should call onClose when Escape key is pressed', () => {
    const onClose = vi.fn()
    render(<LockOverlay location={lockedLocation} onClose={onClose} />)
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})

describe('LockOverlay Component — Accessibility', () => {
  it('should have role="dialog" on overlay', () => {
    const { container } = render(<LockOverlay location={lockedLocation} onClose={vi.fn()} />)
    const overlay = container.querySelector('[data-testid="lock-overlay"]')
    expect(overlay?.getAttribute('role')).toBe('dialog')
  })

  it('should have aria-modal="true" on overlay', () => {
    const { container } = render(<LockOverlay location={lockedLocation} onClose={vi.fn()} />)
    const overlay = container.querySelector('[data-testid="lock-overlay"]')
    expect(overlay?.getAttribute('aria-modal')).toBe('true')
  })

  it('should focus close button on mount', () => {
    const { container } = render(<LockOverlay location={lockedLocation} onClose={vi.fn()} />)
    const closeBtn = container.querySelector('[data-testid="lock-overlay-close"]')
    expect(document.activeElement).toBe(closeBtn)
  })
})
