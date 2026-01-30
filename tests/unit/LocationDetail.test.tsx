import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, fireEvent, cleanup } from '@testing-library/react'
import { LocationDetail } from '../../src/components/LocationDetail'
import type { Location } from '../../src/types'

afterEach(() => {
  cleanup()
})

const mockLocation: Location = {
  id: 'tamsui',
  name: '淡水河夕陽',
  nameEn: 'Tamsui River Sunset',
  coordinates: { x: 855, y: 365 },
  status: 'unlocked',
  audioPath: '/audio/tamsui.mp3',
  imagePath: '/images/tamsui.jpg',
  unlockCondition: '',
}

describe('LocationDetail', () => {
  it('should display the location name (zh)', () => {
    const { container } = render(
      <LocationDetail location={mockLocation} isPlaying={false} />
    )
    const h2 = container.querySelector('h2')
    expect(h2).not.toBeNull()
    expect(h2?.textContent).toBe('淡水河夕陽')
  })

  it('should display the location English name as subtitle', () => {
    const { container } = render(
      <LocationDetail location={mockLocation} isPlaying={false} />
    )
    const subtitle = container.querySelector('p')
    expect(subtitle).not.toBeNull()
    expect(subtitle?.textContent).toBe('Tamsui River Sunset')
  })

  it('should render scene photograph with correct src', () => {
    const { container } = render(
      <LocationDetail location={mockLocation} isPlaying={false} />
    )
    const img = container.querySelector('img')
    expect(img).not.toBeNull()
    expect(img?.getAttribute('src')).toBe('/images/tamsui.jpg')
  })

  it('should set alt text to location English name', () => {
    const { container } = render(
      <LocationDetail location={mockLocation} isPlaying={false} />
    )
    const img = container.querySelector('img')
    expect(img?.getAttribute('alt')).toBe('Tamsui River Sunset')
  })

  it('should have dark theme styling with semi-transparent background', () => {
    const { container } = render(
      <LocationDetail location={mockLocation} isPlaying={false} />
    )
    const panel = container.querySelector('[data-testid="location-detail"]')
    expect(panel).not.toBeNull()
    expect(panel?.className).toContain('backdrop-blur')
  })

  it('should have rounded corners styling', () => {
    const { container } = render(
      <LocationDetail location={mockLocation} isPlaying={false} />
    )
    const panel = container.querySelector('[data-testid="location-detail"]')
    expect(panel?.className).toMatch(/rounded/)
  })

  it('should console.warn on image load failure and not throw', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const { container } = render(
      <LocationDetail location={mockLocation} isPlaying={false} />
    )
    const img = container.querySelector('img')!
    fireEvent.error(img)

    expect(warnSpy).toHaveBeenCalledWith(
      'Failed to load image: /images/tamsui.jpg'
    )
    warnSpy.mockRestore()
  })

  it('should show dark placeholder when image fails to load', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    const { container } = render(
      <LocationDetail location={mockLocation} isPlaying={false} />
    )
    const img = container.querySelector('img')!
    fireEvent.error(img)

    // Image should be replaced by placeholder
    expect(container.querySelector('img')).toBeNull()
    const placeholder = container.querySelector('[data-testid="image-placeholder"]')
    expect(placeholder).not.toBeNull()
    expect(placeholder?.textContent).toContain('Image unavailable')
    vi.restoreAllMocks()
  })

  it('should still show location name when image fails to load', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    const { container } = render(
      <LocationDetail location={mockLocation} isPlaying={false} />
    )
    const img = container.querySelector('img')!
    fireEvent.error(img)

    const h2 = container.querySelector('h2')
    expect(h2?.textContent).toBe('淡水河夕陽')
    vi.restoreAllMocks()
  })

  it('should reset image error state when location changes', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    const alishan: Location = {
      id: 'alishan',
      name: '阿里山雲海',
      nameEn: 'Alishan Sea of Clouds',
      coordinates: { x: 700, y: 840 },
      status: 'unlocked',
      audioPath: '/audio/alishan.mp3',
      imagePath: '/images/alishan.jpg',
      unlockCondition: '',
    }

    const { container, rerender } = render(
      <LocationDetail location={mockLocation} isPlaying={false} />
    )
    // Trigger error on first location
    const img = container.querySelector('img')!
    fireEvent.error(img)
    expect(container.querySelector('[data-testid="image-placeholder"]')).not.toBeNull()

    // Switch location — error should reset
    rerender(<LocationDetail location={alishan} isPlaying={false} />)
    expect(container.querySelector('img')).not.toBeNull()
    expect(container.querySelector('[data-testid="image-placeholder"]')).toBeNull()
    vi.restoreAllMocks()
  })

  it('should update when location prop changes', () => {
    const alishan: Location = {
      id: 'alishan',
      name: '阿里山雲海',
      nameEn: 'Alishan Sea of Clouds',
      coordinates: { x: 700, y: 840 },
      status: 'unlocked',
      audioPath: '/audio/alishan.mp3',
      imagePath: '/images/alishan.jpg',
      unlockCondition: '',
    }

    const { container, rerender } = render(
      <LocationDetail location={mockLocation} isPlaying={false} />
    )
    expect(container.querySelector('h2')?.textContent).toBe('淡水河夕陽')

    rerender(<LocationDetail location={alishan} isPlaying={false} />)
    expect(container.querySelector('h2')?.textContent).toBe('阿里山雲海')
    expect(container.querySelector('img')?.getAttribute('src')).toBe(
      '/images/alishan.jpg'
    )
  })
})
