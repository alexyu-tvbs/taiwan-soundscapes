#!/bin/bash
# Burn-in runner — detect flaky tests by running N iterations
# Usage: ./scripts/burn-in.sh [iterations]
# Default: 10 iterations
set -e

ITERATIONS=${1:-10}

echo "=========================================="
echo "Burn-In Test Runner"
echo "=========================================="
echo "Iterations: $ITERATIONS"
echo ""

for i in $(seq 1 "$ITERATIONS"); do
  echo "=========================================="
  echo "Burn-in iteration $i/$ITERATIONS"
  echo "=========================================="
  npm run test:e2e || {
    echo ""
    echo "BURN-IN FAILED on iteration $i/$ITERATIONS"
    echo "Failure artifacts in: test-results/"
    exit 1
  }
  echo ""
done

echo "=========================================="
echo "BURN-IN PASSED"
echo "=========================================="
echo "All $ITERATIONS iterations passed."
echo "Tests are stable and ready to merge."
