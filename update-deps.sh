#!/bin/bash
# Script to update all dependencies safely

set -euo pipefail

echo "🔄 Updating project dependencies..."

# Update Astro itself (using official upgrader)
echo "📦 Running Astro upgrader..."
pnpm dlx @astrojs/upgrade || {
  echo "❌ Astro upgrade failed. Please check logs."
  exit 1
}

# Update all other dependencies to latest (respecting package.json ranges)
echo "📦 Updating other dependencies..."
pnpm up --latest || {
  echo "❌ Failed to update dependencies. Please check logs."
  exit 1
}

echo "✅ All dependencies updated!"
echo
echo "🔍 Next steps:"
echo "   1. Run: pnpm install"
echo "   2. Run your test suite / dev server to verify everything works."
echo "   3. Commit updated package.json + lockfile after validation."
