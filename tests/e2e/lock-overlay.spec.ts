import { test, expect } from '../support/fixtures'
import {
  LOCKED_LOCATIONS,
  getMapElement,
} from '../support/helpers/test-utils'

// ═══════════════════════════════════════════════════════════════════════
// Story 3.1: Locked Location Interaction & Unlock Condition Display
// E2E tests verify LockOverlay appears when clicking locked locations,
// displays correct name/condition, and can be dismissed.
// ═══════════════════════════════════════════════════════════════════════

const LOCKED_LOCATION_DATA: Record<string, { name: string; nameEn: string; condition: string }> = {
  lanyu: { name: '蘭嶼飛魚季', nameEn: 'Lanyu Flying Fish Festival', condition: '連續好眠 14 天，解鎖這片海洋' },
  taroko: { name: '太魯閣溪流', nameEn: 'Taroko Gorge Stream', condition: '好眠 21 天，走進太魯閣的溪谷' },
  sunmoonlake: { name: '日月潭晨曦', nameEn: 'Sun Moon Lake Dawn', condition: '累積好眠 30 晚，迎接日月潭的第一道光' },
  kenting: { name: '墾丁星空', nameEn: 'Kenting Starry Sky', condition: '連續好眠 7 天，仰望墾丁的星空' },
  hehuan: { name: '合歡山銀河', nameEn: 'Hehuan Mountain Milky Way', condition: '好眠 45 天，在合歡山遇見銀河' },
  taitung: { name: '台東稻浪', nameEn: 'Taitung Rice Waves', condition: '連續好眠 10 天，聆聽稻浪的聲音' },
  yushan: { name: '玉山頂風聲', nameEn: 'Jade Mountain Summit Wind', condition: '累積好眠 60 晚，攻頂玉山聽風' },
}

test.describe('Story 3.1: Lock Overlay — P0 Critical', () => {
  test('[P0] should display LockOverlay when clicking a locked location', async ({
    page,
  }) => {
    // GIVEN: Page is loaded, no overlay visible
    const overlay = page.getByTestId('lock-overlay')
    await expect(overlay).toBeHidden()

    // WHEN: User clicks a locked location (lanyu)
    const lanyu = getMapElement(page, 'location-dot-lanyu')
    await lanyu.click()

    // THEN: LockOverlay appears
    await expect(overlay).toBeVisible()
  })

  test('[P0] should display location name and unlock condition in overlay', async ({
    page,
  }) => {
    // GIVEN: Page is loaded

    // WHEN: User clicks lanyu (locked)
    const lanyu = getMapElement(page, 'location-dot-lanyu')
    await lanyu.click()

    // THEN: Overlay panel shows name and condition
    const panel = page.getByTestId('lock-overlay-panel')
    await expect(panel.locator('h2')).toHaveText('蘭嶼飛魚季')
    await expect(panel).toContainText('連續好眠 14 天，解鎖這片海洋')
  })

  test('[P0] should display English name as subtitle in overlay', async ({
    page,
  }) => {
    // GIVEN: Page is loaded

    // WHEN: User clicks lanyu
    const lanyu = getMapElement(page, 'location-dot-lanyu')
    await lanyu.click()

    // THEN: English name shown
    const panel = page.getByTestId('lock-overlay-panel')
    await expect(panel).toContainText('Lanyu Flying Fish Festival')
  })
})

