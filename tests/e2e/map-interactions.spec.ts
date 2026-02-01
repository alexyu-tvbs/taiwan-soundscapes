import { test, expect } from '../support/fixtures'
import {
  UNLOCKED_LOCATIONS,
  LOCKED_LOCATIONS,
  ALL_LOCATIONS,
  getMapElement,
  navigateToExploreTab,
} from '../support/helpers/test-utils'

// ═══════════════════════════════════════════════════════════════════════
// Map Interactions — Expanded Automation Coverage
// Covers gaps not addressed by ATDD tests (taiwan-map.spec.ts)
// Focus: locked marker interaction, fill colors, cursor styles, rapid clicks
// ═══════════════════════════════════════════════════════════════════════

// Phase 2: Map is on Explore tab — navigate there before each test
test.beforeEach(async ({ page }) => {
  await navigateToExploreTab(page)
})

test.describe('Map Interactions — P1 High', () => {
  test('[P1] should show LockOverlay instead of selecting when clicking a locked marker', async ({
    page,
  }) => {
    // GIVEN: Page is loaded with map

    // WHEN: User clicks on a locked marker (lanyu)
    const lanyu = getMapElement(page, 'location-dot-lanyu')
    await lanyu.click({ force: true })

    // THEN: Locked marker does NOT change radius (stays r=6) — overlay shown instead
    await expect(lanyu).toHaveAttribute('r', '6')
    await expect(page.getByTestId('lock-overlay')).toBeVisible()
  })

  test('[P1] should keep unlocked marker selected when clicking a locked marker', async ({
    page,
  }) => {
    // GIVEN: Tamsui (unlocked) is selected
    const tamsui = getMapElement(page, 'location-dot-tamsui')
    const taroko = getMapElement(page, 'location-dot-taroko')

    await tamsui.click({ force: true })
    await expect(tamsui).toHaveAttribute('filter', 'url(#glow-strong)')

    // WHEN: User clicks Taroko (locked) — shows overlay, preserves selection
    await taroko.click({ force: true })

    // THEN: Tamsui stays selected (glow-strong), Taroko stays locked (r=6), overlay shown
    await expect(tamsui).toHaveAttribute('filter', 'url(#glow-strong)')
    await expect(taroko).toHaveAttribute('r', '6')
    await expect(page.getByTestId('lock-overlay')).toBeVisible()
  })

  test('[P1] should render unlocked markers with amber fill color', async ({
    page,
  }) => {
    // GIVEN: Page is loaded with map

    // THEN: Unlocked markers have amber fill (#F59E0B)
    for (const id of UNLOCKED_LOCATIONS) {
      const dot = getMapElement(page, `location-dot-${id}`)
      await expect(dot).toHaveAttribute('fill', '#F59E0B')
    }
  })

  test('[P1] should render locked markers with slate fill color', async ({
    page,
  }) => {
    // GIVEN: Page is loaded with map

    // THEN: Locked markers have slate fill (#64748B)
    for (const id of LOCKED_LOCATIONS) {
      const dot = getMapElement(page, `location-dot-${id}`)
      await expect(dot).toHaveAttribute('fill', '#64748B')
    }
  })
})

test.describe('Map Interactions — P2 Medium', () => {
  test('[P2] should only have last clicked marker selected after rapid clicks', async ({
    page,
  }) => {
    // GIVEN: Page is loaded with map

    // WHEN: User clicks tamsui, then alishan, then keelung rapidly
    const tamsui = getMapElement(page, 'location-dot-tamsui')
    const alishan = getMapElement(page, 'location-dot-alishan')
    const keelung = getMapElement(page, 'location-dot-keelung')

    await tamsui.click({ force: true })
    await alishan.click({ force: true })
    await keelung.click({ force: true })

    // THEN: Only keelung is selected (glow-strong), others revert to standard glow
    await expect(keelung).toHaveAttribute('filter', 'url(#glow-strong)')
    await expect(tamsui).toHaveAttribute('filter', 'url(#glow)')
    await expect(alishan).toHaveAttribute('filter', 'url(#glow)')
  })

  test('[P2] should show pointer cursor on all location markers', async ({
    page,
  }) => {
    // GIVEN: Page is loaded with map

    // THEN: All markers have cursor: pointer style
    for (const id of ALL_LOCATIONS) {
      const dot = getMapElement(page, `location-dot-${id}`)
      await expect(dot).toHaveCSS('cursor', 'pointer')
    }
  })
})
