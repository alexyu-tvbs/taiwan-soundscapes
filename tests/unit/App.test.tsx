import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, fireEvent, cleanup, waitFor, act } from '@testing-library/react'
import { MotionGlobalConfig } from 'motion'
import { App } from '../../src/App'

// Skip motion animations so AnimatePresence exit/enter complete faster
MotionGlobalConfig.skipAnimations = true

afterEach(() => {
  cleanup()
})

// Helper: complete onboarding by answering all 5 questions and clicking CTA
const completeOnboarding = async (container: HTMLElement) => {
  // Answer all 5 questions
  for (let i = 0; i < 5; i++) {
    await waitFor(() => {
      expect(container.querySelector('[data-testid="option-0"]')).not.toBeNull()
    })
    await act(async () => {
      fireEvent.click(container.querySelector('[data-testid="option-0"]')!)
      await new Promise((r) => setTimeout(r, 0))
    })
  }
  // Wait for result screen and click CTA
  await waitFor(() => {
    expect(container.querySelector('[data-testid="start-plan-btn"]')).not.toBeNull()
  })
  await act(async () => {
    fireEvent.click(container.querySelector('[data-testid="start-plan-btn"]')!)
    await new Promise((r) => setTimeout(r, 0))
  })
  // Wait for TabBar to appear (onboarding complete)
  await waitFor(() => {
    expect(container.querySelector('[data-testid="tab-bar"]')).not.toBeNull()
  })
}

// Helper: navigate to the Explore tab and wait for map to appear
const navigateToExplore = async (container: HTMLElement) => {
  const tabBar = container.querySelector('[data-testid="tab-bar"]')
  const exploreBtn = tabBar?.querySelectorAll('button')[1]
  if (exploreBtn) {
    await act(async () => {
      fireEvent.click(exploreBtn)
      // Allow AnimatePresence mode="wait" exit lifecycle to complete
      await new Promise((r) => setTimeout(r, 0))
    })
    await waitFor(() => {
      expect(container.querySelector('[data-testid="taiwan-map"]')).not.toBeNull()
    })
  }
}

// Helper: navigate to any tab by index and wait for content change
const navigateToTab = async (
  container: HTMLElement,
  tabIndex: number,
  waitForText?: string
) => {
  const tabBar = container.querySelector('[data-testid="tab-bar"]')
  const btn = tabBar?.querySelectorAll('button')[tabIndex]
  if (btn) {
    await act(async () => {
      fireEvent.click(btn)
      await new Promise((r) => setTimeout(r, 0))
    })
    if (waitForText) {
      await waitFor(() => {
        expect(container.textContent).toContain(waitForText)
      })
    }
  }
}

