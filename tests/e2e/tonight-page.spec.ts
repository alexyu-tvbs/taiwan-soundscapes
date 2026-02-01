import { test, expect } from '../support/fixtures'

// ═══════════════════════════════════════════════════════════════════════
// Tonight Sleep Prescription — Story 6-1 E2E Tests
// Covers: TonightPage rendering, progress bar, prescription cards,
// coach tip, cross-tab navigation to Explore + auto-play
// ═══════════════════════════════════════════════════════════════════════

test.describe('Tonight Page — P0 Critical', () => {
  test('[P0] should display TonightPage with prescription content after onboarding', async ({
    page,
  }) => {
    // GIVEN: User has completed onboarding (appPage fixture lands on Tonight tab)

    // THEN: TonightPage is visible
    await expect(page.getByTestId('tonight-page')).toBeVisible()

    // THEN: Progress bar is rendered
    await expect(page.getByTestId('progress-bar')).toBeVisible()

    // THEN: Two prescription cards are visible (breathing + soundscape)
    await expect(page.getByTestId('prescription-card')).toHaveCount(2)

    // THEN: Coach tip is visible
    await expect(page.getByTestId('coach-tip')).toBeVisible()
  })

  test('[P0] should navigate to Explore tab and play audio when soundscape card is tapped', async ({
    page,
  }) => {
    // GIVEN: User is on Tonight tab after onboarding
    await expect(page.getByTestId('tonight-page')).toBeVisible()

    // WHEN: User taps the soundscape card (the one with chevron indicator)
    const soundscapeCard = page
      .getByTestId('prescription-card')
      .filter({ has: page.getByTestId('card-chevron') })
    await soundscapeCard.click()

    // THEN: Explore tab activates — Taiwan map becomes visible
    await expect(page.getByTestId('taiwan-map')).toBeVisible()

    // THEN: SoundscapePlayer appears (audio auto-play for recommended location)
    await expect(page.getByTestId('soundscape-player')).toBeVisible()
  })
})

test.describe('Tonight Page — P1 High', () => {
  test('[P1] should display progress bar with plan name and day count', async ({
    page,
  }) => {
    // GIVEN: User is on Tonight tab after onboarding

    // THEN: Progress bar structure is rendered
    await expect(page.getByTestId('progress-bar')).toBeVisible()
    await expect(page.getByTestId('progress-fill')).toBeVisible()

    // THEN: Progress text shows "第 X 天 / 共 Y 天" format
    const progressText = page.getByTestId('progress-text')
    await expect(progressText).toBeVisible()
    await expect(progressText).toHaveText(/第 \d+ 天 \/ 共 \d+ 天/)
  })

  test('[P1] should display breathing card with exercise info and no chevron', async ({
    page,
  }) => {
    // GIVEN: User is on Tonight tab after onboarding

    // THEN: First prescription card (breathing) is visible
    const breathingCard = page.getByTestId('prescription-card').first()
    await expect(breathingCard).toBeVisible()

    // THEN: Breathing card does NOT have chevron indicator (display-only)
    await expect(breathingCard.getByTestId('card-chevron')).toHaveCount(0)

    // THEN: Card shows breathing icon
    await expect(breathingCard.getByTestId('card-icon')).toBeVisible()
  })

  test('[P1] should display soundscape card with tappable chevron indicator', async ({
    page,
  }) => {
    // GIVEN: User is on Tonight tab after onboarding

    // THEN: Soundscape card has chevron arrow (tappable)
    const soundscapeCard = page
      .getByTestId('prescription-card')
      .filter({ has: page.getByTestId('card-chevron') })
    await expect(soundscapeCard).toBeVisible()
    await expect(soundscapeCard.getByTestId('card-chevron')).toBeVisible()

    // THEN: Card shows "點擊前往聆聽" subtitle
    await expect(soundscapeCard.getByText('點擊前往聆聽')).toBeVisible()
  })

  test('[P1] should display coach tip message at bottom of page', async ({
    page,
  }) => {
    // GIVEN: User is on Tonight tab after onboarding

    // THEN: Coach tip container is visible with meaningful content
    const coachTip = page.getByTestId('coach-tip')
    await expect(coachTip).toBeVisible()

    // THEN: Tip has actual text content (not empty)
    const tipText = await coachTip.textContent()
    expect(tipText!.length).toBeGreaterThan(5)
  })

  test('[P1] should NOT navigate when breathing card is clicked', async ({
    page,
  }) => {
    // GIVEN: User is on Tonight tab after onboarding
    await expect(page.getByTestId('tonight-page')).toBeVisible()

    // WHEN: User clicks the breathing card (first card, no chevron)
    const breathingCard = page.getByTestId('prescription-card').first()
    await breathingCard.click()

    // THEN: Still on Tonight tab — TonightPage remains visible
    await expect(page.getByTestId('tonight-page')).toBeVisible()

    // THEN: Taiwan map is NOT visible (did not navigate to Explore)
    await expect(page.getByTestId('taiwan-map')).not.toBeVisible()
  })

  test('[P1] should show LocationDetail panel after cross-tab navigation from soundscape card', async ({
    page,
  }) => {
    // GIVEN: User taps soundscape card on Tonight tab
    const soundscapeCard = page
      .getByTestId('prescription-card')
      .filter({ has: page.getByTestId('card-chevron') })
    await soundscapeCard.click()

    // THEN: Explore tab activates with map visible
    await expect(page.getByTestId('taiwan-map')).toBeVisible()

    // THEN: LocationDetail panel appears (recommended location is selected)
    await expect(page.getByTestId('location-detail')).toBeVisible()
  })
})
