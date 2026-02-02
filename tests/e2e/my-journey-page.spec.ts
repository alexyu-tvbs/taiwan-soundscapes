import { test, expect } from '../support/fixtures'

// ═══════════════════════════════════════════════════════════════════════
// My Journey Achievement Page — Story 7-1 E2E Tests
// Covers: MyJourneyPage rendering, stats display, reinforcement message,
// plan progress bar, product story link
// ═══════════════════════════════════════════════════════════════════════

const navigateToJourneyTab = async (page: import('@playwright/test').Page) => {
  const tabBar = page.getByTestId('tab-bar')
  await expect(tabBar).toBeVisible()
  await tabBar.getByText('我的').click()
  await expect(page.getByTestId('my-journey-page')).toBeVisible()
}

test.describe('My Journey Page — P0 Critical', () => {
  test('[P0] should display MyJourneyPage when navigating to Journey tab (AC #1)', async ({
    page,
  }) => {
    // GIVEN: User has completed onboarding (appPage fixture)

    // WHEN: User navigates to My Journey tab
    await navigateToJourneyTab(page)

    // THEN: MyJourneyPage is visible
    await expect(page.getByTestId('my-journey-page')).toBeVisible()

    // THEN: Stats section is visible
    await expect(page.getByTestId('stats-section')).toBeVisible()

    // THEN: Reinforcement message is visible
    await expect(page.getByTestId('reinforcement-message')).toBeVisible()

    // THEN: Progress bar is visible
    await expect(page.getByTestId('journey-progress-fill')).toBeVisible()
  })

  test('[P0] should display cumulative stats with correct values (AC #2)', async ({
    page,
  }) => {
    // GIVEN: User is on My Journey tab
    await navigateToJourneyTab(page)

    // THEN: Completed sessions stat is visible
    const completedStat = page.getByTestId('stat-completed')
    await expect(completedStat).toBeVisible()
    await expect(completedStat.getByText('12')).toBeVisible()
    await expect(completedStat.getByText(/已完成/)).toBeVisible()

    // THEN: Longest streak stat is visible
    const streakStat = page.getByTestId('stat-streak')
    await expect(streakStat).toBeVisible()
    await expect(streakStat.getByText('5')).toBeVisible()
    await expect(streakStat.getByText(/最長連續/)).toBeVisible()

    // THEN: Unlocked soundscapes stat is visible
    const unlockedStat = page.getByTestId('stat-unlocked')
    await expect(unlockedStat).toBeVisible()
    await expect(unlockedStat.getByText('3')).toBeVisible()
    await expect(unlockedStat.getByText(/已解鎖/)).toBeVisible()
  })
})

test.describe('My Journey Page — P1 High', () => {
  test('[P1] should display positive reinforcement message (AC #3)', async ({
    page,
  }) => {
    // GIVEN: User is on My Journey tab
    await navigateToJourneyTab(page)

    // THEN: Reinforcement message card is visible with behavior-specific content
    const messageCard = page.getByTestId('reinforcement-message')
    await expect(messageCard).toBeVisible()
    // AC #3: message must highlight a recent behavior pattern, not just generic encouragement
    await expect(messageCard).toContainText('連續')
    await expect(messageCard).toContainText('習慣')
  })

  test('[P1] should display plan progress consistent with Tonight tab (AC #4)', async ({
    page,
  }) => {
    // GIVEN: User is on My Journey tab
    await navigateToJourneyTab(page)

    // THEN: Progress section shows plan name
    await expect(page.getByTestId('my-journey-page')).toContainText(/急救包|計畫|療程/)

    // THEN: Progress text shows "第 X 天 / 共 Y 天" format
    await expect(page.getByTestId('my-journey-page')).toContainText(/第 \d+ 天 \/ 共 \d+ 天/)

    // THEN: Progress fill bar is rendered with width
    const progressFill = page.getByTestId('journey-progress-fill')
    await expect(progressFill).toBeVisible()
  })

  test('[P1] should display product story link that is clickable', async ({
    page,
  }) => {
    // GIVEN: User is on My Journey tab
    await navigateToJourneyTab(page)

    // THEN: Product story link is visible
    const link = page.getByRole('button', { name: /了解更多產品故事/ })
    await expect(link).toBeVisible()

    // WHEN: User clicks the link (product story overlay set but not rendered until Epic 8)
    await link.click()

    // THEN: No crash — page remains stable
    await expect(page.getByTestId('my-journey-page')).toBeVisible()
  })

  test('[P1] should switch between Tonight and Journey tabs correctly', async ({
    page,
  }) => {
    // GIVEN: User is on Tonight tab after onboarding
    await expect(page.getByTestId('tonight-page')).toBeVisible()

    // WHEN: Switch to Journey tab
    await navigateToJourneyTab(page)

    // THEN: MyJourneyPage is visible, TonightPage is not
    await expect(page.getByTestId('my-journey-page')).toBeVisible()
    await expect(page.getByTestId('tonight-page')).not.toBeVisible()

    // WHEN: Switch back to Tonight tab
    const tabBar = page.getByTestId('tab-bar')
    await tabBar.getByText('今晚').click()
    await expect(page.getByTestId('tonight-page')).toBeVisible()

    // THEN: MyJourneyPage is not visible
    await expect(page.getByTestId('my-journey-page')).not.toBeVisible()
  })
})
