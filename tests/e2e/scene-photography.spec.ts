import { test, expect } from '../support/fixtures'
import {
  UNLOCKED_LOCATIONS,
  getMapElement,
} from '../support/helpers/test-utils'

// ═══════════════════════════════════════════════════════════════════════
// Story 2.2: Scene Photography & Complete Soundscape Assets
// E2E tests verify LocationDetail panel displays scene photograph and
// location name when an unlocked location is selected, and that both
// LocationDetail and SoundscapePlayer appear simultaneously.
// ═══════════════════════════════════════════════════════════════════════

const LOCATION_DATA: Record<string, { name: string; imagePath: string }> = {
  tamsui: { name: '淡水河夕陽', imagePath: '/images/tamsui.jpg' },
  alishan: { name: '阿里山雲海', imagePath: '/images/alishan.jpg' },
  keelung: { name: '基隆港浪', imagePath: '/images/keelung.jpg' },
}

test.describe('Story 2.2: Scene Photography — P0 Critical', () => {
  test('[P0] should display LocationDetail with scene photo when clicking an unlocked location', async ({
    page,
  }) => {
    // GIVEN: Page is loaded, no detail panel visible
    const detail = page.getByTestId('location-detail')
    await expect(detail).toBeHidden()

    // WHEN: User clicks tamsui (unlocked)
    const tamsui = getMapElement(page, 'location-dot-tamsui')
    await tamsui.click({ force: true })

    // THEN: LocationDetail appears with photo and name
    await expect(detail).toBeVisible()
    const img = detail.locator('img')
    await expect(img).toBeVisible()
    await expect(img).toHaveAttribute('src', '/images/tamsui.jpg')
    await expect(detail.locator('h2')).toContainText('淡水河夕陽')
  })

  test('[P0] should show both LocationDetail and SoundscapePlayer simultaneously', async ({
    page,
  }) => {
    // GIVEN: Page is loaded
    const detail = page.getByTestId('location-detail')
    const player = page.getByTestId('soundscape-player')

    // WHEN: User clicks an unlocked location
    const tamsui = getMapElement(page, 'location-dot-tamsui')
    await tamsui.click({ force: true })

    // THEN: Both panels are visible
    await expect(detail).toBeVisible()
    await expect(player).toBeVisible()
  })

  test('[P0] should update photo and name when switching between unlocked locations', async ({
    page,
  }) => {
    const detail = page.getByTestId('location-detail')
    const img = detail.locator('img')

    // GIVEN: Tamsui is selected
    const tamsui = getMapElement(page, 'location-dot-tamsui')
    await tamsui.click({ force: true })
    await expect(img).toHaveAttribute('src', '/images/tamsui.jpg')
    await expect(detail.locator('h2')).toContainText('淡水河夕陽')

    // WHEN: User clicks alishan
    const alishan = getMapElement(page, 'location-dot-alishan')
    await alishan.click({ force: true })

    // THEN: Photo and name update to alishan
    await expect(img).toHaveAttribute('src', '/images/alishan.jpg')
    await expect(detail.locator('h2')).toContainText('阿里山雲海')
  })
})

test.describe('Story 2.2: Scene Photography — P1 High', () => {
  test('[P1] should not show LocationDetail when no location is selected', async ({
    page,
  }) => {
    const detail = page.getByTestId('location-detail')
    await expect(detail).toBeHidden()
  })

  test('[P1] should not show LocationDetail when a locked location is clicked', async ({
    page,
  }) => {
    const lanyu = getMapElement(page, 'location-dot-lanyu')
    await lanyu.click()

    const detail = page.getByTestId('location-detail')
    await expect(detail).toBeHidden()
  })

  test('[P1] should display correct photo for each unlocked location', async ({
    page,
  }) => {
    const detail = page.getByTestId('location-detail')
    const img = detail.locator('img')

    for (const id of UNLOCKED_LOCATIONS) {
      const dot = getMapElement(page, `location-dot-${id}`)
      await dot.click({ force: true })

      await expect(detail).toBeVisible()
      await expect(img).toHaveAttribute('src', LOCATION_DATA[id].imagePath)
      await expect(detail.locator('h2')).toContainText(LOCATION_DATA[id].name)
    }
  })

  test('[P1] should display English name as subtitle for each unlocked location', async ({
    page,
  }) => {
    const detail = page.getByTestId('location-detail')

    const tamsui = getMapElement(page, 'location-dot-tamsui')
    await tamsui.click({ force: true })

    await expect(detail.locator('p')).toContainText('Tamsui River Sunset')
  })

  test('[P1] should keep LocationDetail visible when clicking locked location after unlocked', async ({
    page,
  }) => {
    const detail = page.getByTestId('location-detail')

    // Select unlocked location first
    const tamsui = getMapElement(page, 'location-dot-tamsui')
    await tamsui.click({ force: true })
    await expect(detail).toBeVisible()

    // Click locked location — shows overlay, preserves selection
    const taroko = getMapElement(page, 'location-dot-taroko')
    await taroko.click()

    // LocationDetail stays visible; LockOverlay shown on top
    await expect(detail).toBeVisible()
    await expect(page.getByTestId('lock-overlay')).toBeVisible()
  })

  test('[P1] should show matching photo and player name for each unlocked location', async ({
    page,
  }) => {
    const detail = page.getByTestId('location-detail')
    const img = detail.locator('img')
    const player = page.getByTestId('soundscape-player')

    // GIVEN/WHEN/THEN: For each unlocked location, verify BOTH photo AND player match
    for (const id of UNLOCKED_LOCATIONS) {
      const dot = getMapElement(page, `location-dot-${id}`)
      await dot.click({ force: true })

      // THEN: Photo src matches the location
      await expect(img).toHaveAttribute('src', LOCATION_DATA[id].imagePath)

      // AND: SoundscapePlayer shows the same location name
      await expect(player).toBeVisible()
      await expect(player).toContainText(LOCATION_DATA[id].name)
    }
  })
})

test.describe('Story 2.2: Scene Photography — P2 Medium', () => {
  test('[P2] should keep LocationDetail visible when re-clicking the same location', async ({
    page,
  }) => {
    const detail = page.getByTestId('location-detail')
    const img = detail.locator('img')

    // GIVEN: Tamsui is selected
    const tamsui = getMapElement(page, 'location-dot-tamsui')
    await tamsui.click({ force: true })
    await expect(detail).toBeVisible()
    await expect(img).toHaveAttribute('src', '/images/tamsui.jpg')

    // WHEN: User clicks tamsui again
    await tamsui.click({ force: true })

    // THEN: LocationDetail remains visible with correct data
    await expect(detail).toBeVisible()
    await expect(img).toHaveAttribute('src', '/images/tamsui.jpg')
    await expect(detail.locator('h2')).toContainText('淡水河夕陽')
  })

  test('[P2] should converge to correct state after cycling through all locations', async ({
    page,
  }) => {
    const detail = page.getByTestId('location-detail')
    const img = detail.locator('img')

    // GIVEN: User rapidly cycles through all locations
    for (const id of UNLOCKED_LOCATIONS) {
      const dot = getMapElement(page, `location-dot-${id}`)
      await dot.click({ force: true })
    }

    // THEN: Final state matches the last location (keelung)
    await expect(detail).toBeVisible()
    await expect(img).toHaveAttribute('src', '/images/keelung.jpg')
    await expect(detail.locator('h2')).toContainText('基隆港浪')
  })
})
