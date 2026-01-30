#!/bin/bash
# Run only tests affected by changed files
# Usage: ./scripts/test-changed.sh [base-branch]
# Default base branch: main
set -e

BASE_BRANCH=${1:-main}

echo "=========================================="
echo "Selective Test Runner"
echo "=========================================="
echo "Base branch: $BASE_BRANCH"
echo ""

# Detect changed test files
CHANGED_SPECS=$(git diff --name-only "$BASE_BRANCH"...HEAD -- 'tests/' | grep -E '\.(spec|test)\.(ts|js)$' || echo "")

if [ -z "$CHANGED_SPECS" ]; then
  echo "No test files changed. Skipping."
  exit 0
fi

SPEC_COUNT=$(echo "$CHANGED_SPECS" | wc -l | xargs)
echo "Changed test files ($SPEC_COUNT):"
echo "$CHANGED_SPECS" | sed 's/^/  - /'
echo ""

echo "Running changed specs..."
npx playwright test $CHANGED_SPECS
