import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { LocationDot } from '../../src/components/LocationDot'
import type { Location } from '../../src/types'

const unlockedLocation: Location = {
  id: 'tamsui',
  name: '淡水河夕陽',
  nameEn: 'Tamsui River Sunset',
  coordinates: { x: 855, y: 365 },
  status: 'unlocked',
  audioPath: '/audio/tamsui.mp3',
  imagePath: '/images/tamsui.jpg',
  unlockCondition: '',
}

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

const renderDot = (location: Location, isSelected = false, onClick = vi.fn()) => {
  return render(
    <svg>
      <LocationDot location={location} isSelected={isSelected} onClick={onClick} />
    </svg>,
  )
}

describe('LocationDot Component — Unlocked State', () => {
  it('should render with data-testid="location-dot-{id}"', () => {
    const { container } = renderDot(unlockedLocation)
    const circle = container.querySelector('[data-testid="location-dot-tamsui"]')
    expect(circle).not.toBeNull()
    expect(circle?.tagName.toLowerCase()).toBe('circle')
  })

  it('should have cx and cy from location coordinates', () => {
    const { container } = renderDot(unlockedLocation)
    const circle = container.querySelector('[data-testid="location-dot-tamsui"]')
    expect(circle?.getAttribute('cx')).toBe('855')
    expect(circle?.getAttribute('cy')).toBe('365')
  })

  it('should have bright amber fill (#F59E0B) for unlocked', () => {
    const { container } = renderDot(unlockedLocation)
    const circle = container.querySelector('[data-testid="location-dot-tamsui"]')
    expect(circle?.getAttribute('fill')).toBe('#F59E0B')
  })

  it('should have opacity=1 for unlocked', () => {
    const { container } = renderDot(unlockedLocation)
    const circle = container.querySelector('[data-testid="location-dot-tamsui"]')
    expect(circle?.getAttribute('opacity')).toBe('1')
  })

  it('should have r=6 when not selected', () => {
    const { container } = renderDot(unlockedLocation, false)
    const circle = container.querySelector('[data-testid="location-dot-tamsui"]')
    expect(circle?.getAttribute('r')).toBe('6')
  })

  it('should have r=8 when selected', () => {
    const { container } = renderDot(unlockedLocation, true)
    const circle = container.querySelector('[data-testid="location-dot-tamsui"]')
    expect(circle?.getAttribute('r')).toBe('8')
  })

  it('should have a <title> with location name', () => {
    const { container } = renderDot(unlockedLocation)
    const circle = container.querySelector('[data-testid="location-dot-tamsui"]')
    const title = circle?.querySelector('title')
    expect(title?.textContent).toBe('淡水河夕陽')
  })

  it('should call onClick with location.id when clicked', () => {
    const onClick = vi.fn()
    const { container } = renderDot(unlockedLocation, false, onClick)
    const circle = container.querySelector('[data-testid="location-dot-tamsui"]')
    fireEvent.click(circle!)
    expect(onClick).toHaveBeenCalledWith('tamsui')
  })
})

describe('LocationDot Component — Locked State', () => {
  it('should have dimmed fill (#64748B) for locked', () => {
    const { container } = renderDot(lockedLocation)
    const circle = container.querySelector('[data-testid="location-dot-lanyu"]')
    expect(circle?.getAttribute('fill')).toBe('#64748B')
  })

  it('should have opacity=0.4 for locked', () => {
    const { container } = renderDot(lockedLocation)
    const circle = container.querySelector('[data-testid="location-dot-lanyu"]')
    expect(circle?.getAttribute('opacity')).toBe('0.4')
  })

  it('should have a <title> with locked location name', () => {
    const { container } = renderDot(lockedLocation)
    const circle = container.querySelector('[data-testid="location-dot-lanyu"]')
    const title = circle?.querySelector('title')
    expect(title?.textContent).toBe('蘭嶼飛魚季')
  })

  it('should still be clickable when locked', () => {
    const onClick = vi.fn()
    const { container } = renderDot(lockedLocation, false, onClick)
    const circle = container.querySelector('[data-testid="location-dot-lanyu"]')
    fireEvent.click(circle!)
    expect(onClick).toHaveBeenCalledWith('lanyu')
  })
})

describe('LocationDot Component — Keyboard Accessibility', () => {
  it('should have tabIndex=0 for keyboard focus', () => {
    const { container } = renderDot(unlockedLocation)
    const circle = container.querySelector('[data-testid="location-dot-tamsui"]')
    expect(circle?.getAttribute('tabindex')).toBe('0')
  })

  it('should have role="button"', () => {
    const { container } = renderDot(unlockedLocation)
    const circle = container.querySelector('[data-testid="location-dot-tamsui"]')
    expect(circle?.getAttribute('role')).toBe('button')
  })

  it('should have aria-label with location name', () => {
    const { container } = renderDot(unlockedLocation)
    const circle = container.querySelector('[data-testid="location-dot-tamsui"]')
    expect(circle?.getAttribute('aria-label')).toBe('淡水河夕陽')
  })

  it('should trigger onClick on Enter key', () => {
    const onClick = vi.fn()
    const { container } = renderDot(unlockedLocation, false, onClick)
    const circle = container.querySelector('[data-testid="location-dot-tamsui"]')
    fireEvent.keyDown(circle!, { key: 'Enter' })
    expect(onClick).toHaveBeenCalledWith('tamsui')
  })

  it('should trigger onClick on Space key', () => {
    const onClick = vi.fn()
    const { container } = renderDot(unlockedLocation, false, onClick)
    const circle = container.querySelector('[data-testid="location-dot-tamsui"]')
    fireEvent.keyDown(circle!, { key: ' ' })
    expect(onClick).toHaveBeenCalledWith('tamsui')
  })
})

describe('LocationDot Component — Lock Indicator', () => {
  it('should render a lock icon for locked locations', () => {
    const { container } = renderDot(lockedLocation)
    const lockIcon = container.querySelector('[data-testid="lock-icon-lanyu"]')
    expect(lockIcon).not.toBeNull()
  })

  it('should NOT render a lock icon for unlocked locations', () => {
    const { container } = renderDot(unlockedLocation)
    const lockIcon = container.querySelector('[data-testid="lock-icon-tamsui"]')
    expect(lockIcon).toBeNull()
  })

  it('should render lock icon as an SVG group element', () => {
    const { container } = renderDot(lockedLocation)
    const lockIcon = container.querySelector('[data-testid="lock-icon-lanyu"]')
    expect(lockIcon?.tagName.toLowerCase()).toBe('g')
  })

  it('should position lock icon at location coordinates via transform', () => {
    const { container } = renderDot(lockedLocation)
    const lockIcon = container.querySelector('[data-testid="lock-icon-lanyu"]')
    expect(lockIcon?.getAttribute('transform')).toBe('translate(885, 1255)')
  })

  it('should have pointer-events none on lock icon', () => {
    const { container } = renderDot(lockedLocation)
    const lockIcon = container.querySelector('[data-testid="lock-icon-lanyu"]')
    expect(lockIcon).not.toBeNull()
    expect(lockIcon?.style.pointerEvents).toBe('none')
  })

  it('should render lock icon with reduced opacity', () => {
    const { container } = renderDot(lockedLocation)
    const lockIcon = container.querySelector('[data-testid="lock-icon-lanyu"]')
    expect(lockIcon?.getAttribute('opacity')).toBe('0.6')
  })
})
