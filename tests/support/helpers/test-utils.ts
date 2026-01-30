import type { Page, Locator } from '@playwright/test'

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
