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

  it('should have animation-initial opacity for unlocked (Motion animates 0.7-1.0)', () => {
    const { container } = renderDot(unlockedLocation)
    const circle = container.querySelector('[data-testid="location-dot-tamsui"]')
    // Motion sets initial opacity from animate keyframes start value (0.7)
    expect(circle?.getAttribute('opacity')).toBe('0.7')
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

describe('LocationDot Component — Hover Interaction', () => {
  it('should render locked markers as motion-capable elements for hover effects', () => {
    const { container } = renderDot(lockedLocation)
    const circle = container.querySelector('[data-testid="location-dot-lanyu"]')
    expect(circle).not.toBeNull()
    expect(circle?.tagName.toLowerCase()).toBe('circle')
    // Locked marker should still have base opacity for dimmed state
    expect(circle?.getAttribute('opacity')).toBe('0.4')
  })

  it('should render both unlocked and locked markers as interactive cursor-pointer elements', () => {
    const { container: c1 } = renderDot(unlockedLocation)
    const { container: c2 } = renderDot(lockedLocation)
    const unlocked = c1.querySelector('[data-testid="location-dot-tamsui"]')
    const locked = c2.querySelector('[data-testid="location-dot-lanyu"]')
    // Both should be clickable interactive elements
    expect(unlocked?.getAttribute('role')).toBe('button')
    expect(locked?.getAttribute('role')).toBe('button')
  })
})

describe('LocationDot Component — Selected State', () => {
  it('should have larger radius (r=8) when selected', () => {
    const { container } = renderDot(unlockedLocation, true)
    const circle = container.querySelector('[data-testid="location-dot-tamsui"]')
    expect(circle?.getAttribute('r')).toBe('8')
  })

  it('should have standard radius (r=6) when not selected', () => {
    const { container } = renderDot(unlockedLocation, false)
    const circle = container.querySelector('[data-testid="location-dot-tamsui"]')
    expect(circle?.getAttribute('r')).toBe('6')
  })

  it('should have glow filter on both selected and non-selected unlocked markers', () => {
    const { container: c1 } = renderDot(unlockedLocation, true)
    const { container: c2 } = renderDot(unlockedLocation, false)
    const selected = c1.querySelector('[data-testid="location-dot-tamsui"]')
    const idle = c2.querySelector('[data-testid="location-dot-tamsui"]')
    expect(selected?.getAttribute('filter')).toBe('url(#glow-strong)')
    expect(idle?.getAttribute('filter')).toBe('url(#glow)')
  })

  it('should use brighter glow filter for selected markers', () => {
    const { container } = renderDot(unlockedLocation, true)
    const circle = container.querySelector('[data-testid="location-dot-tamsui"]')
    // Selected markers use a stronger glow filter
    expect(circle?.getAttribute('filter')).toBe('url(#glow-strong)')
  })
})

describe('LocationDot Component — Glow Animation', () => {
  it('should reference glow filter on unlocked markers', () => {
    const { container } = renderDot(unlockedLocation)
    const circle = container.querySelector('[data-testid="location-dot-tamsui"]')
    expect(circle?.getAttribute('filter')).toBe('url(#glow)')
  })

  it('should NOT reference glow filter on locked markers', () => {
    const { container } = renderDot(lockedLocation)
    const circle = container.querySelector('[data-testid="location-dot-lanyu"]')
    expect(circle?.getAttribute('filter')).toBeNull()
  })

  it('should use amber fill (#F59E0B) for unlocked markers with glow', () => {
    const { container } = renderDot(unlockedLocation)
    const circle = container.querySelector('[data-testid="location-dot-tamsui"]')
    expect(circle?.getAttribute('fill')).toBe('#F59E0B')
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

  it('should use SVG shapes for lock icon (not emoji text)', () => {
    const { container } = renderDot(lockedLocation)
    const lockIcon = container.querySelector('[data-testid="lock-icon-lanyu"]')
    const rect = lockIcon?.querySelector('rect')
    const path = lockIcon?.querySelector('path')
    expect(rect).not.toBeNull()
    expect(path).not.toBeNull()
    // No <text> element — SVG path approach, not emoji
    const textEl = lockIcon?.querySelector('text')
    expect(textEl).toBeNull()
  })

  it('should have white fill on lock body rect', () => {
    const { container } = renderDot(lockedLocation)
    const lockIcon = container.querySelector('[data-testid="lock-icon-lanyu"]')
    const rect = lockIcon?.querySelector('rect')
    expect(rect?.getAttribute('fill')).toBe('white')
  })

  it('should have white stroke on lock shackle path', () => {
    const { container } = renderDot(lockedLocation)
    const lockIcon = container.querySelector('[data-testid="lock-icon-lanyu"]')
    const path = lockIcon?.querySelector('path')
    expect(path?.getAttribute('stroke')).toBe('white')
  })
})
