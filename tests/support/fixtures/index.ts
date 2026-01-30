import { test as base, expect } from '@playwright/test'

/**
 * Extended test fixtures for taiwan-soundscapes.
 *
 * Since this is a static SPA with no backend, fixtures focus on
 * UI interaction helpers rather than API/auth/data concerns.
 */

type TestFixtures = {
  /** Navigate to homepage and wait for the app to be ready */
  appPage: void
}

export const test = base.extend<TestFixtures>({
  appPage: [async ({ page }, use) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await use()
  }, { auto: true }],
})

export { expect }
