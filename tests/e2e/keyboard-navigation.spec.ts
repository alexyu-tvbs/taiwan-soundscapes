import { test, expect } from '../support/fixtures'
import {
  UNLOCKED_LOCATIONS,
  getMapElement,
  navigateToExploreTab,
} from '../support/helpers/test-utils'

// ═══════════════════════════════════════════════════════════════════════
// Keyboard Navigation & Accessibility
// E2E tests verify that location markers are keyboard-accessible:
// Tab focus, Enter/Space activation, and correct visual state updates.
// ═══════════════════════════════════════════════════════════════════════

// Phase 2: Map is on Explore tab — navigate there before each test
test.beforeEach(async ({ page }) => {
  await navigateToExploreTab(page)
})

test.describe('Keyboard Navigation — P2 Medium', () => {
  test('[P2] should allow Tab focus on location markers', async ({
    page,
  }) => {
    // GIVEN: Page is loaded with map on Explore tab
    // Focus a known unlocked marker directly (Tab key order depends on DOM structure)
    const tamsui = getMapElement(page, 'location-dot-tamsui')
    await tamsui.focus()

    // THEN: The marker is focused and has role="button" for accessibility
    const focusedElement = page.locator(':focus')
    await expect(focusedElement).toHaveAttribute('role', 'button')
    await expect(focusedElement).toHaveAttribute('tabindex', '0')
  })

  test('[P2] should select location when pressing Enter on focused marker', async ({
    page,
  }) => {
    // GIVEN: Tamsui marker is focused
    const tamsui = getMapElement(page, 'location-dot-tamsui')
    await tamsui.focus()

    // WHEN: User presses Enter
    await page.keyboard.press('Enter')

    // THEN: Tamsui is selected (glow-strong filter applied; r oscillates via Motion)
    await expect(tamsui).toHaveAttribute('filter', 'url(#glow-strong)')
  })

  test('[P2] should select location when pressing Space on focused marker', async ({
    page,
  }) => {
    // GIVEN: Alishan marker is focused
    const alishan = getMapElement(page, 'location-dot-alishan')
    await alishan.focus()

    // WHEN: User presses Space
    await page.keyboard.press('Space')

    // THEN: Alishan is selected (glow-strong filter applied; r oscillates via Motion)
    await expect(alishan).toHaveAttribute('filter', 'url(#glow-strong)')
  })

  test('[P2] should show SoundscapePlayer when activating unlocked marker via keyboard', async ({
    page,
  }) => {
    // GIVEN: Tamsui marker is focused
    const tamsui = getMapElement(page, 'location-dot-tamsui')
    await tamsui.focus()

    // WHEN: User presses Enter
    await page.keyboard.press('Enter')

    // THEN: SoundscapePlayer appears
    await expect(page.getByTestId('soundscape-player')).toBeVisible()
    await expect(page.getByTestId('soundscape-player')).toContainText('淡水河夕陽')
  })

  test('[P2] should show LockOverlay when activating locked marker via keyboard', async ({
    page,
  }) => {
    // GIVEN: Lanyu (locked) marker is focused
    const lanyu = getMapElement(page, 'location-dot-lanyu')
    await lanyu.focus()

    // WHEN: User presses Enter
    await page.keyboard.press('Enter')

    // THEN: LockOverlay appears with correct content
    const overlay = page.getByTestId('lock-overlay')
    await expect(overlay).toBeVisible()

    const panel = page.getByTestId('lock-overlay-panel')
    await expect(panel.locator('h2')).toHaveText('蘭嶼飛魚季')
  })

  test('[P2] should have aria-label on all location markers', async ({
    page,
  }) => {
    // GIVEN: Page is loaded

    // THEN: All unlocked markers have aria-label matching their name
    const expectedLabels: Record<string, string> = {
      tamsui: '淡水河夕陽',
      alishan: '阿里山雲海',
      keelung: '基隆港浪',
    }

    for (const id of UNLOCKED_LOCATIONS) {
      const dot = getMapElement(page, `location-dot-${id}`)
      await expect(dot).toHaveAttribute('aria-label', expectedLabels[id])
    }
  })
})
