import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, fireEvent, cleanup } from '@testing-library/react'
import { App } from '../../src/App'

// Mock Audio for App integration tests
const mockAudio = {
  src: '',
  volume: 1,
  paused: true,
  play: vi.fn().mockResolvedValue(undefined),
  pause: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
}

vi.stubGlobal(
  'Audio',
  class {
    constructor() {
      return mockAudio
    }
  }
)

describe('App Component — Map Integration', () => {
  it('should render the TaiwanMap SVG', () => {
    const { container } = render(<App />)
    const map = container.querySelector('[data-testid="taiwan-map"]')
    expect(map).not.toBeNull()
  })

  it('should render all 10 location dots', () => {
    const { container } = render(<App />)
    const dots = container.querySelectorAll('[data-testid^="location-dot-"]')
    expect(dots.length).toBe(10)
  })

  it('should update selectedLocationId when a location is clicked', () => {
    const { container } = render(<App />)
    const tamsui = container.querySelector('[data-testid="location-dot-tamsui"]')
    expect(tamsui?.getAttribute('r')).toBe('6')

    fireEvent.click(tamsui!)
    expect(tamsui?.getAttribute('r')).toBe('8')
  })

  it('should display brand tagline "好眠秘境 — 用耳朵旅行台灣"', () => {
    const { container } = render(<App />)
    const tagline = container.querySelector('[data-testid="brand-tagline"]')
    expect(tagline).not.toBeNull()
    expect(tagline?.textContent).toBe('好眠秘境 — 用耳朵旅行台灣')
  })

  it('should deselect previous marker when selecting a new one', () => {
    const { container } = render(<App />)
    const tamsui = container.querySelector('[data-testid="location-dot-tamsui"]')
    const alishan = container.querySelector('[data-testid="location-dot-alishan"]')

    fireEvent.click(tamsui!)
    expect(tamsui?.getAttribute('r')).toBe('8')

    fireEvent.click(alishan!)
    expect(alishan?.getAttribute('r')).toBe('8')
    expect(tamsui?.getAttribute('r')).toBe('6')
  })
})

describe('App Component — Audio Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockAudio.src = ''
    mockAudio.volume = 1
    mockAudio.paused = true
    mockAudio.play.mockResolvedValue(undefined)
  })

  it('should show SoundscapePlayer when an unlocked location is clicked', () => {
    const { container } = render(<App />)
    // Initially no player
    expect(container.querySelector('[data-testid="soundscape-player"]')).toBeNull()

    // Click unlocked location (tamsui)
    const tamsui = container.querySelector('[data-testid="location-dot-tamsui"]')
    fireEvent.click(tamsui!)

    expect(container.querySelector('[data-testid="soundscape-player"]')).not.toBeNull()
  })

  it('should NOT show SoundscapePlayer when a locked location is clicked', () => {
    const { container } = render(<App />)
    // Click locked location (lanyu)
    const lanyu = container.querySelector('[data-testid="location-dot-lanyu"]')
    fireEvent.click(lanyu!)

    expect(container.querySelector('[data-testid="soundscape-player"]')).toBeNull()
  })

  it('should call audio.play() when an unlocked location is clicked', () => {
    const { container } = render(<App />)
    const tamsui = container.querySelector('[data-testid="location-dot-tamsui"]')
    fireEvent.click(tamsui!)

    expect(mockAudio.play).toHaveBeenCalled()
    expect(mockAudio.src).toBe('/audio/tamsui.mp3')
  })

  it('should display the selected location name in SoundscapePlayer', () => {
    const { container } = render(<App />)
    const tamsui = container.querySelector('[data-testid="location-dot-tamsui"]')
    fireEvent.click(tamsui!)

    const player = container.querySelector('[data-testid="soundscape-player"]')
    expect(player?.textContent).toContain('淡水河夕陽')
  })

  it('should support pause and resume flow through SoundscapePlayer', () => {
    const { container } = render(<App />)

    // Click unlocked location to start playback
    const tamsui = container.querySelector('[data-testid="location-dot-tamsui"]')
    fireEvent.click(tamsui!)

    const btn = container.querySelector('[data-testid="play-pause-btn"]')
    expect(btn?.getAttribute('aria-label')).toBe('Pause')

    // Click pause
    fireEvent.click(btn!)
    expect(btn?.getAttribute('aria-label')).toBe('Play')
    expect(mockAudio.pause).toHaveBeenCalled()

    // Click play (resume)
    mockAudio.play.mockClear()
    fireEvent.click(btn!)
    expect(btn?.getAttribute('aria-label')).toBe('Pause')
    expect(mockAudio.play).toHaveBeenCalled()
  })

  it('should switch audio when clicking a different unlocked location', () => {
    const { container } = render(<App />)

    const tamsui = container.querySelector('[data-testid="location-dot-tamsui"]')
    fireEvent.click(tamsui!)
    expect(mockAudio.src).toBe('/audio/tamsui.mp3')

    const alishan = container.querySelector('[data-testid="location-dot-alishan"]')
    fireEvent.click(alishan!)
    expect(mockAudio.src).toBe('/audio/alishan.mp3')
  })
})

