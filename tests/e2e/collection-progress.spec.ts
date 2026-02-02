import { test, expect } from '../support/fixtures'
import { navigateToExploreTab } from '../support/helpers/test-utils'

// ═══════════════════════════════════════════════════════════════════════
// Collection Progress & Unlock Hints — Story 7-2 E2E Tests
// Covers: CollectionProgress rendering on Explore tab, collection count,
// sleep-type-specific hint text, progress dots, tab exclusion
// ═══════════════════════════════════════════════════════════════════════

test.describe('Collection Progress — P1 High', () => {
  test('[P1] should display CollectionProgress with correct count on Explore tab', async ({
    page,
  }) => {
    // GIVEN: User has completed onboarding and is on the main app

    // WHEN: User navigates to the Explore tab
    await navigateToExploreTab(page)

    // THEN: CollectionProgress is visible with "已收集 3/10 個台灣聲景"
    const progress = page.getByTestId('collection-progress')
    await expect(progress).toBeVisible()
    await expect(progress).toContainText('已收集 3/10 個台灣聲景')
  })

  test('[P1] should display sleep-type-specific hint text from onboarding result', async ({
    page,
  }) => {
    // GIVEN: User completed onboarding with option-0 for all questions (sleepType: light)

    // WHEN: User navigates to the Explore tab
    await navigateToExploreTab(page)

    // THEN: Hint text references the light-sleep plan and its target locked location
    const hint = page.getByTestId('collection-hint')
    await expect(hint).toBeVisible()
    await expect(hint).toHaveText('完成「深層好眠計畫」即可解鎖：日月潭晨曦')
  })
})

test.describe('Collection Progress — P2 Medium', () => {
  test('[P2] should render 10 progress dots with 3 amber and 7 slate', async ({
    page,
  }) => {
    // GIVEN: User has completed onboarding

    // WHEN: User navigates to the Explore tab
    await navigateToExploreTab(page)

    // THEN: 10 progress dots are rendered
    const dots = page.getByTestId('progress-dot')
    await expect(dots).toHaveCount(10)

    // THEN: First 3 dots have amber fill (unlocked locations, Tailwind v4 oklch)
    for (let i = 0; i < 3; i++) {
      await expect(dots.nth(i)).toHaveCSS('background-color', /oklch\(0\.82/)
    }

    // THEN: Remaining 7 dots have slate fill (locked locations, Tailwind v4 oklch)
    for (let i = 3; i < 10; i++) {
      await expect(dots.nth(i)).toHaveCSS('background-color', /oklch\(0\.4/)
    }
  })

  test('[P2] should not display CollectionProgress on Tonight tab', async ({
    page,
  }) => {
    // GIVEN: User has completed onboarding and is on Tonight tab (default)

    // THEN: CollectionProgress is NOT visible on Tonight tab
    await expect(page.getByTestId('collection-progress')).not.toBeVisible()
  })

  test('[P2] should not display CollectionProgress on Journey tab', async ({
    page,
  }) => {
    // GIVEN: User has completed onboarding

    // WHEN: User navigates to the Journey tab
    const tabBar = page.getByTestId('tab-bar')
    await tabBar.getByText('我的').click()
    await expect(page.getByTestId('my-journey-page')).toBeVisible()

    // THEN: CollectionProgress is NOT visible on Journey tab
    await expect(page.getByTestId('collection-progress')).not.toBeVisible()
  })

  test('[P2] should position CollectionProgress above the Taiwan map', async ({
    page,
  }) => {
    // GIVEN: User has completed onboarding

    // WHEN: User navigates to the Explore tab
    await navigateToExploreTab(page)

    // THEN: CollectionProgress and Taiwan map are both visible
    const progress = page.getByTestId('collection-progress')
    const map = page.getByTestId('taiwan-map')
    await expect(progress).toBeVisible()
    await expect(map).toBeVisible()

    // THEN: CollectionProgress is above the map (lower Y position)
    const progressBox = await progress.boundingBox()
    const mapBox = await map.boundingBox()
    expect(progressBox).not.toBeNull()
    expect(mapBox).not.toBeNull()
    expect(progressBox!.y).toBeLessThan(mapBox!.y)
  })
})
