import { test, expect } from '../support/fixtures'
import {
  UNLOCKED_LOCATIONS,
  getMapElement,
  navigateToExploreTab,
} from '../support/helpers/test-utils'

// ═══════════════════════════════════════════════════════════════════════
// Story 2.1: Audio Playback Engine & Player Controls
// E2E tests verify UI state that reflects audio playback behavior.
// Note: Playwright cannot verify actual audio output — we test the
// SoundscapePlayer visibility, button state, volume slider, and
// location name display as proxies for audio playback state.
// ═══════════════════════════════════════════════════════════════════════

// Phase 2: Map is on Explore tab — navigate there before each test
test.beforeEach(async ({ page }) => {
  await navigateToExploreTab(page)
})

const LOCATION_NAMES: Record<string, string> = {
  tamsui: '淡水河夕陽',
  alishan: '阿里山雲海',
  keelung: '基隆港浪',
}

test.describe('Story 2.1: Audio Playback — P0 Critical', () => {
  test('[P0] should show SoundscapePlayer when clicking an unlocked location', async ({
    page,
  }) => {
    // GIVEN: Page is loaded, no player visible initially
    const player = page.getByTestId('soundscape-player')
    await expect(player).toBeHidden()

    // WHEN: User clicks an unlocked location (tamsui)
    // force: Motion animation keeps r/opacity oscillating = Playwright "not stable"
    const tamsui = getMapElement(page, 'location-dot-tamsui')
    await tamsui.click({ force: true })

    // THEN: SoundscapePlayer becomes visible with the location name
    await expect(player).toBeVisible()
    await expect(player).toContainText('淡水河夕陽')
  })

  test('[P0] should update player to new location when switching between unlocked locations', async ({
    page,
  }) => {
    // GIVEN: Tamsui is selected and player is visible
    const tamsui = getMapElement(page, 'location-dot-tamsui')
    const alishan = getMapElement(page, 'location-dot-alishan')
    const player = page.getByTestId('soundscape-player')

    await tamsui.click({ force: true })
    await expect(player).toContainText('淡水河夕陽')

    // WHEN: User clicks a different unlocked location (alishan)
    await alishan.click({ force: true })

    // THEN: Player updates to show the new location name
    await expect(player).toBeVisible()
    await expect(player).toContainText('阿里山雲海')
  })
})

test.describe('Story 2.1: Audio Playback — P1 High', () => {
  test('[P1] should not show SoundscapePlayer initially when no location is selected', async ({
    page,
  }) => {
    // GIVEN: Page is loaded with no prior interaction

    // THEN: SoundscapePlayer is not visible
    const player = page.getByTestId('soundscape-player')
    await expect(player).toBeHidden()
  })

  test('[P1] should not show SoundscapePlayer when clicking a locked location', async ({
    page,
  }) => {
    // GIVEN: Page is loaded

    // WHEN: User clicks a locked location (lanyu)
    const lanyu = getMapElement(page, 'location-dot-lanyu')
    await lanyu.click({ force: true })

    // THEN: SoundscapePlayer remains hidden
    const player = page.getByTestId('soundscape-player')
    await expect(player).toBeHidden()
  })

  test('[P1] should keep SoundscapePlayer visible when clicking locked location after unlocked', async ({
    page,
  }) => {
    // GIVEN: Tamsui (unlocked) is selected, player visible
    const tamsui = getMapElement(page, 'location-dot-tamsui')
    const taroko = getMapElement(page, 'location-dot-taroko')
    const player = page.getByTestId('soundscape-player')

    await tamsui.click({ force: true })
    await expect(player).toBeVisible()

    // WHEN: User clicks Taroko (locked) — shows overlay, preserves selection
    await taroko.click({ force: true })

    // THEN: Player remains visible (audio continues, selection unchanged)
    await expect(player).toBeVisible()
    await expect(page.getByTestId('lock-overlay')).toBeVisible()
  })

  test('[P1] should toggle play/pause button aria-label on click', async ({
    page,
  }) => {
    // GIVEN: An unlocked location is selected (player visible, initially "playing")
    const tamsui = getMapElement(page, 'location-dot-tamsui')
    await tamsui.click({ force: true })

    const playPauseBtn = page.getByTestId('play-pause-btn')
    await expect(playPauseBtn).toBeVisible()

    // THEN: Button initially shows Pause (audio auto-plays on selection)
    await expect(playPauseBtn).toHaveAttribute('aria-label', 'Pause')

    // WHEN: User clicks the pause button
    await playPauseBtn.click()

    // THEN: Button changes to Play
    await expect(playPauseBtn).toHaveAttribute('aria-label', 'Play')

    // WHEN: User clicks the play button again
    await playPauseBtn.click()

    // THEN: Button changes back to Pause
    await expect(playPauseBtn).toHaveAttribute('aria-label', 'Pause')
  })

  test('[P1] should render volume slider with correct attributes', async ({
    page,
  }) => {
    // GIVEN: An unlocked location is selected
    const tamsui = getMapElement(page, 'location-dot-tamsui')
    await tamsui.click({ force: true })

    // THEN: Volume slider is visible with correct configuration
    const slider = page.getByTestId('volume-slider')
    await expect(slider).toBeVisible()
    await expect(slider).toHaveAttribute('type', 'range')
    await expect(slider).toHaveAttribute('min', '0')
    await expect(slider).toHaveAttribute('max', '1')
    await expect(slider).toHaveAttribute('step', '0.01')
  })

  test('[P1] should show correct location name for each unlocked location', async ({
    page,
  }) => {
    // GIVEN: Page is loaded

    // WHEN/THEN: Clicking each unlocked location shows its name in the player
    for (const id of UNLOCKED_LOCATIONS) {
      const dot = getMapElement(page, `location-dot-${id}`)
      await dot.click({ force: true })

      const player = page.getByTestId('soundscape-player')
      await expect(player).toBeVisible()
      await expect(player).toContainText(LOCATION_NAMES[id])
    }
  })
})

test.describe('Story 2.1: Audio Playback — P2 Medium', () => {
  test('[P2] should render SoundscapePlayer with dark theme styling', async ({
    page,
  }) => {
    // GIVEN: An unlocked location is selected
    const tamsui = getMapElement(page, 'location-dot-tamsui')
    await tamsui.click({ force: true })

    // THEN: Player panel has dark theme backdrop
    const player = page.getByTestId('soundscape-player')
    await expect(player).toBeVisible()

    // Player wrapper (parent motion.div) is fixed-positioned above TabBar
    const wrapper = player.locator('..')
    await expect(wrapper).toHaveCSS('position', 'fixed')
  })

  test('[P2] should keep player visible after pause (player only hides on location change)', async ({
    page,
  }) => {
    // GIVEN: Tamsui is selected and playing
    const tamsui = getMapElement(page, 'location-dot-tamsui')
    await tamsui.click({ force: true })

    const player = page.getByTestId('soundscape-player')
    await expect(player).toBeVisible()

    // WHEN: User pauses playback
    const playPauseBtn = page.getByTestId('play-pause-btn')
    await playPauseBtn.click()

    // THEN: Player remains visible (paused, not dismissed)
    await expect(player).toBeVisible()
    await expect(player).toContainText('淡水河夕陽')
  })
})
