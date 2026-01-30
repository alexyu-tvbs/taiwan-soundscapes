import { test, expect } from '../support/fixtures'
import {
  UNLOCKED_LOCATIONS,
  LOCKED_LOCATIONS,
  ALL_LOCATIONS,
  getMapElement,
} from '../support/helpers/test-utils'

// ═══════════════════════════════════════════════════════════════════════
// Story 1.2: Interactive Taiwan Map with Location Markers & Brand Tagline
// ATDD RED Phase — All tests expected to FAIL (implementation missing)
// Test IDs aligned with test-design-epic-1.md
// ═══════════════════════════════════════════════════════════════════════

test.describe('Story 1.2: Taiwan Map — P0 Critical', () => {
  // 1.2-E2E-001: SVG Taiwan map renders prominently on dark background
  test('should display SVG Taiwan map prominently on dark background', async ({
    page,
  }) => {
    // GIVEN: Page is loaded with dark theme

    // THEN: SVG Taiwan map is visible and prominent
    const map = getMapElement(page, 'taiwan-map')
    await expect(map).toBeVisible()

    // AND: Map is an SVG element with a valid viewBox
    const viewBox = await map.getAttribute('viewBox')
    expect(viewBox).not.toBeNull()

    // AND: Map is sized appropriately for the viewport
    const box = await map.boundingBox()
    expect(box).not.toBeNull()
    expect(box!.width).toBeGreaterThan(200)
    expect(box!.height).toBeGreaterThan(200)
  })

  // 1.2-E2E-002: 10 location markers visible with correct unlock/lock states
  test('should display all 10 location markers on the map', async ({
    page,
  }) => {
    // GIVEN: Page is loaded with Taiwan map

    // THEN: All 10 location markers are visible as SVG elements
    for (const id of ALL_LOCATIONS) {
      const dot = getMapElement(page, `location-dot-${id}`)
      await expect(dot).toBeVisible()
    }
  })

  test('should show 3 unlocked locations with full opacity', async ({
    page,
  }) => {
    // GIVEN: Page is loaded

    // THEN: Unlocked markers (tamsui, alishan, keelung) have opacity=1
    for (const id of UNLOCKED_LOCATIONS) {
      const dot = getMapElement(page, `location-dot-${id}`)
      await expect(dot).toHaveAttribute('opacity', '1')
    }
  })

  test('should show 7 locked locations with dimmed opacity', async ({
    page,
  }) => {
    // GIVEN: Page is loaded

    // THEN: Locked markers have reduced opacity (0.4)
    for (const id of LOCKED_LOCATIONS) {
      const dot = getMapElement(page, `location-dot-${id}`)
      await expect(dot).toHaveAttribute('opacity', '0.4')
    }
  })

  // 1.2-E2E-003: Brand tagline visible in header area
  test('should display brand tagline in header area', async ({
    page,
  }) => {
    // GIVEN: Page is loaded

    // THEN: Brand tagline is visible with correct text
    const tagline = getMapElement(page, 'brand-tagline')
    await expect(tagline).toBeVisible()
    await expect(tagline).toHaveText('好眠秘境 — 用耳朵旅行台灣')
  })
})

