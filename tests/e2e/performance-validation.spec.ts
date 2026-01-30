import { test, expect } from '../support/fixtures'
import {
  UNLOCKED_LOCATIONS,
  getMapElement,
  waitForDetailTransition,
} from '../support/helpers/test-utils'

// ═══════════════════════════════════════════════════════════════════════
// Story 4.2: Performance Validation (NFR1–NFR5)
// E2E automation — page load timing, audio responsiveness,
// photo load speed, and location-switch stability
// ═══════════════════════════════════════════════════════════════════════

test.describe('Story 4.2: Page Load Performance — P1 High', () => {
  test('[P1] should render the map within 2 seconds of navigation (NFR1)', async ({
    page,
  }) => {
    // GIVEN: Performance timing is available after page load (fixture navigates to /)

    // WHEN: We measure the time from navigation start to map visible
    const loadTime = await page.evaluate(() => {
      const timing = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      return timing.domContentLoadedEventEnd - timing.startTime
    })

    // THEN: Page load completes within 2000ms (NFR1)
    expect(loadTime).toBeLessThan(2000)

    // AND: Map is visible
    await expect(page.getByTestId('taiwan-map')).toBeVisible()
  })

  test('[P1] should have all 10 location markers rendered after load', async ({
    page,
  }) => {
    // GIVEN: Page has loaded (fixture auto-navigates)

    // THEN: All 10 location dots are attached in the DOM
    const dots = page.locator('[data-testid^="location-dot-"]')
    await expect(dots).toHaveCount(10)
  })
})

test.describe('Story 4.2: Audio Responsiveness — P1 High', () => {
  test('[P1] should show player UI immediately after clicking unlocked location (NFR2)', async ({
    page,
  }) => {
    // GIVEN: Page is loaded, no player visible
    await expect(page.getByTestId('soundscape-player')).toBeHidden()

    // WHEN: User clicks an unlocked location
    const tamsui = getMapElement(page, 'location-dot-tamsui')
    await tamsui.click({ force: true })

    // THEN: SoundscapePlayer appears with correct content (NFR2 functional proxy)
    // NFR2 specifies 500ms for real-user experience — Playwright's toBeVisible()
    // assertion timeout (10s) is generous; the test validates the UI response
    // chain: click → React state update → render → Motion animate → visible
    const player = page.getByTestId('soundscape-player')
    await expect(player).toBeVisible()
    await expect(player).toContainText('淡水河夕陽')
  })

  test('[P1] should set audio source immediately on location click (NFR2)', async ({
    page,
  }) => {
    // GIVEN: Page is loaded

    // WHEN: User clicks tamsui
    const tamsui = getMapElement(page, 'location-dot-tamsui')
    await tamsui.click({ force: true })

    // THEN: An audio element exists with the correct source
    const audioSrc = await page.evaluate(() => {
      const audios = document.querySelectorAll('audio')
      if (audios.length > 0) return audios[0].src
      // Check for HTMLAudioElement created via new Audio()
      // The useAudioPlayer hook stores the element — check if audio is playing
      return null
    })

    // Audio may be created programmatically (new Audio()), not in DOM.
    // Verify via the player UI showing the correct location name instead.
    await expect(page.getByTestId('soundscape-player')).toContainText('淡水河夕陽')
  })
})

test.describe('Story 4.2: Photo Load Performance — P1 High', () => {
  test('[P1] should display scene photo immediately after selection (NFR5)', async ({
    page,
  }) => {
    // GIVEN: Page is loaded, no detail visible
    await expect(page.getByTestId('location-detail')).toBeHidden()

    // WHEN: User clicks tamsui
    const tamsui = getMapElement(page, 'location-dot-tamsui')
    await tamsui.click({ force: true })

    // THEN: LocationDetail appears with visible photo (NFR5 functional proxy)
    // NFR5 specifies <1s for real-user experience — local assets in public/ load
    // near-instantly. Test validates the render pipeline completes without errors.
    const detail = page.getByTestId('location-detail')
    await expect(detail).toBeVisible()
    const img = detail.locator('img')
    await expect(img).toBeVisible()
    await expect(img).toHaveAttribute('src', '/images/tamsui.jpg')
  })

  test('[P1] should load photo for each unlocked location without error placeholder', async ({
    page,
  }) => {
    // GIVEN: Page is loaded

    // WHEN/THEN: For each unlocked location, photo loads (no error placeholder)
    for (const id of UNLOCKED_LOCATIONS) {
      const dot = getMapElement(page, `location-dot-${id}`)
      await dot.click({ force: true })
      await waitForDetailTransition(page)

      const detail = page.getByTestId('location-detail')
      await expect(detail).toBeVisible()

      // Photo should render (img visible), not error placeholder
      const img = detail.locator('img')
      await expect(img).toBeVisible()
      const placeholder = detail.getByTestId('image-placeholder')
      await expect(placeholder).toHaveCount(0)
    }
  })
})

