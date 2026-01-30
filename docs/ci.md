# CI/CD Pipeline Guide

## Overview

GitHub Actions test pipeline with 4 stages: lint, build, E2E tests (parallel), and burn-in flaky detection.

**Pipeline file**: `.github/workflows/test.yml`

## Triggers

| Event | Stages Run |
|-------|-----------|
| Push to `main` | lint, build, test-e2e |
| Pull request | lint, build, test-e2e, burn-in |

## Pipeline Stages

### 1. Lint (< 2 min)
Runs `npm run lint` (ESLint). Blocks test execution on failure.

### 2. Build (< 5 min)
Runs `npm run build` (TypeScript + Vite). Verifies no compile errors.

### 3. E2E Tests (< 10 min per shard)
- **4 parallel shards** via matrix strategy
- Command: `npm run test:e2e -- --shard=N/4`
- `fail-fast: false` — all shards complete for full evidence
- Uploads `test-results/` and `playwright-report/` on failure (30-day retention)

### 4. Burn-In (< 30 min, PR only)
- Runs full E2E suite **10 times** to detect flaky tests
- Any single failure = flaky test detected, job fails
- Uploads failure artifacts for debugging

## Caching

| Cache | Key | Saves |
|-------|-----|-------|
| npm | `setup-node` built-in (`package-lock.json` hash) | ~2 min |
| Playwright browsers | `playwright-{os}-{lockfile-hash}` | ~3 min |

On cache hit, only system dependencies are installed (not browser binaries).

## Running Locally

Mirror the CI pipeline on your machine:

```bash
# Full CI pipeline (lint + build + test + 3x burn-in)
./scripts/ci-local.sh

# Standalone burn-in (default 10 iterations)
./scripts/burn-in.sh
./scripts/burn-in.sh 20  # custom iteration count

# Run only tests for changed files
./scripts/test-changed.sh
./scripts/test-changed.sh develop  # custom base branch
```

## Debugging Failed CI Runs

1. **Download artifacts**: Go to Actions tab → failed run → Artifacts section
2. **View Playwright report**: Unzip `playwright-report/`, open `index.html`
3. **View traces**: `npx playwright show-trace path/to/trace.zip`
4. **Check screenshots/videos**: In `test-results/` artifact

## Adjusting Parallelism

To change shard count, edit `.github/workflows/test.yml`:

```yaml
matrix:
  shard: [1, 2, 3, 4]  # change to [1, 2] for 2 shards
```

Update the test command to match: `--shard=${{ matrix.shard }}/NEW_TOTAL`

## Performance Targets

| Stage | Target |
|-------|--------|
| Lint | < 2 min |
| Build | < 5 min |
| E2E (per shard) | < 10 min |
| Burn-in | < 30 min |
| Total pipeline | < 45 min |