test.describe('Story 1.2: Taiwan Map — P1 High', () => {
  // 1.2-E2E-004: Unlocked markers at geographically correct SVG coordinates
  test('should position unlocked markers with valid SVG coordinates', async ({
    page,
  }) => {
    // GIVEN: Page is loaded with map

    // THEN: Each unlocked marker has valid cx/cy SVG attributes
    for (const id of UNLOCKED_LOCATIONS) {
      const dot = getMapElement(page, `location-dot-${id}`)
      const cx = await dot.getAttribute('cx')
      const cy = await dot.getAttribute('cy')
      expect(cx).not.toBeNull()
      expect(cy).not.toBeNull()
      expect(Number(cx)).toBeGreaterThan(0)
      expect(Number(cy)).toBeGreaterThan(0)
    }
  })

  // 1.2-E2E-005: Locked markers at correct SVG coordinates
  test('should position locked markers with valid SVG coordinates', async ({
    page,
  }) => {
    // GIVEN: Page is loaded with map

    // THEN: Each locked marker has valid cx/cy SVG attributes
    for (const id of LOCKED_LOCATIONS) {
      const dot = getMapElement(page, `location-dot-${id}`)
      const cx = await dot.getAttribute('cx')
      const cy = await dot.getAttribute('cy')
      expect(cx).not.toBeNull()
      expect(cy).not.toBeNull()
      expect(Number(cx)).toBeGreaterThan(0)
      expect(Number(cy)).toBeGreaterThan(0)
    }
  })

  // 1.2-E2E-006: Click updates selectedLocationId (visual: marker radius changes)
  test('should update selected state when clicking a location marker', async ({
    page,
  }) => {
    // GIVEN: Page is loaded with map
    const tamsui = getMapElement(page, 'location-dot-tamsui')

    // WHEN: User clicks on Tamsui marker
    await tamsui.click()

    // THEN: Tamsui marker shows selected state (radius increases to 8)
    await expect(tamsui).toHaveAttribute('r', '8')
  })

  test('should deselect previous marker when selecting a new one', async ({
    page,
  }) => {
    // GIVEN: Tamsui is selected
    const tamsui = getMapElement(page, 'location-dot-tamsui')
    const alishan = getMapElement(page, 'location-dot-alishan')

    await tamsui.click()
    await expect(tamsui).toHaveAttribute('r', '8')

    // WHEN: User clicks Alishan
    await alishan.click()

    // THEN: Alishan is selected, Tamsui reverts to default
    await expect(alishan).toHaveAttribute('r', '8')
    await expect(tamsui).toHaveAttribute('r', '6')
  })

  // 1.2-E2E-007: Hover shows location name via SVG <title>
  test('should show location name via SVG title element for tooltip', async ({
    page,
  }) => {
    // GIVEN: Page is loaded with map

    // THEN: Each unlocked marker has a <title> child with Chinese name
    const expectedNames: Record<string, string> = {
      tamsui: '淡水河夕陽',
      alishan: '阿里山雲海',
      keelung: '基隆港浪',
    }

    for (const id of UNLOCKED_LOCATIONS) {
      const dot = getMapElement(page, `location-dot-${id}`)
      const title = dot.locator('title')
      await expect(title).toHaveText(expectedNames[id])
    }
  })

  test('should show locked location names via SVG title element', async ({
    page,
  }) => {
    // GIVEN: Page is loaded with map

    // THEN: Locked markers also have <title> with Chinese name
    const expectedNames: Record<string, string> = {
      lanyu: '蘭嶼飛魚季',
      taroko: '太魯閣溪流',
      sunmoonlake: '日月潭晨曦',
      kenting: '墾丁星空',
      hehuan: '合歡山銀河',
      taitung: '台東稻浪',
      yushan: '玉山頂風聲',
    }

    for (const id of LOCKED_LOCATIONS) {
      const dot = getMapElement(page, `location-dot-${id}`)
      const title = dot.locator('title')
      await expect(title).toHaveText(expectedNames[id])
    }
  })

  // 1.2-E2E-008: Tailwind CSS v4 functioning correctly
  test('should render Tailwind CSS v4 dark theme utilities', async ({
    page,
  }) => {
    // GIVEN: Page is loaded

    // THEN: Dark theme background is rendered
    // Tailwind CSS v4 uses oklch color space; bg-slate-900 = oklch(0.208 0.042 265.755)
    const rootDiv = page.locator('#root > div').first()
    await expect(rootDiv).toHaveCSS(
      'background-color',
      /rgb\(15, 23, 42\)|oklch\(0\.208 0\.042 265\.755\)/,
    )
    await expect(rootDiv).toHaveCSS(
      'color',
      /rgb\(255, 255, 255\)|oklch\(1 0 0\)/,
    )

    // AND: No unstyled content flash — min-height covers viewport
    await expect(rootDiv).toHaveCSS('min-height', /\d+px/)
  })
})

test.describe('Story 1.2: Taiwan Map — P2 Medium', () => {
  // 1.2-E2E-009: SVG viewBox integrity
  test('should have valid SVG viewBox attribute on map', async ({
    page,
  }) => {
    // GIVEN: Page is loaded

    // THEN: SVG has a properly formatted viewBox (4 numbers)
    const map = getMapElement(page, 'taiwan-map')
    const viewBox = await map.getAttribute('viewBox')
    expect(viewBox).not.toBeNull()
    expect(viewBox).toMatch(/^\d+(\.\d+)?\s+\d+(\.\d+)?\s+\d+(\.\d+)?\s+\d+(\.\d+)?$/)
  })

  // 1.2-E2E-010: Performance — page loads and map renders within 2 seconds
  test('should load page and render map within 2 seconds', async ({
    page,
  }) => {
    // GIVEN: Fresh page navigation

    // WHEN: Navigating to homepage
    const startTime = Date.now()
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')

    // THEN: Map is visible within 2 seconds
    const map = page.getByTestId('taiwan-map')
    await expect(map).toBeVisible({ timeout: 2000 })

    const loadTime = Date.now() - startTime
    expect(loadTime).toBeLessThan(2000)
  })
})
