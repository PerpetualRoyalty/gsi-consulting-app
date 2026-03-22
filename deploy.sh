#!/bin/bash
# GSI Consulting App — Deploy to GitHub & Vercel
# Auto-detects directory — just double-click or run: bash deploy.sh

set -e

# Navigate to this script's directory (where the project lives)
cd "$(dirname "$0")"

echo ""
echo "🚀 Deploying GSI Consulting App to GitHub..."
echo "   Directory: $(pwd)"
echo ""

# Initialize git repo (safe to re-run)
if [ ! -d ".git" ]; then
  git init
  git branch -M main
fi

# Add all files (respects .gitignore)
git add -A

# Commit
git commit -m "Initial commit: GSI Consulting Platform

Full-stack Next.js 14 consulting platform for Good Samaritan Institute.
Includes admin dashboard, client portal, Stripe payments, agreements,
onboarding automation, health scoring, and branded reports.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"

# Set remote (remove first if it exists)
git remote remove origin 2>/dev/null || true
git remote add origin https://github.com/PerpetualRoyalty/gsi-consulting-app.git

# Push to GitHub
git push -u origin main

echo ""
echo "✅ Successfully pushed to GitHub!"
echo "📦 Repo: https://github.com/PerpetualRoyalty/gsi-consulting-app"
echo ""
echo "Next steps to deploy to Vercel:"
echo "  1. Go to https://vercel.com/new"
echo "  2. Import the 'gsi-consulting-app' repo"
echo "  3. Add environment variables from .env.example"
echo "  4. Deploy!"
echo ""
