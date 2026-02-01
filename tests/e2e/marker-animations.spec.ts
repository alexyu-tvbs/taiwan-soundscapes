import { test, expect } from '../support/fixtures'
import {
  UNLOCKED_LOCATIONS,
  LOCKED_LOCATIONS,
  getMapElement,
  navigateToExploreTab,
} from '../support/helpers/test-utils'

// ═══════════════════════════════════════════════════════════════════════
// Story 4.1: Location Marker Animations & Visual States
// E2E automation — glow filters, lock icons, animation interaction safety
// ═══════════════════════════════════════════════════════════════════════

// Phase 2: Map is on Explore tab — navigate there before each test
test.beforeEach(async ({ page }) => {
  await navigateToExploreTab(page)
})

test.describe('Story 4.1: Glow Filter Definitions — P1 High', () => {
  test('[P1] should define standard glow SVG filter in map defs', async ({
    page,
  }) => {
    // GIVEN: Page is loaded with Taiwan map

    // THEN: SVG <defs> contains filter#glow with feGaussianBlur
    const glowFilter = page.locator('filter#glow')
    await expect(glowFilter).toBeAttached()

    const blur = page.locator('filter#glow feGaussianBlur')
    await expect(blur).toBeAttached()
  })

  test('[P1] should define stronger glow SVG filter for selected markers', async ({
    page,
  }) => {
    // GIVEN: Page is loaded with Taiwan map

    // THEN: SVG <defs> contains filter#glow-strong with feGaussianBlur
    const glowStrong = page.locator('filter#glow-strong')
    await expect(glowStrong).toBeAttached()

    const blur = page.locator('filter#glow-strong feGaussianBlur')
    await expect(blur).toBeAttached()
  })

  test('[P2] should use larger blur radius in glow-strong than standard glow', async ({
    page,
  }) => {
    // GIVEN: Page is loaded with Taiwan map

    // THEN: glow-strong has larger stdDeviation than standard glow
    const standardBlur = page.locator('filter#glow feGaussianBlur')
    const strongBlur = page.locator('filter#glow-strong feGaussianBlur')

    const standardDev = Number(await standardBlur.getAttribute('stdDeviation'))
    const strongDev = Number(await strongBlur.getAttribute('stdDeviation'))

    expect(strongDev).toBeGreaterThan(standardDev)
  })
})

test.describe('Story 4.1: Unlocked Marker Glow — P1 High', () => {
  test('[P1] should apply glow filter to all unlocked markers', async ({
    page,
  }) => {
    // GIVEN: Page is loaded with map

    // THEN: Each unlocked marker references the glow filter
    for (const id of UNLOCKED_LOCATIONS) {
      const dot = getMapElement(page, `location-dot-${id}`)
      await expect(dot).toHaveAttribute('filter', 'url(#glow)')
    }
  })

  test('[P1] should switch to glow-strong filter when marker is selected', async ({
    page,
  }) => {
    // GIVEN: Page is loaded with map
    const tamsui = getMapElement(page, 'location-dot-tamsui')

    // WHEN: User selects tamsui (force: Motion animation keeps r oscillating = "not stable")
    await tamsui.click({ force: true })

    // THEN: Selected marker uses glow-strong filter
    await expect(tamsui).toHaveAttribute('filter', 'url(#glow-strong)')
  })

  test('[P1] should revert to standard glow when marker is deselected', async ({
    page,
  }) => {
    // GIVEN: Tamsui is selected
    const tamsui = getMapElement(page, 'location-dot-tamsui')
    const alishan = getMapElement(page, 'location-dot-alishan')

    await tamsui.click({ force: true })
    await expect(tamsui).toHaveAttribute('filter', 'url(#glow-strong)')

    // WHEN: User selects alishan instead
    await alishan.click({ force: true })

    // THEN: Tamsui reverts to standard glow, alishan gets glow-strong
    await expect(tamsui).toHaveAttribute('filter', 'url(#glow)')
    await expect(alishan).toHaveAttribute('filter', 'url(#glow-strong)')
  })
})

