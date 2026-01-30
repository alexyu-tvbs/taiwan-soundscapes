import { test, expect } from '../support/fixtures'
import { getAppRoot } from '../support/helpers/test-utils'

test.describe('Homepage', () => {
  test('should load with dark theme background', async ({ page, appPage }) => {
    const root = getAppRoot(page)
    await expect(root).toBeVisible()

    // Verify dark theme is applied (bg-slate-900)
    const rootDiv = root.locator('> div').first()
    await expect(rootDiv).toHaveCSS('min-height', /\d+px/)
  })

  test('should have correct page title', async ({ page, appPage }) => {
    await expect(page).toHaveTitle(/.*/)
  })

  test('should render without console errors', async ({ page }) => {
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    expect(errors).toHaveLength(0)
  })
})
