import { test as base, expect } from '@playwright/test'
import { completeOnboarding, navigateToExploreTab } from '../helpers/test-utils'

/**
 * Extended test fixtures for taiwan-soundscapes.
 *
 * Since this is a static SPA with no backend, fixtures focus on
 * UI interaction helpers rather than API/auth/data concerns.
 */

type TestFixtures = {
  /** Navigate to homepage and wait for the app to be ready */
  appPage: void
  /** Navigate to homepage, then switch to the Explore tab (map view) */
  explorePage: void
}

export const test = base.extend<TestFixtures>({
  appPage: [async ({ page }, use) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await completeOnboarding(page)
    await use()
  }, { auto: true }],

  explorePage: [async ({ page }, use) => {
    await navigateToExploreTab(page)
    await use()
  }, { auto: false }],
})

export { expect }