// AnimatePresence exit animation keeps elements in DOM with opacity: 0.
// This helper validates that an overlay is visually dismissed (either removed or in exit state).
const expectOverlayDismissed = (container: HTMLElement) => {
  const overlay = container.querySelector('[data-testid="lock-overlay"]') as HTMLElement | null
  expect(overlay === null || overlay.style.opacity === '0').toBe(true)
}

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
  it('should render the TaiwanMap SVG on explore tab', async () => {
    const { container } = render(<App />)
    await completeOnboarding(container)
    await navigateToExplore(container)
    const map = container.querySelector('[data-testid="taiwan-map"]')
    expect(map).not.toBeNull()
  })

  it('should render all 10 location dots on explore tab', async () => {
    const { container } = render(<App />)
    await completeOnboarding(container)
    await navigateToExplore(container)
    const dots = container.querySelectorAll('[data-testid^="location-dot-"]')
    expect(dots.length).toBe(10)
  })

  it('should update selectedLocationId when a location is clicked', async () => {
    const { container } = render(<App />)
    await completeOnboarding(container)
    await navigateToExplore(container)
    const tamsui = container.querySelector('[data-testid="location-dot-tamsui"]')
    expect(tamsui?.getAttribute('filter')).toBe('url(#glow)')

    fireEvent.click(tamsui!)
    expect(tamsui?.getAttribute('filter')).toBe('url(#glow-strong)')
  })

  it('should display brand tagline "好眠秘境 — 用耳朵旅行台灣"', async () => {
    const { container } = render(<App />)
    await completeOnboarding(container)
    const tagline = container.querySelector('[data-testid="brand-tagline"]')
    expect(tagline).not.toBeNull()
    expect(tagline?.textContent).toBe('好眠秘境 — 用耳朵旅行台灣')
  })

  it('should deselect previous marker when selecting a new one', async () => {
    const { container } = render(<App />)
    await completeOnboarding(container)
    await navigateToExplore(container)
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

  it('should show SoundscapePlayer when an unlocked location is clicked', async () => {
    const { container } = render(<App />)
    await completeOnboarding(container)
    await navigateToExplore(container)
    // Initially no player
    expect(container.querySelector('[data-testid="soundscape-player"]')).toBeNull()

    // Click unlocked location (tamsui)
    const tamsui = container.querySelector('[data-testid="location-dot-tamsui"]')
    fireEvent.click(tamsui!)

    expect(container.querySelector('[data-testid="soundscape-player"]')).not.toBeNull()
  })

  it('should NOT show SoundscapePlayer when a locked location is clicked', async () => {
    const { container } = render(<App />)
    await completeOnboarding(container)
    await navigateToExplore(container)
    // Click locked location (lanyu)
    const lanyu = container.querySelector('[data-testid="location-dot-lanyu"]')
    fireEvent.click(lanyu!)

    expect(container.querySelector('[data-testid="soundscape-player"]')).toBeNull()
  })

  it('should call audio.play() when an unlocked location is clicked', async () => {
    const { container } = render(<App />)
    await completeOnboarding(container)
    await navigateToExplore(container)
    const tamsui = container.querySelector('[data-testid="location-dot-tamsui"]')
    fireEvent.click(tamsui!)

    expect(mockAudio.play).toHaveBeenCalled()
    expect(mockAudio.src).toBe('/audio/tamsui.mp3')
  })

  it('should display the selected location name in SoundscapePlayer', async () => {
    const { container } = render(<App />)
    await completeOnboarding(container)
    await navigateToExplore(container)
    const tamsui = container.querySelector('[data-testid="location-dot-tamsui"]')
    fireEvent.click(tamsui!)

    const player = container.querySelector('[data-testid="soundscape-player"]')
    expect(player?.textContent).toContain('淡水河夕陽')
  })

  it('should support pause and resume flow through SoundscapePlayer', async () => {
    const { container } = render(<App />)
    await completeOnboarding(container)
    await navigateToExplore(container)

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

  it('should switch audio when clicking a different unlocked location', async () => {
    const { container } = render(<App />)
    await completeOnboarding(container)
    await navigateToExplore(container)

    const tamsui = container.querySelector('[data-testid="location-dot-tamsui"]')
    fireEvent.click(tamsui!)
    expect(mockAudio.src).toBe('/audio/tamsui.mp3')

    const alishan = container.querySelector('[data-testid="location-dot-alishan"]')
    fireEvent.click(alishan!)
    expect(mockAudio.src).toBe('/audio/alishan.mp3')
  })

  it('should NOT pause audio when clicking a locked location after playing', async () => {
    const { container } = render(<App />)
    await completeOnboarding(container)
    await navigateToExplore(container)

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

  it('should show LocationDetail when an unlocked location is clicked', async () => {
    const { container } = render(<App />)
    await completeOnboarding(container)
    await navigateToExplore(container)
    expect(container.querySelector('[data-testid="location-detail"]')).toBeNull()

    const tamsui = container.querySelector('[data-testid="location-dot-tamsui"]')
    fireEvent.click(tamsui!)

    expect(container.querySelector('[data-testid="location-detail"]')).not.toBeNull()
  })

  it('should NOT show LocationDetail when a locked location is clicked', async () => {
    const { container } = render(<App />)
    await completeOnboarding(container)
    await navigateToExplore(container)
    const lanyu = container.querySelector('[data-testid="location-dot-lanyu"]')
    fireEvent.click(lanyu!)

    expect(container.querySelector('[data-testid="location-detail"]')).toBeNull()
  })

  it('should display location name in LocationDetail panel', async () => {
    const { container } = render(<App />)
    await completeOnboarding(container)
    await navigateToExplore(container)
    const tamsui = container.querySelector('[data-testid="location-dot-tamsui"]')
    fireEvent.click(tamsui!)

    const detail = container.querySelector('[data-testid="location-detail"]')
    expect(detail?.querySelector('h2')?.textContent).toBe('淡水河夕陽')
  })

  it('should display scene photograph in LocationDetail panel', async () => {
    const { container } = render(<App />)
    await completeOnboarding(container)
    await navigateToExplore(container)
    const tamsui = container.querySelector('[data-testid="location-dot-tamsui"]')
    fireEvent.click(tamsui!)

    const detail = container.querySelector('[data-testid="location-detail"]')
    const img = detail?.querySelector('img')
    expect(img).not.toBeNull()
    expect(img?.getAttribute('src')).toBe('/images/tamsui.jpg')
  })

  it('should update LocationDetail when switching between unlocked locations', async () => {
    const { container } = render(<App />)
    await completeOnboarding(container)
    await navigateToExplore(container)

    const tamsui = container.querySelector('[data-testid="location-dot-tamsui"]')
    fireEvent.click(tamsui!)
    expect(container.querySelector('[data-testid="location-detail"] h2')?.textContent).toBe('淡水河夕陽')

    const alishan = container.querySelector('[data-testid="location-dot-alishan"]')
    fireEvent.click(alishan!)
    // AnimatePresence keeps exiting + entering elements in DOM during transition;
    // the newest (entering) element is the last in document order
    const details = container.querySelectorAll('[data-testid="location-detail"]')
    const latestDetail = details[details.length - 1]
    expect(latestDetail?.querySelector('h2')?.textContent).toBe('阿里山雲海')
    expect(latestDetail?.querySelector('img')?.getAttribute('src')).toBe('/images/alishan.jpg')
  })

  it('should show both LocationDetail and SoundscapePlayer when unlocked location selected', async () => {
    const { container } = render(<App />)
    await completeOnboarding(container)
    await navigateToExplore(container)
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

  it('should show LockOverlay when a locked location is clicked', async () => {
    const { container } = render(<App />)
    await completeOnboarding(container)
    await navigateToExplore(container)
    const lanyu = container.querySelector('[data-testid="location-dot-lanyu"]')
    fireEvent.click(lanyu!)

    expect(container.querySelector('[data-testid="lock-overlay"]')).not.toBeNull()
  })

  it('should NOT show LockOverlay when an unlocked location is clicked', async () => {
    const { container } = render(<App />)
    await completeOnboarding(container)
    await navigateToExplore(container)
    const tamsui = container.querySelector('[data-testid="location-dot-tamsui"]')
    fireEvent.click(tamsui!)

    expect(container.querySelector('[data-testid="lock-overlay"]')).toBeNull()
  })

  it('should display locked location name in overlay', async () => {
    const { container } = render(<App />)
    await completeOnboarding(container)
    await navigateToExplore(container)
    const lanyu = container.querySelector('[data-testid="location-dot-lanyu"]')
    fireEvent.click(lanyu!)

    const panel = container.querySelector('[data-testid="lock-overlay-panel"]')
    expect(panel?.querySelector('h2')?.textContent).toBe('蘭嶼飛魚季')
  })

  it('should display unlock condition in overlay', async () => {
    const { container } = render(<App />)
    await completeOnboarding(container)
    await navigateToExplore(container)
    const lanyu = container.querySelector('[data-testid="location-dot-lanyu"]')
    fireEvent.click(lanyu!)

    const panel = container.querySelector('[data-testid="lock-overlay-panel"]')
    expect(panel?.textContent).toContain('連續好眠 14 天，解鎖這片海洋')
  })

  it('should dismiss LockOverlay when close button is clicked', async () => {
    const { container } = render(<App />)
    await completeOnboarding(container)
    await navigateToExplore(container)
    const lanyu = container.querySelector('[data-testid="location-dot-lanyu"]')
    fireEvent.click(lanyu!)

    expect(container.querySelector('[data-testid="lock-overlay"]')).not.toBeNull()

    const closeBtn = container.querySelector('[data-testid="lock-overlay-close"]')
    fireEvent.click(closeBtn!)

    expectOverlayDismissed(container)
  })

  it('should keep audio playing when locked location overlay is shown', async () => {
    const { container } = render(<App />)
    await completeOnboarding(container)
    await navigateToExplore(container)

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

  it('should keep LocationDetail visible when locked location overlay is shown after unlocked selection', async () => {
    const { container } = render(<App />)
    await completeOnboarding(container)
    await navigateToExplore(container)

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

  it('should clear LockOverlay when clicking an unlocked location', async () => {
    const { container } = render(<App />)
    await completeOnboarding(container)
    await navigateToExplore(container)

    // Show overlay
    const lanyu = container.querySelector('[data-testid="location-dot-lanyu"]')
    fireEvent.click(lanyu!)
    expect(container.querySelector('[data-testid="lock-overlay"]')).not.toBeNull()

    // Click unlocked location
    const tamsui = container.querySelector('[data-testid="location-dot-tamsui"]')
    fireEvent.click(tamsui!)

    expectOverlayDismissed(container)
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
    it(`should show overlay with correct name and condition for ${id}`, async () => {
      const { container } = render(<App />)
      await completeOnboarding(container)
      await navigateToExplore(container)
      const dot = container.querySelector(`[data-testid="location-dot-${id}"]`)
      fireEvent.click(dot!)

      const overlay = container.querySelector('[data-testid="lock-overlay"]')
      expect(overlay).not.toBeNull()

      const panel = container.querySelector('[data-testid="lock-overlay-panel"]')
      expect(panel?.querySelector('h2')?.textContent).toBe(name)
      expect(panel?.textContent).toContain(condition)
    })

    it(`should dismiss overlay for ${id} when close is clicked`, async () => {
      const { container } = render(<App />)
      await completeOnboarding(container)
      await navigateToExplore(container)
      const dot = container.querySelector(`[data-testid="location-dot-${id}"]`)
      fireEvent.click(dot!)

      expect(container.querySelector('[data-testid="lock-overlay"]')).not.toBeNull()

      const closeBtn = container.querySelector('[data-testid="lock-overlay-close"]')
      fireEvent.click(closeBtn!)

      expectOverlayDismissed(container)
    })
  })

  it('should use warm positive language without countdowns or punishment framing', async () => {
    const { container } = render(<App />)
    await completeOnboarding(container)
    await navigateToExplore(container)

    lockedLocations.forEach(({ id, condition }) => {
      const dot = container.querySelector(`[data-testid="location-dot-${id}"]`)
      fireEvent.click(dot!)

      // AnimatePresence may keep exiting overlays in DOM; find the latest panel
      const panels = container.querySelectorAll('[data-testid="lock-overlay-panel"]')
      const panel = panels[panels.length - 1]
      const text = panel?.textContent ?? ''

      // Verify warm language present
      expect(text).toContain(condition)

      // Verify no anxiety-inducing patterns
      expect(text).not.toContain('剩餘')
      expect(text).not.toContain('你還沒')
      expect(text).not.toContain('失敗')

      // Dismiss before next
      const closeBtns = container.querySelectorAll('[data-testid="lock-overlay-close"]')
      const closeBtn = closeBtns[closeBtns.length - 1]
      fireEvent.click(closeBtn!)
    })
  })
})

describe('App Component — Phase 2 Tab Navigation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockAudio.src = ''
    mockAudio.volume = 1
    mockAudio.paused = true
    mockAudio.play.mockResolvedValue(undefined)
  })

  it('should render TabBar after onboarding complete', async () => {
    const { container } = render(<App />)
    await completeOnboarding(container)
    expect(container.querySelector('[data-testid="tab-bar"]')).not.toBeNull()
  })

  it('should default to tonight tab after onboarding', async () => {
    const { container } = render(<App />)
    await completeOnboarding(container)
    // Tonight tab should be active (amber), map should NOT be visible
    expect(container.querySelector('[data-testid="taiwan-map"]')).toBeNull()
    // Tonight placeholder should be visible
    expect(container.textContent).toContain('今晚的處方')
  })

  it('should show explore content (map) when explore tab is clicked', async () => {
    const { container } = render(<App />)
    await completeOnboarding(container)
    await navigateToExplore(container)
    expect(container.querySelector('[data-testid="taiwan-map"]')).not.toBeNull()
  })

  it('should show tonight placeholder when tonight tab is active', async () => {
    const { container } = render(<App />)
    await completeOnboarding(container)
    expect(container.textContent).toContain('今晚的處方')
    expect(container.textContent).toContain('Coming in Epic 6')
  })

  it('should show journey placeholder when journey tab is clicked', async () => {
    const { container } = render(<App />)
    await completeOnboarding(container)
    await navigateToTab(container, 2, '我的旅程')
    expect(container.textContent).toContain('我的旅程')
    expect(container.textContent).toContain('Coming in Epic 7')
  })

  it('should switch between tabs correctly', async () => {
    const { container } = render(<App />)
    await completeOnboarding(container)

    // Start on tonight
    expect(container.textContent).toContain('今晚的處方')

    // Switch to explore
    await navigateToExplore(container)
    expect(container.querySelector('[data-testid="taiwan-map"]')).not.toBeNull()

    // Switch to journey
    await navigateToTab(container, 2, '我的旅程')
    expect(container.textContent).toContain('我的旅程')

    // Back to tonight
    await navigateToTab(container, 0, '今晚的處方')
    expect(container.textContent).toContain('今晚的處方')
  })

  it('should hide map content when not on explore tab', async () => {
    const { container } = render(<App />)
    await completeOnboarding(container)
    // Default is tonight — map should not exist
    expect(container.querySelector('[data-testid="taiwan-map"]')).toBeNull()
  })

  it('should NOT render TabBar when onboardingComplete is false', () => {
    const { container } = render(<App />)
    // App starts with onboardingComplete = false → SleepAssessment shown, no TabBar
    expect(container.querySelector('[data-testid="tab-bar"]')).toBeNull()
    expect(container.querySelector('[data-testid="sleep-assessment"]')).not.toBeNull()
  })

  it('should have three tabs with correct labels', async () => {
    const { container } = render(<App />)
    await completeOnboarding(container)
    const tabBar = container.querySelector('[data-testid="tab-bar"]')
    expect(tabBar?.textContent).toContain('今晚')
    expect(tabBar?.textContent).toContain('探索')
    expect(tabBar?.textContent).toContain('我的')
  })
})

describe('App Component — SoundscapePlayer Positioning (AC#5)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockAudio.src = ''
    mockAudio.volume = 1
    mockAudio.paused = true
    mockAudio.play.mockResolvedValue(undefined)
  })

  it('[P1] should position SoundscapePlayer wrapper with bottom-16 and z-30 when TabBar visible', async () => {
    const { container } = render(<App />)
    await completeOnboarding(container)
    await navigateToExplore(container)

    // Click unlocked location to trigger SoundscapePlayer
    const tamsui = container.querySelector('[data-testid="location-dot-tamsui"]')
    fireEvent.click(tamsui!)

    // Find the player wrapper (motion.div containing SoundscapePlayer)
    const player = container.querySelector('[data-testid="soundscape-player"]')
    expect(player).not.toBeNull()

    const wrapper = player!.closest('.fixed') as HTMLElement
    expect(wrapper).not.toBeNull()
    expect(wrapper.className).toContain('bottom-16')
    expect(wrapper.className).toContain('z-30')
  })

  it('[P1] should hide SoundscapePlayer when switching away from Explore tab', async () => {
    const { container } = render(<App />)
    await completeOnboarding(container)
    await navigateToExplore(container)

    // Start playing on Explore tab
    const tamsui = container.querySelector('[data-testid="location-dot-tamsui"]')
    fireEvent.click(tamsui!)
    expect(container.querySelector('[data-testid="soundscape-player"]')).not.toBeNull()

    // Switch to Tonight tab
    await navigateToTab(container, 0, '今晚的處方')

    // SoundscapePlayer should no longer be in DOM (conditioned on activeTab === 'explore')
    await waitFor(() => {
      expect(container.querySelector('[data-testid="soundscape-player"]')).toBeNull()
    })
  })

  it('[P1] should restore SoundscapePlayer when returning to Explore tab after selection', async () => {
    const { container } = render(<App />)
    await completeOnboarding(container)
    await navigateToExplore(container)

    // Select location and start playing
    const tamsui = container.querySelector('[data-testid="location-dot-tamsui"]')
    fireEvent.click(tamsui!)
    expect(container.querySelector('[data-testid="soundscape-player"]')).not.toBeNull()

    // Switch away
    await navigateToTab(container, 0, '今晚的處方')
    await waitFor(() => {
      expect(container.querySelector('[data-testid="soundscape-player"]')).toBeNull()
    })

    // Switch back to Explore
    await navigateToExplore(container)

    // Player should reappear (selectedLocationId is still set)
    expect(container.querySelector('[data-testid="soundscape-player"]')).not.toBeNull()
  })
})

describe('App Component — Audio Pause on Tab Switch', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockAudio.src = ''
    mockAudio.volume = 1
    mockAudio.paused = true
    mockAudio.play.mockResolvedValue(undefined)
  })

  it('should pause audio when switching away from Explore tab while playing', async () => {
    const { container } = render(<App />)
    await completeOnboarding(container)
    await navigateToExplore(container)

    // Start playing on Explore tab
    const tamsui = container.querySelector('[data-testid="location-dot-tamsui"]')
    fireEvent.click(tamsui!)
    expect(mockAudio.play).toHaveBeenCalled()

    // Switch to Tonight tab
    mockAudio.pause.mockClear()
    await navigateToTab(container, 0, '今晚的處方')

    // Audio should be paused
    expect(mockAudio.pause).toHaveBeenCalled()
  })

  it('should NOT pause audio when switching between non-explore tabs', async () => {
    const { container } = render(<App />)
    await completeOnboarding(container)

    // Start on Tonight tab, switch to Journey
    mockAudio.pause.mockClear()
    await navigateToTab(container, 2, '我的旅程')

    // No audio pause (wasn't on explore)
    expect(mockAudio.pause).not.toHaveBeenCalled()
  })
})

describe('App Component — LockOverlay Cleared on Tab Switch (CR#2 M2)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockAudio.src = ''
    mockAudio.volume = 1
    mockAudio.paused = true
    mockAudio.play.mockResolvedValue(undefined)
  })

  it('should dismiss LockOverlay when switching away from Explore tab', async () => {
    const { container } = render(<App />)
    await completeOnboarding(container)
    await navigateToExplore(container)

    // Show LockOverlay by clicking locked location
    const lanyu = container.querySelector('[data-testid="location-dot-lanyu"]')
    fireEvent.click(lanyu!)
    expect(container.querySelector('[data-testid="lock-overlay"]')).not.toBeNull()

    // Switch to Tonight tab (handleTabChange clears lockedLocation)
    await navigateToTab(container, 0, '今晚的處方')

    // LockOverlay should be dismissed
    await waitFor(() => {
      expectOverlayDismissed(container)
    })
  })

  it('should NOT dismiss LockOverlay when staying on Explore tab', async () => {
    const { container } = render(<App />)
    await completeOnboarding(container)
    await navigateToExplore(container)

    // Show LockOverlay
    const lanyu = container.querySelector('[data-testid="location-dot-lanyu"]')
    fireEvent.click(lanyu!)
    expect(container.querySelector('[data-testid="lock-overlay"]')).not.toBeNull()

    // Click Explore tab again (no tab change, overlay should persist)
    await navigateToTab(container, 1)
    expect(container.querySelector('[data-testid="lock-overlay"]')).not.toBeNull()
  })
})

