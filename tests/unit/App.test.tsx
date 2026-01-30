import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, fireEvent, cleanup } from '@testing-library/react'
import { App } from '../../src/App'

afterEach(() => {
  cleanup()
})

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
    expect(tamsui?.getAttribute('filter')).toBe('url(#glow)')

    fireEvent.click(tamsui!)
    expect(tamsui?.getAttribute('filter')).toBe('url(#glow-strong)')
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
    expect(tamsui?.getAttribute('filter')).toBe('url(#glow-strong)')

    fireEvent.click(alishan!)
    expect(alishan?.getAttribute('filter')).toBe('url(#glow-strong)')
    expect(tamsui?.getAttribute('filter')).toBe('url(#glow)')
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

  it('should NOT pause audio when clicking a locked location after playing', () => {
    const { container } = render(<App />)

    // Start playing unlocked location
    const tamsui = container.querySelector('[data-testid="location-dot-tamsui"]')
    fireEvent.click(tamsui!)
    expect(mockAudio.play).toHaveBeenCalled()

    // Click locked location — audio should continue playing
    mockAudio.pause.mockClear()
    const lanyu = container.querySelector('[data-testid="location-dot-lanyu"]')
    fireEvent.click(lanyu!)
    expect(mockAudio.pause).not.toHaveBeenCalled()
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

describe('App Component — LockOverlay Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockAudio.src = ''
    mockAudio.volume = 1
    mockAudio.paused = true
    mockAudio.play.mockResolvedValue(undefined)
  })

  it('should show LockOverlay when a locked location is clicked', () => {
    const { container } = render(<App />)
    const lanyu = container.querySelector('[data-testid="location-dot-lanyu"]')
    fireEvent.click(lanyu!)

    expect(container.querySelector('[data-testid="lock-overlay"]')).not.toBeNull()
  })

  it('should NOT show LockOverlay when an unlocked location is clicked', () => {
    const { container } = render(<App />)
    const tamsui = container.querySelector('[data-testid="location-dot-tamsui"]')
    fireEvent.click(tamsui!)

    expect(container.querySelector('[data-testid="lock-overlay"]')).toBeNull()
  })

  it('should display locked location name in overlay', () => {
    const { container } = render(<App />)
    const lanyu = container.querySelector('[data-testid="location-dot-lanyu"]')
    fireEvent.click(lanyu!)

    const panel = container.querySelector('[data-testid="lock-overlay-panel"]')
    expect(panel?.querySelector('h2')?.textContent).toBe('蘭嶼飛魚季')
  })

  it('should display unlock condition in overlay', () => {
    const { container } = render(<App />)
    const lanyu = container.querySelector('[data-testid="location-dot-lanyu"]')
    fireEvent.click(lanyu!)

    const panel = container.querySelector('[data-testid="lock-overlay-panel"]')
    expect(panel?.textContent).toContain('連續好眠 14 天，解鎖這片海洋')
  })

  it('should dismiss LockOverlay when close button is clicked', () => {
    const { container } = render(<App />)
    const lanyu = container.querySelector('[data-testid="location-dot-lanyu"]')
    fireEvent.click(lanyu!)

    expect(container.querySelector('[data-testid="lock-overlay"]')).not.toBeNull()

    const closeBtn = container.querySelector('[data-testid="lock-overlay-close"]')
    fireEvent.click(closeBtn!)

    expect(container.querySelector('[data-testid="lock-overlay"]')).toBeNull()
  })

  it('should keep audio playing when locked location overlay is shown', () => {
    const { container } = render(<App />)

    // Play unlocked location first
    const tamsui = container.querySelector('[data-testid="location-dot-tamsui"]')
    fireEvent.click(tamsui!)
    expect(mockAudio.play).toHaveBeenCalled()

    // Click locked location — audio should NOT be paused
    mockAudio.pause.mockClear()
    const lanyu = container.querySelector('[data-testid="location-dot-lanyu"]')
    fireEvent.click(lanyu!)

    expect(mockAudio.pause).not.toHaveBeenCalled()
    expect(container.querySelector('[data-testid="lock-overlay"]')).not.toBeNull()
  })

  it('should keep LocationDetail visible when locked location overlay is shown after unlocked selection', () => {
    const { container } = render(<App />)

    // Select unlocked location first
    const tamsui = container.querySelector('[data-testid="location-dot-tamsui"]')
    fireEvent.click(tamsui!)
    expect(container.querySelector('[data-testid="location-detail"]')).not.toBeNull()

    // Click locked location — LocationDetail should remain
    const lanyu = container.querySelector('[data-testid="location-dot-lanyu"]')
    fireEvent.click(lanyu!)

    expect(container.querySelector('[data-testid="location-detail"]')).not.toBeNull()
    expect(container.querySelector('[data-testid="lock-overlay"]')).not.toBeNull()
  })

  it('should clear LockOverlay when clicking an unlocked location', () => {
    const { container } = render(<App />)

    // Show overlay
    const lanyu = container.querySelector('[data-testid="location-dot-lanyu"]')
    fireEvent.click(lanyu!)
    expect(container.querySelector('[data-testid="lock-overlay"]')).not.toBeNull()

    // Click unlocked location
    const tamsui = container.querySelector('[data-testid="location-dot-tamsui"]')
    fireEvent.click(tamsui!)

    expect(container.querySelector('[data-testid="lock-overlay"]')).toBeNull()
    expect(container.querySelector('[data-testid="location-detail"]')).not.toBeNull()
  })
})

