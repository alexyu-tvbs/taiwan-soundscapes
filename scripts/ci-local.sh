#!/bin/bash
# Mirror CI pipeline execution locally for debugging
# Usage: ./scripts/ci-local.sh
set -e

echo "=========================================="
echo "Local CI Pipeline — taiwan-soundscapes"
echo "=========================================="
echo ""

# Stage 1: Lint
echo "[1/4] Running ESLint..."
npm run lint || { echo "LINT FAILED"; exit 1; }
echo "Lint passed"
echo ""

# Stage 2: Build
echo "[2/4] Running build (tsc + vite)..."
npm run build || { echo "BUILD FAILED"; exit 1; }
echo "Build passed"
echo ""

# Stage 3: E2E Tests
echo "[3/4] Running E2E tests..."
npm run test:e2e || { echo "E2E TESTS FAILED"; exit 1; }
echo "E2E tests passed"
echo ""

# Stage 4: Burn-in (reduced: 3 iterations)
echo "[4/4] Running burn-in (3 iterations)..."
for i in {1..3}; do
  echo "Burn-in iteration $i/3"
  npm run test:e2e || { echo "BURN-IN FAILED on iteration $i"; exit 1; }
done
echo "Burn-in passed: 3/3 iterations"
echo ""

echo "=========================================="
echo "Local CI pipeline passed"
echo "=========================================="
