import { test, expect } from '../support/fixtures'
import {
  UNLOCKED_LOCATIONS,
  LOCKED_LOCATIONS,
  ALL_LOCATIONS,
  getMapElement,
} from '../support/helpers/test-utils'

// ═══════════════════════════════════════════════════════════════════════
// Map Interactions — Expanded Automation Coverage
// Covers gaps not addressed by ATDD tests (taiwan-map.spec.ts)
// Focus: locked marker interaction, fill colors, cursor styles, rapid clicks
// ═══════════════════════════════════════════════════════════════════════

test.describe('Map Interactions — P1 High', () => {
  test('[P1] should update selection state when clicking a locked marker', async ({
    page,
  }) => {
    // GIVEN: Page is loaded with map

    // WHEN: User clicks on a locked marker (lanyu)
    const lanyu = getMapElement(page, 'location-dot-lanyu')
    await lanyu.click()

    // THEN: Locked marker shows selected state (radius increases to 8)
    await expect(lanyu).toHaveAttribute('r', '8')
  })

  test('[P1] should deselect unlocked marker when selecting a locked marker', async ({
    page,
  }) => {
    // GIVEN: Tamsui (unlocked) is selected
    const tamsui = getMapElement(page, 'location-dot-tamsui')
    const taroko = getMapElement(page, 'location-dot-taroko')

    await tamsui.click()
    await expect(tamsui).toHaveAttribute('r', '8')

    // WHEN: User clicks Taroko (locked)
    await taroko.click()

    // THEN: Taroko is selected, Tamsui reverts to default
    await expect(taroko).toHaveAttribute('r', '8')
    await expect(tamsui).toHaveAttribute('r', '6')
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

    await tamsui.click()
    await alishan.click()
    await keelung.click()

    // THEN: Only keelung is selected (r=8), others are default (r=6)
    await expect(keelung).toHaveAttribute('r', '8')
    await expect(tamsui).toHaveAttribute('r', '6')
    await expect(alishan).toHaveAttribute('r', '6')
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
