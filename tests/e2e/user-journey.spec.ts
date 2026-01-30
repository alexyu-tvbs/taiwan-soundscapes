import { test, expect } from '../support/fixtures'
import { getMapElement } from '../support/helpers/test-utils'

// ═══════════════════════════════════════════════════════════════════════
// Full User Journey — Cross-Feature Integration
// E2E test covering the complete user flow through all major features:
// Homepage → Map → Select Unlocked → Audio + Detail → Switch Location →
// Click Locked → Overlay → Dismiss → State Restoration
// ═══════════════════════════════════════════════════════════════════════

test.describe('Full User Journey — P1 High', () => {
  test('[P1] should complete full exploration journey across all features', async ({
    page,
  }) => {
    // ── PHASE 1: Homepage loads correctly ──
    // GIVEN: User navigates to the app
    const tagline = page.getByTestId('brand-tagline')
    await expect(tagline).toBeVisible()
    await expect(tagline).toHaveText('好眠秘境 — 用耳朵旅行台灣')

    const map = page.getByTestId('taiwan-map')
    await expect(map).toBeVisible()

    // No panels visible initially
    await expect(page.getByTestId('soundscape-player')).toBeHidden()
    await expect(page.getByTestId('location-detail')).toBeHidden()

    // ── PHASE 2: Select unlocked location (Tamsui) ──
    // WHEN: User clicks Tamsui (unlocked; force: Motion animation = "not stable")
    const tamsui = getMapElement(page, 'location-dot-tamsui')
    await tamsui.click({ force: true })

    // THEN: LocationDetail and SoundscapePlayer both appear
    const detail = page.getByTestId('location-detail')
    const player = page.getByTestId('soundscape-player')
    await expect(detail).toBeVisible()
    await expect(player).toBeVisible()

    // AND: Correct data displayed
    await expect(detail.locator('h2')).toContainText('淡水河夕陽')
    await expect(detail.locator('img')).toHaveAttribute('src', '/images/tamsui.jpg')
    await expect(player).toContainText('淡水河夕陽')

    // AND: Marker shows selected state (glow-strong filter)
    await expect(tamsui).toHaveAttribute('filter', 'url(#glow-strong)')

    // ── PHASE 3: Toggle play/pause ──
    const playPauseBtn = page.getByTestId('play-pause-btn')
    await expect(playPauseBtn).toHaveAttribute('aria-label', 'Pause')

    // Pause
    await playPauseBtn.click()
    await expect(playPauseBtn).toHaveAttribute('aria-label', 'Play')

    // Resume
    await playPauseBtn.click()
    await expect(playPauseBtn).toHaveAttribute('aria-label', 'Pause')

    // ── PHASE 4: Switch to another unlocked location (Alishan) ──
    // WHEN: User clicks Alishan
    const alishan = getMapElement(page, 'location-dot-alishan')
    await alishan.click({ force: true })

    // THEN: Panels update to Alishan data
    await expect(detail.locator('h2')).toContainText('阿里山雲海')
    await expect(detail.locator('img')).toHaveAttribute('src', '/images/alishan.jpg')
    await expect(player).toContainText('阿里山雲海')

    // AND: Selection states update (filter changes are deterministic, unlike animated r)
    await expect(alishan).toHaveAttribute('filter', 'url(#glow-strong)')
    await expect(tamsui).toHaveAttribute('filter', 'url(#glow)')

    // ── PHASE 5: Click locked location (Taroko — mid-map, not covered by fixed player bar) ──
    // WHEN: User clicks Taroko (locked)
    const taroko = getMapElement(page, 'location-dot-taroko')
    await taroko.click()

    // THEN: LockOverlay appears
    const overlay = page.getByTestId('lock-overlay')
    await expect(overlay).toBeVisible()

    const panel = page.getByTestId('lock-overlay-panel')
    await expect(panel.locator('h2')).toHaveText('太魯閣溪流')
    await expect(panel).toContainText('好眠 21 天，走進太魯閣的溪谷')
    await expect(panel).toContainText('🔒')

    // AND: LocationDetail and player remain visible underneath
    await expect(detail).toBeVisible()
    await expect(player).toBeVisible()

    // ── PHASE 6: Dismiss overlay and verify state restored ──
    // WHEN: User clicks close button
    const closeBtn = page.getByTestId('lock-overlay-close')
    await closeBtn.click()

    // THEN: Overlay dismissed, detail and player still showing Alishan
    await expect(overlay).toBeHidden()
    await expect(detail).toBeVisible()
    await expect(detail.locator('h2')).toContainText('阿里山雲海')
    await expect(player).toBeVisible()
    await expect(player).toContainText('阿里山雲海')

    // ── PHASE 7: Switch to Keelung to verify clean state ──
    // WHEN: User clicks Keelung
    const keelung = getMapElement(page, 'location-dot-keelung')
    await keelung.click({ force: true })

    // THEN: All panels update correctly
    await expect(detail.locator('h2')).toContainText('基隆港浪')
    await expect(detail.locator('img')).toHaveAttribute('src', '/images/keelung.jpg')
    await expect(player).toContainText('基隆港浪')
    await expect(keelung).toHaveAttribute('filter', 'url(#glow-strong)')
    await expect(alishan).toHaveAttribute('filter', 'url(#glow)')
  })
})