describe('App Component — All 7 Locked Locations Verification', () => {
  const lockedLocations = [
    { id: 'lanyu', name: '蘭嶼飛魚季', condition: '連續好眠 14 天，解鎖這片海洋' },
    { id: 'taroko', name: '太魯閣溪流', condition: '好眠 21 天，走進太魯閣的溪谷' },
    { id: 'sunmoonlake', name: '日月潭晨曦', condition: '累積好眠 30 晚，迎接日月潭的第一道光' },
    { id: 'kenting', name: '墾丁星空', condition: '連續好眠 7 天，仰望墾丁的星空' },
    { id: 'hehuan', name: '合歡山銀河', condition: '好眠 45 天，在合歡山遇見銀河' },
    { id: 'taitung', name: '台東稻浪', condition: '連續好眠 10 天，聆聽稻浪的聲音' },
    { id: 'yushan', name: '玉山頂風聲', condition: '累積好眠 60 晚，攻頂玉山聽風' },
  ]

  lockedLocations.forEach(({ id, name, condition }) => {
    it(`should show overlay with correct name and condition for ${id}`, () => {
      const { container } = render(<App />)
      const dot = container.querySelector(`[data-testid="location-dot-${id}"]`)
      fireEvent.click(dot!)

      const overlay = container.querySelector('[data-testid="lock-overlay"]')
      expect(overlay).not.toBeNull()

      const panel = container.querySelector('[data-testid="lock-overlay-panel"]')
      expect(panel?.querySelector('h2')?.textContent).toBe(name)
      expect(panel?.textContent).toContain(condition)
    })

    it(`should dismiss overlay for ${id} when close is clicked`, () => {
      const { container } = render(<App />)
      const dot = container.querySelector(`[data-testid="location-dot-${id}"]`)
      fireEvent.click(dot!)

      expect(container.querySelector('[data-testid="lock-overlay"]')).not.toBeNull()

      const closeBtn = container.querySelector('[data-testid="lock-overlay-close"]')
      fireEvent.click(closeBtn!)

      expect(container.querySelector('[data-testid="lock-overlay"]')).toBeNull()
    })
  })

  it('should use warm positive language without countdowns or punishment framing', () => {
    const { container } = render(<App />)

    lockedLocations.forEach(({ id, condition }) => {
      const dot = container.querySelector(`[data-testid="location-dot-${id}"]`)
      fireEvent.click(dot!)

      const panel = container.querySelector('[data-testid="lock-overlay-panel"]')
      const text = panel?.textContent ?? ''

      // Verify warm language present
      expect(text).toContain(condition)

      // Verify no anxiety-inducing patterns
      expect(text).not.toContain('剩餘')
      expect(text).not.toContain('你還沒')
      expect(text).not.toContain('失敗')

      // Dismiss before next
      const closeBtn = container.querySelector('[data-testid="lock-overlay-close"]')
      fireEvent.click(closeBtn!)
    })
  })
})