test.describe('Story 4.1: Lock Icon Visibility — P1 High', () => {
  test('[P1] should display lock icons on all locked markers', async ({
    page,
  }) => {
    // GIVEN: Page is loaded with map

    // THEN: Each locked marker has a visible lock icon
    for (const id of LOCKED_LOCATIONS) {
      const lockIcon = getMapElement(page, `lock-icon-${id}`)
      await expect(lockIcon).toBeAttached()
    }
  })

  test('[P1] should NOT display lock icons on unlocked markers', async ({
    page,
  }) => {
    // GIVEN: Page is loaded with map

    // THEN: Unlocked markers have no lock icon
    for (const id of UNLOCKED_LOCATIONS) {
      const lockIcon = page.getByTestId(`lock-icon-${id}`)
      await expect(lockIcon).toHaveCount(0)
    }
  })

  test('[P1] should render lock icon using SVG shapes (not emoji)', async ({
    page,
  }) => {
    // GIVEN: Page is loaded with map

    // THEN: Lock icon contains SVG rect and path elements (not <text>)
    const lockIcon = getMapElement(page, 'lock-icon-lanyu')
    const rect = lockIcon.locator('rect')
    const path = lockIcon.locator('path')
    const text = lockIcon.locator('text')

    await expect(rect).toBeAttached()
    await expect(path).toBeAttached()
    await expect(text).toHaveCount(0)
  })

  test('[P2] should render lock icons as non-interactive overlays', async ({
    page,
  }) => {
    // GIVEN: Page is loaded with map

    // THEN: Lock icon has pointer-events: none (clicks pass through to marker)
    const lockIcon = getMapElement(page, 'lock-icon-lanyu')
    await expect(lockIcon).toHaveCSS('pointer-events', 'none')
  })
})

test.describe('Story 4.1: Animation Interaction Safety — P1 High', () => {
  test('[P1] should allow clicking unlocked markers while glow animation runs', async ({
    page,
  }) => {
    // GIVEN: Page is loaded — glow animations are running on unlocked markers

    // WHEN: User clicks tamsui during animation (force: element animates continuously)
    const tamsui = getMapElement(page, 'location-dot-tamsui')
    await tamsui.click({ force: true })

    // THEN: Marker responds — selected state activates (r animates around 8-10)
    await expect(tamsui).toHaveAttribute('filter', 'url(#glow-strong)')
  })

  test('[P1] should allow switching between animated markers without jank', async ({
    page,
  }) => {
    // GIVEN: Page is loaded with animations running

    // WHEN: User clicks through all 3 unlocked markers sequentially
    for (const id of UNLOCKED_LOCATIONS) {
      const dot = getMapElement(page, `location-dot-${id}`)
      await dot.click({ force: true })
      // Selected marker switches to glow-strong filter
      await expect(dot).toHaveAttribute('filter', 'url(#glow-strong)')
    }

    // THEN: Last clicked marker has glow-strong, others reverted to standard glow
    const lastId = UNLOCKED_LOCATIONS[UNLOCKED_LOCATIONS.length - 1]
    const lastDot = getMapElement(page, `location-dot-${lastId}`)
    await expect(lastDot).toHaveAttribute('filter', 'url(#glow-strong)')

    for (const id of UNLOCKED_LOCATIONS.slice(0, -1)) {
      const dot = getMapElement(page, `location-dot-${id}`)
      await expect(dot).toHaveAttribute('filter', 'url(#glow)')
    }
  })

  test('[P1] should allow clicking locked markers during unlocked glow animation', async ({
    page,
  }) => {
    // GIVEN: Unlocked markers are animating

    // WHEN: User clicks a locked marker
    const lanyu = getMapElement(page, 'location-dot-lanyu')
    await lanyu.dispatchEvent('click')

    // THEN: Lock overlay appears — animation did not block interaction
    await expect(page.getByTestId('lock-overlay')).toBeVisible()
  })
})

test.describe('Story 4.1: Visual Contrast — P2 Medium', () => {
  test('[P2] should have no glow filter on locked markers', async ({
    page,
  }) => {
    // GIVEN: Page is loaded with map

    // THEN: Locked markers do NOT reference any glow filter
    for (const id of LOCKED_LOCATIONS) {
      const dot = getMapElement(page, `location-dot-${id}`)
      const filter = await dot.getAttribute('filter')
      expect(filter).toBeNull()
    }
  })
})
