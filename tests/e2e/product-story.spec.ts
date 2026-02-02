import { test, expect } from '../support/fixtures'
import { navigateToExploreTab } from '../support/helpers/test-utils'

// ═══════════════════════════════════════════════════════════════════════
// Product Story Page Overlay — Story 8-1 E2E Tests
// Covers: ProductStory overlay open/close via header icon and
// MyJourneyPage link, 6 content sections, fullscreen overlay styling,
// tab state preservation on close
// ═══════════════════════════════════════════════════════════════════════

const navigateToJourneyTab = async (page: import('@playwright/test').Page) => {
  const tabBar = page.getByTestId('tab-bar')
  await expect(tabBar).toBeVisible()
  await tabBar.getByText('我的').click()
  await expect(page.getByTestId('my-journey-page')).toBeVisible()
}

const openProductStoryViaHeader = async (page: import('@playwright/test').Page) => {
  const infoBtn = page.getByTestId('product-story-btn')
  await expect(infoBtn).toBeVisible()
  await infoBtn.click()
  await expect(page.getByTestId('product-story-content')).toBeVisible()
}

test.describe('Product Story Overlay — P1 High', () => {
  test('[P1] should open ProductStory overlay when clicking header info icon (AC #1)', async ({
    page,
  }) => {
    // GIVEN: User has completed onboarding and is on the main app

    // WHEN: User clicks the info icon in the header
    const infoBtn = page.getByTestId('product-story-btn')
    await expect(infoBtn).toBeVisible()
    await infoBtn.click()

    // THEN: ProductStory overlay is visible with content
    await expect(page.getByTestId('product-story-content')).toBeVisible()
  })

  test('[P1] should open ProductStory overlay from MyJourneyPage link (AC #1)', async ({
    page,
  }) => {
    // GIVEN: User navigates to My Journey tab
    await navigateToJourneyTab(page)

    // WHEN: User clicks the "了解更多產品故事" link
    const link = page.getByRole('button', { name: /了解更多產品故事/ })
    await expect(link).toBeVisible()
    await link.click()

    // THEN: ProductStory overlay is visible
    await expect(page.getByTestId('product-story-content')).toBeVisible()
  })

  test('[P1] should display all 6 content sections (AC #2)', async ({
    page,
  }) => {
    // GIVEN: User opens ProductStory overlay
    await openProductStoryViaHeader(page)

    // THEN: All 6 content sections are visible with correct headings
    await expect(page.getByTestId('section-vision')).toBeVisible()
    await expect(page.getByTestId('section-vision')).toContainText('產品願景')

    await expect(page.getByTestId('section-competitive')).toBeVisible()
    await expect(page.getByTestId('section-competitive')).toContainText('市場競爭分析')

    await expect(page.getByTestId('section-audience')).toBeVisible()
    await expect(page.getByTestId('section-audience')).toContainText('目標用戶')

    await expect(page.getByTestId('section-philosophy')).toBeVisible()
    await expect(page.getByTestId('section-philosophy')).toContainText('設計哲學')

    await expect(page.getByTestId('section-moat')).toBeVisible()
    await expect(page.getByTestId('section-moat')).toContainText('差異化護城河')

    await expect(page.getByTestId('section-roadmap')).toBeVisible()
    await expect(page.getByTestId('section-roadmap')).toContainText('產品路線圖')
  })

  test('[P1] should close ProductStory overlay when clicking close button (AC #4)', async ({
    page,
  }) => {
    // GIVEN: ProductStory overlay is open
    await openProductStoryViaHeader(page)

    // WHEN: User clicks the close button
    const closeBtn = page.getByTestId('product-story-close')
    await expect(closeBtn).toBeVisible()
    await closeBtn.click()

    // THEN: ProductStory overlay is dismissed
    await expect(page.getByTestId('product-story-content')).not.toBeVisible()

    // THEN: Main app content is visible again
    await expect(page.getByTestId('brand-tagline')).toBeVisible()
  })
})

test.describe('Product Story Overlay — P2 Medium', () => {
  test('[P2] should render overlay above all tab content at z-50 (AC #5)', async ({
    page,
  }) => {
    // GIVEN: ProductStory overlay is open
    await openProductStoryViaHeader(page)

    // THEN: The overlay root element covers the full viewport
    const overlay = page.locator('.fixed.inset-0.z-50')
    await expect(overlay).toBeVisible()

    // THEN: Close button is accessible (confirms overlay is on top)
    await expect(page.getByTestId('product-story-close')).toBeVisible()
  })

  test('[P2] should preserve tab state after closing overlay (AC #5)', async ({
    page,
  }) => {
    // GIVEN: User navigates to Explore tab
    await navigateToExploreTab(page)
    await expect(page.getByTestId('taiwan-map')).toBeVisible()

    // WHEN: User opens ProductStory via header icon
    await openProductStoryViaHeader(page)

    // WHEN: User closes ProductStory
    await page.getByTestId('product-story-close').click()
    await expect(page.getByTestId('product-story-content')).not.toBeVisible()

    // THEN: User is still on Explore tab with map visible
    await expect(page.getByTestId('taiwan-map')).toBeVisible()
  })

  test('[P2] should be reopenable after closing (AC #4)', async ({
    page,
  }) => {
    // GIVEN: User opens and closes ProductStory
    await openProductStoryViaHeader(page)
    await page.getByTestId('product-story-close').click()
    await expect(page.getByTestId('product-story-content')).not.toBeVisible()

    // WHEN: User opens ProductStory again
    await openProductStoryViaHeader(page)

    // THEN: ProductStory overlay is visible again with content
    await expect(page.getByTestId('section-vision')).toBeVisible()
  })
})
