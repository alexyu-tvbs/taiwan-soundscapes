import { test as base, expect } from '@playwright/test'

// ═══════════════════════════════════════════════════════════════════════
// Sleep Assessment Questionnaire & Type Result — Story 5-2 E2E Tests
// Covers: Onboarding flow, questionnaire navigation, progress indicator,
// back navigation, result screen, transition to main app
// ═══════════════════════════════════════════════════════════════════════

// Use base test (NOT the appPage fixture) because these tests start
// from the raw onboarding state before the questionnaire is completed.
const test = base.extend({
  page: async ({ page }, use) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await use(page)
  },
})

test.describe('Sleep Assessment — P0 Critical', () => {
  test('[P0] should show fullscreen SleepAssessment on first load with no TabBar', async ({
    page,
  }) => {
    // GIVEN: App loads for the first time (onboardingComplete = false)

    // THEN: SleepAssessment is visible as fullscreen
    const assessment = page.getByTestId('sleep-assessment')
    await expect(assessment).toBeVisible()

    // THEN: TabBar is NOT visible
    await expect(page.getByTestId('tab-bar')).not.toBeVisible()
  })

  test('[P0] should complete full 5-question flow and reach result screen', async ({
    page,
  }) => {
    // GIVEN: SleepAssessment is displayed with Q1

    // WHEN: User answers all 5 questions by clicking the first option each time
    for (let i = 0; i < 5; i++) {
      const option = page.getByTestId('option-0')
      await expect(option).toBeVisible()
      await option.click()
    }

    // THEN: Result screen is displayed
    const result = page.getByTestId('sleep-result')
    await expect(result).toBeVisible()

    // THEN: CTA button "開始我的計畫" is visible
    const ctaButton = page.getByTestId('start-plan-btn')
    await expect(ctaButton).toBeVisible()
    await expect(ctaButton).toHaveText('開始我的計畫')
  })

  test('[P0] should transition to main app with TabBar after tapping CTA', async ({
    page,
  }) => {
    // GIVEN: User has completed the questionnaire
    for (let i = 0; i < 5; i++) {
      const option = page.getByTestId('option-0')
      await expect(option).toBeVisible()
      await option.click()
    }
    await expect(page.getByTestId('sleep-result')).toBeVisible()

    // WHEN: User taps "開始我的計畫"
    await page.getByTestId('start-plan-btn').click()

    // THEN: TabBar appears
    await expect(page.getByTestId('tab-bar')).toBeVisible()

    // THEN: SleepAssessment is no longer visible
    await expect(page.getByTestId('sleep-assessment')).not.toBeVisible()

    // THEN: TonightPage content is visible (default active tab)
    await expect(page.getByTestId('tonight-page')).toBeVisible()
  })
})

test.describe('Sleep Assessment — P1 High', () => {
  test('[P1] should show progress indicator updating through questions', async ({
    page,
  }) => {
    // GIVEN: SleepAssessment shows Q1

    // THEN: Progress shows "1 / 5"
    await expect(page.getByText('1 / 5')).toBeVisible()

    // WHEN: User answers Q1
    await page.getByTestId('option-0').click()

    // THEN: Progress shows "2 / 5"
    await expect(page.getByText('2 / 5')).toBeVisible()

    // WHEN: User answers Q2
    await page.getByTestId('option-0').click()

    // THEN: Progress shows "3 / 5"
    await expect(page.getByText('3 / 5')).toBeVisible()
  })

  test('[P1] should show back button on Q2+ and preserve selected answer on return', async ({
    page,
  }) => {
    // GIVEN: User is on Q1

    // THEN: No back button on Q1
    await expect(page.getByTestId('back-btn')).not.toBeVisible()

    // WHEN: User answers Q1 (selects first option)
    await page.getByTestId('option-0').click()

    // THEN: Now on Q2, back button is visible
    await expect(page.getByText('2 / 5')).toBeVisible()
    await expect(page.getByTestId('back-btn')).toBeVisible()

    // WHEN: User clicks back button
    await page.getByTestId('back-btn').click()

    // THEN: Back on Q1 with progress "1 / 5"
    await expect(page.getByText('1 / 5')).toBeVisible()

    // THEN: Previously selected option has amber highlight (preserved answer)
    const firstOption = page.getByTestId('option-0')
    await expect(firstOption).toHaveClass(/amber/)
  })

  test('[P1] should display sleep type name, description, and approach on result', async ({
    page,
  }) => {
    // GIVEN: User completes all 5 questions
    for (let i = 0; i < 5; i++) {
      const option = page.getByTestId('option-0')
      await expect(option).toBeVisible()
      await option.click()
    }

    // THEN: Result screen shows one of the 3 sleep type names
    const result = page.getByTestId('sleep-result')
    await expect(result).toBeVisible()

    const resultText = await result.textContent()

    // THEN: One of the 3 type names is displayed
    const hasTypeName =
      resultText?.includes('入睡困難型') ||
      resultText?.includes('淺眠易醒型') ||
      resultText?.includes('焦慮思緒型')
    expect(hasTypeName).toBe(true)

    // THEN: Result has substantial content (description + approach)
    expect(resultText!.length).toBeGreaterThan(50)

    // THEN: CTA button exists
    await expect(page.getByTestId('start-plan-btn')).toBeVisible()
  })
})

test.describe('Sleep Assessment — P2 Medium', () => {
  test('[P2] should animate question transitions with slide effect', async ({
    page,
  }) => {
    // GIVEN: User is on Q1
    await expect(page.getByText('1 / 5')).toBeVisible()

    // WHEN: User answers Q1 (triggering forward slide)
    await page.getByTestId('option-0').click()

    // THEN: Q2 content is visible after transition
    await expect(page.getByText('2 / 5')).toBeVisible()
    await expect(page.getByText('你半夜會醒來幾次')).toBeVisible()

    // WHEN: User clicks back (triggering backward slide)
    await page.getByTestId('back-btn').click()

    // THEN: Q1 content is visible after transition
    await expect(page.getByText('1 / 5')).toBeVisible()
    await expect(page.getByText('你通常需要多久才能入睡')).toBeVisible()
  })
})