describe('App Component — Product Story Info Icon', () => {
  it('should show an info icon button in the header when onboardingComplete', async () => {
    const { container } = render(<App />)
    await completeOnboarding(container)
    const infoBtn = container.querySelector('[data-testid="product-story-btn"]')
    expect(infoBtn).not.toBeNull()
  })

  it('should be inside the header element', async () => {
    const { container } = render(<App />)
    await completeOnboarding(container)
    const header = container.querySelector('header')
    const infoBtn = header?.querySelector('[data-testid="product-story-btn"]')
    expect(infoBtn).not.toBeNull()
  })

  it('[P2] should have aria-label for accessibility', async () => {
    const { container } = render(<App />)
    await completeOnboarding(container)
    const infoBtn = container.querySelector('[data-testid="product-story-btn"]')
    expect(infoBtn?.getAttribute('aria-label')).toBe('Product Story')
  })
})

describe('App Component — Onboarding Flow (AC#1, AC#7)', () => {
  it('should show SleepAssessment when app first loads (onboardingComplete = false)', () => {
    const { container } = render(<App />)
    expect(container.querySelector('[data-testid="sleep-assessment"]')).not.toBeNull()
    expect(container.querySelector('[data-testid="tab-bar"]')).toBeNull()
  })

  it('should transition to TabBar + Tonight tab after completing onboarding', async () => {
    const { container } = render(<App />)
    await completeOnboarding(container)

    // SleepAssessment should be gone
    expect(container.querySelector('[data-testid="sleep-assessment"]')).toBeNull()
    // TabBar should be visible
    expect(container.querySelector('[data-testid="tab-bar"]')).not.toBeNull()
    // Tonight tab content should be showing
    expect(container.textContent).toContain('今晚的處方')
  })

  it('should set activeTab to tonight after onboarding', async () => {
    const { container } = render(<App />)
    await completeOnboarding(container)

    // Tonight tab content visible
    expect(container.textContent).toContain('今晚的處方')
    // Map should NOT be visible (not on explore tab)
    expect(container.querySelector('[data-testid="taiwan-map"]')).toBeNull()
  })
})