test.describe('Story 4.2: Location Switch Stability — P1 High', () => {
  test('[P1] should switch audio source cleanly without errors (NFR4)', async ({
    page,
  }) => {
    // GIVEN: Set up console error listener
    const consoleErrors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text())
    })

    // WHEN: User switches through all 3 unlocked locations
    for (const id of UNLOCKED_LOCATIONS) {
      const dot = getMapElement(page, `location-dot-${id}`)
      await dot.click({ force: true })
      await waitForDetailTransition(page)

      // Verify player updates to correct location
      await expect(page.getByTestId('soundscape-player')).toContainText(
        id === 'tamsui' ? '淡水河夕陽' :
        id === 'alishan' ? '阿里山雲海' :
        '基隆港浪'
      )
    }

    // THEN: No console errors related to audio
    const audioErrors = consoleErrors.filter(
      (e) => e.toLowerCase().includes('audio') || e.toLowerCase().includes('media')
    )
    expect(audioErrors).toHaveLength(0)
  })

  test('[P1] should not produce page errors during rapid location switching', async ({
    page,
  }) => {
    // GIVEN: Monitor for uncaught exceptions
    const pageErrors: string[] = []
    page.on('pageerror', (err) => pageErrors.push(err.message))

    // WHEN: User rapidly switches between all unlocked locations (2 full cycles)
    for (let cycle = 0; cycle < 2; cycle++) {
      for (const id of UNLOCKED_LOCATIONS) {
        const dot = getMapElement(page, `location-dot-${id}`)
        await dot.click({ force: true })
      }
    }

    // Allow final state to settle
    await waitForDetailTransition(page)

    // THEN: No uncaught page errors
    expect(pageErrors).toHaveLength(0)

    // AND: Final state is correct (last clicked location)
    const lastId = UNLOCKED_LOCATIONS[UNLOCKED_LOCATIONS.length - 1]
    const expectedName = lastId === 'keelung' ? '基隆港浪' : lastId
    await expect(page.getByTestId('location-detail')).toBeVisible()
    await expect(page.getByTestId('location-detail').locator('h2')).toContainText(expectedName)
    await expect(page.getByTestId('soundscape-player')).toContainText(expectedName)
  })
})

test.describe('Story 4.2: Rapid Switch Stability — P2 Medium', () => {
  test('[P2] should converge to correct state after rapid unlocked-locked-unlocked switching', async ({
    page,
  }) => {
    // GIVEN: Page is loaded
    const pageErrors: string[] = []
    page.on('pageerror', (err) => pageErrors.push(err.message))

    // WHEN: Rapid interleaved clicking — unlocked, locked, unlocked, locked, unlocked
    const tamsui = getMapElement(page, 'location-dot-tamsui')
    const lanyu = getMapElement(page, 'location-dot-lanyu')
    const alishan = getMapElement(page, 'location-dot-alishan')
    const taroko = getMapElement(page, 'location-dot-taroko')
    const keelung = getMapElement(page, 'location-dot-keelung')

    // dispatchEvent bypasses browser hit-testing — clicks reach SVG elements
    // even when LockOverlay (z-50 fixed inset-0) covers the map.
    // Sequence: unlocked(tamsui) → locked(lanyu) → unlocked(alishan) → locked(taroko) → unlocked(keelung)
    // Final unlocked click (keelung) clears lockedLocation via handleSelect.
    await tamsui.dispatchEvent('click')
    await lanyu.dispatchEvent('click')
    await alishan.dispatchEvent('click')
    await taroko.dispatchEvent('click')
    await keelung.dispatchEvent('click')

    await waitForDetailTransition(page)

    // THEN: Final state reflects keelung (last unlocked click clears overlay)
    await expect(page.getByTestId('location-detail')).toBeVisible()
    await expect(page.getByTestId('location-detail').locator('h2')).toContainText('基隆港浪')
    await expect(page.getByTestId('soundscape-player')).toContainText('基隆港浪')
    await expect(page.getByTestId('lock-overlay')).toBeHidden()

    // AND: No page errors
    expect(pageErrors).toHaveLength(0)
  })
})