test.describe('Story 3.1: Lock Overlay — P1 High', () => {
  test('[P1] should dismiss overlay when close button is clicked', async ({
    page,
  }) => {
    // GIVEN: Overlay is shown for lanyu
    const lanyu = getMapElement(page, 'location-dot-lanyu')
    await lanyu.click()
    const overlay = page.getByTestId('lock-overlay')
    await expect(overlay).toBeVisible()

    // WHEN: User clicks the close button
    const closeBtn = page.getByTestId('lock-overlay-close')
    await closeBtn.click()

    // THEN: Overlay disappears
    await expect(overlay).toBeHidden()
  })

  test('[P1] should dismiss overlay when backdrop is clicked', async ({
    page,
  }) => {
    // GIVEN: Overlay is shown for lanyu
    const lanyu = getMapElement(page, 'location-dot-lanyu')
    await lanyu.click()
    const overlay = page.getByTestId('lock-overlay')
    await expect(overlay).toBeVisible()

    // WHEN: User clicks the backdrop (overlay itself, not the panel)
    await overlay.click({ position: { x: 10, y: 10 } })

    // THEN: Overlay disappears
    await expect(overlay).toBeHidden()
  })

  test('[P1] should NOT dismiss overlay when panel content is clicked', async ({
    page,
  }) => {
    // GIVEN: Overlay is shown for lanyu
    const lanyu = getMapElement(page, 'location-dot-lanyu')
    await lanyu.click()
    const overlay = page.getByTestId('lock-overlay')
    await expect(overlay).toBeVisible()

    // WHEN: User clicks inside the panel content
    const panel = page.getByTestId('lock-overlay-panel')
    await panel.click()

    // THEN: Overlay remains visible
    await expect(overlay).toBeVisible()
  })

  test('[P1] should keep audio playing when locked overlay is shown after unlocked selection', async ({
    page,
  }) => {
    // GIVEN: Tamsui (unlocked) is selected and playing
    const tamsui = getMapElement(page, 'location-dot-tamsui')
    await tamsui.click()
    const player = page.getByTestId('soundscape-player')
    await expect(player).toBeVisible()

    // WHEN: User clicks a locked location (taroko — mid-map, not covered by fixed player bar)
    const taroko = getMapElement(page, 'location-dot-taroko')
    await taroko.click()

    // THEN: Overlay is shown AND player remains visible (audio continues)
    await expect(page.getByTestId('lock-overlay')).toBeVisible()
    await expect(player).toBeVisible()
  })

  test('[P1] should keep LocationDetail visible when overlay is shown', async ({
    page,
  }) => {
    // GIVEN: Tamsui is selected with detail panel visible
    const tamsui = getMapElement(page, 'location-dot-tamsui')
    await tamsui.click()
    const detail = page.getByTestId('location-detail')
    await expect(detail).toBeVisible()

    // WHEN: User clicks a locked location (taroko — mid-map, not covered by fixed player bar)
    const taroko = getMapElement(page, 'location-dot-taroko')
    await taroko.click()

    // THEN: Overlay appears AND LocationDetail stays visible
    await expect(page.getByTestId('lock-overlay')).toBeVisible()
    await expect(detail).toBeVisible()
  })

  test('[P1] should allow selecting unlocked location after dismissing overlay', async ({
    page,
  }) => {
    // GIVEN: Overlay is shown for taroko
    const taroko = getMapElement(page, 'location-dot-taroko')
    await taroko.click()
    const overlay = page.getByTestId('lock-overlay')
    await expect(overlay).toBeVisible()

    // WHEN: User dismisses overlay via close button
    const closeBtn = page.getByTestId('lock-overlay-close')
    await closeBtn.click()
    await expect(overlay).toBeHidden()

    // AND: User clicks tamsui (unlocked)
    const tamsui = getMapElement(page, 'location-dot-tamsui')
    await tamsui.click()

    // THEN: LocationDetail and player appear (overlay stays gone)
    await expect(overlay).toBeHidden()
    await expect(page.getByTestId('location-detail')).toBeVisible()
    await expect(page.getByTestId('soundscape-player')).toBeVisible()
    await expect(page.getByTestId('soundscape-player')).toContainText('淡水河夕陽')
  })

  test('[P1] should display lock emoji in overlay panel', async ({
    page,
  }) => {
    // GIVEN: Page is loaded

    // WHEN: User clicks a locked location
    const lanyu = getMapElement(page, 'location-dot-lanyu')
    await lanyu.click()

    // THEN: Lock emoji is visible in the panel
    const panel = page.getByTestId('lock-overlay-panel')
    await expect(panel).toContainText('🔒')
  })

  test('[P1] should display correct data for each of the 7 locked locations', async ({
    page,
  }) => {
    // GIVEN: Page is loaded

    // WHEN/THEN: For each locked location, verify overlay shows correct data
    for (const id of LOCKED_LOCATIONS) {
      const dot = getMapElement(page, `location-dot-${id}`)
      await dot.click()

      const overlay = page.getByTestId('lock-overlay')
      await expect(overlay).toBeVisible()

      const panel = page.getByTestId('lock-overlay-panel')
      await expect(panel.locator('h2')).toHaveText(LOCKED_LOCATION_DATA[id].name)
      await expect(panel).toContainText(LOCKED_LOCATION_DATA[id].condition)

      // Dismiss before next
      const closeBtn = page.getByTestId('lock-overlay-close')
      await closeBtn.click()
      await expect(overlay).toBeHidden()
    }
  })
})

test.describe('Story 3.1: Lock Overlay — P2 Medium', () => {
  test('[P2] should NOT show SoundscapePlayer when clicking locked location without prior selection', async ({
    page,
  }) => {
    // GIVEN: Page is loaded, no prior selection

    // WHEN: User clicks a locked location first
    const lanyu = getMapElement(page, 'location-dot-lanyu')
    await lanyu.click()

    // THEN: Overlay shown but no player
    await expect(page.getByTestId('lock-overlay')).toBeVisible()
    await expect(page.getByTestId('soundscape-player')).toBeHidden()
  })

  test('[P2] should use warm language without anxiety-inducing patterns', async ({
    page,
  }) => {
    // GIVEN: Page is loaded

    // WHEN: User clicks a locked location
    const lanyu = getMapElement(page, 'location-dot-lanyu')
    await lanyu.click()

    // THEN: Text does NOT contain anxiety-inducing patterns
    const panel = page.getByTestId('lock-overlay-panel')
    const text = await panel.textContent()
    expect(text).not.toContain('剩餘')
    expect(text).not.toContain('你還沒')
    expect(text).not.toContain('失敗')
  })
})
