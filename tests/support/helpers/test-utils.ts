import { expect, type Page, type Locator } from '@playwright/test'

/** Location IDs matching src/data/locations.ts */
export const UNLOCKED_LOCATIONS = ['tamsui', 'alishan', 'keelung'] as const
export const LOCKED_LOCATIONS = [
  'lanyu',
  'taroko',
  'sunmoonlake',
  'kenting',
  'hehuan',
  'taitung',
  'yushan',
] as const

export const ALL_LOCATIONS = [
  ...UNLOCKED_LOCATIONS,
  ...LOCKED_LOCATIONS,
] as const

/** Get the root app container */
export function getAppRoot(page: Page): Locator {
  return page.locator('#root')
}

/** Get an SVG element within the map by data-testid */
export function getMapElement(page: Page, testId: string): Locator {
  return page.getByTestId(testId)
}

/**
 * Navigate to the Explore tab by clicking it in the TabBar.
 * Waits for the Taiwan map to become visible (confirms tab switch complete).
 */
export async function navigateToExploreTab(page: Page): Promise<void> {
  const tabBar = page.getByTestId('tab-bar')
  await expect(tabBar).toBeVisible()
  await tabBar.getByText('探索').click()
  await expect(page.getByTestId('taiwan-map')).toBeVisible()
}

/**
 * Wait for AnimatePresence exit animation to complete on location-detail panel.
 * During transitions, both exiting and entering elements exist simultaneously.
 * This helper waits until only one location-detail element remains.
 */
export async function waitForDetailTransition(page: Page): Promise<void> {
  await expect(page.getByTestId('location-detail')).toHaveCount(1)
}