describe('App Component — LocationDetail Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockAudio.src = ''
    mockAudio.volume = 1
    mockAudio.paused = true
    mockAudio.play.mockResolvedValue(undefined)
  })

  afterEach(() => {
    cleanup()
  })

  it('should show LocationDetail when an unlocked location is clicked', () => {
    const { container } = render(<App />)
    expect(container.querySelector('[data-testid="location-detail"]')).toBeNull()

    const tamsui = container.querySelector('[data-testid="location-dot-tamsui"]')
    fireEvent.click(tamsui!)

    expect(container.querySelector('[data-testid="location-detail"]')).not.toBeNull()
  })

  it('should NOT show LocationDetail when a locked location is clicked', () => {
    const { container } = render(<App />)
    const lanyu = container.querySelector('[data-testid="location-dot-lanyu"]')
    fireEvent.click(lanyu!)

    expect(container.querySelector('[data-testid="location-detail"]')).toBeNull()
  })

  it('should display location name in LocationDetail panel', () => {
    const { container } = render(<App />)
    const tamsui = container.querySelector('[data-testid="location-dot-tamsui"]')
    fireEvent.click(tamsui!)

    const detail = container.querySelector('[data-testid="location-detail"]')
    expect(detail?.querySelector('h2')?.textContent).toBe('淡水河夕陽')
  })

  it('should display scene photograph in LocationDetail panel', () => {
    const { container } = render(<App />)
    const tamsui = container.querySelector('[data-testid="location-dot-tamsui"]')
    fireEvent.click(tamsui!)

    const detail = container.querySelector('[data-testid="location-detail"]')
    const img = detail?.querySelector('img')
    expect(img).not.toBeNull()
    expect(img?.getAttribute('src')).toBe('/images/tamsui.jpg')
  })

  it('should update LocationDetail when switching between unlocked locations', () => {
    const { container } = render(<App />)

    const tamsui = container.querySelector('[data-testid="location-dot-tamsui"]')
    fireEvent.click(tamsui!)
    expect(container.querySelector('[data-testid="location-detail"] h2')?.textContent).toBe('淡水河夕陽')

    const alishan = container.querySelector('[data-testid="location-dot-alishan"]')
    fireEvent.click(alishan!)
    expect(container.querySelector('[data-testid="location-detail"] h2')?.textContent).toBe('阿里山雲海')
    expect(container.querySelector('[data-testid="location-detail"] img')?.getAttribute('src')).toBe('/images/alishan.jpg')
  })

  it('should show both LocationDetail and SoundscapePlayer when unlocked location selected', () => {
    const { container } = render(<App />)
    const tamsui = container.querySelector('[data-testid="location-dot-tamsui"]')
    fireEvent.click(tamsui!)

    expect(container.querySelector('[data-testid="location-detail"]')).not.toBeNull()
    expect(container.querySelector('[data-testid="soundscape-player"]')).not.toBeNull()
  })
})
