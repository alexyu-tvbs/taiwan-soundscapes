# Taiwan Soundscapes — Test Suite

End-to-end test suite for the Taiwan Soundscapes static SPA, powered by **Playwright**.

## Setup

### Prerequisites

- Node.js 20.19+ (see `.nvmrc`)
- npm

### Install Dependencies

```bash
npm install
npx playwright install --with-deps
```

### Environment Configuration

```bash
cp .env.example .env
# Edit .env if needed (defaults work for local development)
```

## Running Tests

| Command | Description |
|---------|-------------|
| `npm run test:e2e` | Run all tests (headless) |
| `npm run test:e2e:ui` | Open Playwright UI mode (interactive) |
| `npm run test:e2e:headed` | Run tests in headed browser |
| `npm run test:e2e:chromium` | Run Chromium tests only |
| `npm run test:e2e:webkit` | Run WebKit/Safari tests only |

### Debug Mode

```bash
npx playwright test --debug
```

### View Test Report

```bash
npx playwright show-report
```

## Architecture Overview

```
tests/
├── e2e/                      # E2E test specs
│   └── homepage.spec.ts      # Homepage tests
├── support/                  # Test infrastructure
│   ├── fixtures/
│   │   └── index.ts          # Extended Playwright fixtures
│   └── helpers/
│       └── test-utils.ts     # Shared utility functions
└── README.md                 # This file
```

### Fixture Pattern

Tests use Playwright's fixture system (`test.extend`). Import from `tests/support/fixtures`:

```typescript
import { test, expect } from '../support/fixtures'

test('example', async ({ page, appPage }) => {
  // appPage fixture auto-navigates to homepage and waits for load
  await expect(page.locator('#root')).toBeVisible()
})
```

### Selector Strategy

Use `data-testid` attributes for reliable element selection:

```tsx
// Component
<button data-testid="play-audio">Play</button>

// Test
await page.getByTestId('play-audio').click()
```

## Best Practices

- **No hard waits** — Use `waitForLoadState`, element visibility checks, or network events
- **No conditional flow** — Tests execute the same deterministic path every time
- **Explicit assertions** — Keep `expect()` calls in test bodies, not hidden in helpers
- **Under 300 lines** — Split large tests into focused scenarios
- **Under 1.5 minutes** — Optimize with direct navigation and minimal setup

## Browser Coverage

| Browser | Role | Project Name |
|---------|------|-------------|
| Chrome | Primary | `chromium` |
| Safari | Secondary | `webkit` |

## CI Integration

Tests are configured for CI execution with:

- Retries: 2 (CI only)
- Workers: 1 (CI), auto (local)
- Artifacts: screenshots, video, and traces retained on failure
- Reports: HTML + JUnit XML at `test-results/results.xml`

### Artifact Locations

| Artifact | Path |
|----------|------|
| HTML Report | `playwright-report/` |
| JUnit XML | `test-results/results.xml` |
| Screenshots | `test-results/` |
| Videos | `test-results/` |
| Traces | `test-results/` |

## Knowledge Base References

- Fixture architecture: pure function → fixture → `mergeTests` composition
- Playwright config guardrails: standardized timeouts, environment-based config
- Test quality: deterministic, isolated, explicit, focused, fast
