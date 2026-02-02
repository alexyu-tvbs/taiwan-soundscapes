import { test, expect } from '../support/fixtures'
import { getMapElement } from '../support/helpers/test-utils'

// ═══════════════════════════════════════════════════════════════════════
// Tab Navigation & App Shell — Story 5-1 E2E Tests
// Covers: TabBar rendering, tab switching, content routing,
// active indicator, SoundscapePlayer + TabBar coexistence
// ═══════════════════════════════════════════════════════════════════════

test.describe('Tab Navigation — P0 Critical', () => {
  test('[P0] should render TabBar with three tabs at bottom of screen', async ({
    page,
  }) => {
    // GIVEN: App is loaded (lands on Tonight tab by default)

    // THEN: TabBar is visible with 3 tabs
    const tabBar = page.getByTestId('tab-bar')
    await expect(tabBar).toBeVisible()

    const buttons = tabBar.locator('button')
    await expect(buttons).toHaveCount(3)

    // THEN: Tab labels are in Chinese
    await expect(tabBar.getByText('今晚')).toBeVisible()
    await expect(tabBar.getByText('探索')).toBeVisible()
    await expect(tabBar.getByText('我的')).toBeVisible()
  })

  test('[P0] should switch between all three tabs showing correct content', async ({
    page,
  }) => {
    // GIVEN: App loads on Tonight tab (TonightPage with prescription content)
    await expect(page.getByTestId('tonight-page')).toBeVisible()

    const tabBar = page.getByTestId('tab-bar')

    // WHEN: User taps Explore tab
    await tabBar.getByText('探索').click()

    // THEN: Taiwan map is visible
    await expect(page.getByTestId('taiwan-map')).toBeVisible()

    // WHEN: User taps Journey tab
    await tabBar.getByText('我的').click()

    // THEN: Journey placeholder is visible, map is hidden
    await expect(page.getByText('我的旅程')).toBeVisible()
    await expect(page.getByTestId('taiwan-map')).not.toBeVisible()

    // WHEN: User taps Tonight tab
    await tabBar.getByText('今晚').click()

    // THEN: TonightPage is visible again
    await expect(page.getByTestId('tonight-page')).toBeVisible()
  })
})

test.describe('Tab Navigation — P1 High', () => {
  test('[P1] should show Taiwan map experience on Explore tab', async ({
    page,
  }) => {
    // GIVEN: App is loaded

    // WHEN: User navigates to Explore tab
    const tabBar = page.getByTestId('tab-bar')
    await tabBar.getByText('探索').click()

    // THEN: Taiwan map with all 10 location markers is visible
    await expect(page.getByTestId('taiwan-map')).toBeVisible()
    const dots = page.locator('[data-testid^="location-dot-"]')
    await expect(dots).toHaveCount(10)
  })

  test('[P1] should show TonightPage with prescription content on Tonight tab', async ({
    page,
  }) => {
    // GIVEN: App loads on Tonight tab (default after onboarding)

    // THEN: TonightPage content is visible (progress bar + prescription cards)
    await expect(page.getByTestId('tonight-page')).toBeVisible()
    await expect(page.getByTestId('progress-bar')).toBeVisible()
    await expect(page.getByTestId('prescription-card')).toHaveCount(2)
  })

  test('[P1] should show MyJourneyPage when navigating to Journey tab', async ({
    page,
  }) => {
    // GIVEN: App is loaded

    // WHEN: User navigates to Journey tab
    const tabBar = page.getByTestId('tab-bar')
    await tabBar.getByText('我的').click()

    // THEN: MyJourneyPage is visible with achievement stats
    await expect(page.getByTestId('my-journey-page')).toBeVisible()
    await expect(page.getByTestId('stats-section')).toBeVisible()
  })

  test('[P1] should visually distinguish active tab with amber styling', async ({
    page,
  }) => {
    // GIVEN: App loads on Tonight tab (active)
    const tabBar = page.getByTestId('tab-bar')
    const tonightBtn = tabBar.locator('button').nth(0)
    const exploreBtn = tabBar.locator('button').nth(1)

    // THEN: Active tab (Tonight) has amber border-top indicator
    await expect(tonightBtn).toHaveCSS('border-top-width', '2px')
    // Inactive tab (Explore) has no border-top
    await expect(exploreBtn).toHaveCSS('border-top-width', '0px')

    // WHEN: User switches to Explore tab
    await exploreBtn.click()
    await expect(page.getByTestId('taiwan-map')).toBeVisible()

    // THEN: Explore tab now has amber border, Tonight loses it
    await expect(exploreBtn).toHaveCSS('border-top-width', '2px')
    await expect(tonightBtn).toHaveCSS('border-top-width', '0px')
  })

  test('[P1] should show SoundscapePlayer above TabBar when playing audio on Explore', async ({
    page,
  }) => {
    // GIVEN: User is on Explore tab
    const tabBar = page.getByTestId('tab-bar')
    await tabBar.getByText('探索').click()
    await expect(page.getByTestId('taiwan-map')).toBeVisible()

    // WHEN: User clicks an unlocked location (tamsui)
    const tamsui = getMapElement(page, 'location-dot-tamsui')
    await tamsui.click({ force: true })

    // THEN: SoundscapePlayer is visible
    const player = page.getByTestId('soundscape-player')
    await expect(player).toBeVisible()

    // THEN: TabBar is still visible (z-40, always on top)
    await expect(tabBar).toBeVisible()
  })

  test('[P1] should hide SoundscapePlayer when switching away from Explore tab', async ({
    page,
  }) => {
    // GIVEN: User is on Explore tab with audio playing
    const tabBar = page.getByTestId('tab-bar')
    await tabBar.getByText('探索').click()
    await expect(page.getByTestId('taiwan-map')).toBeVisible()

    const tamsui = getMapElement(page, 'location-dot-tamsui')
    await tamsui.click({ force: true })
    await expect(page.getByTestId('soundscape-player')).toBeVisible()

    // WHEN: User switches to Tonight tab
    await tabBar.getByText('今晚').click()
    await expect(page.getByTestId('tonight-page')).toBeVisible()

    // THEN: SoundscapePlayer is no longer visible
    await expect(page.getByTestId('soundscape-player')).not.toBeVisible()
  })
})
