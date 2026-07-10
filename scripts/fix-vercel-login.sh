#!/bin/bash

# Fix Vercel Login Issue - Quick Script
# Run: bash scripts/fix-vercel-login.sh

echo "🚀 Fixing Vercel Login Issue..."
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

echo "📝 Setting NEXTAUTH_URL..."
echo "https://bangla-creator.vercel.app" | vercel env add NEXTAUTH_URL production

echo "📝 Setting NEXTAUTH_SECRET..."
echo "Kxj9mP3nQ8rW5tYv2bN4cM7zL0sA6hD1fG8eR3jT5iU9oP2wX4qV6kB7yC0mL8nH" | vercel env add NEXTAUTH_SECRET production

echo ""
echo "✅ Environment variables set!"
echo ""
echo "🔄 Redeploying to Vercel..."
vercel --prod

echo ""
echo "✨ Done! Wait 1-2 minutes for deployment to complete."
echo "🌐 Then try logging in at: https://bangla-creator.vercel.app/login"
