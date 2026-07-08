#!/bin/bash

# Install AI Provider Dependencies
# Run this to add support for additional AI providers

echo "📦 Installing AI Provider Dependencies..."
echo ""

# Google Gemini
echo "1️⃣  Installing Google Gemini SDK..."
npm install @google/generative-ai

# Anthropic Claude
echo "2️⃣  Installing Anthropic Claude SDK..."
npm install @anthropic-ai/sdk

# Note: OpenAI already installed
# Note: Grok uses OpenAI-compatible API (no extra package needed)

echo ""
echo "✅ All AI provider dependencies installed!"
echo ""
echo "📝 Next steps:"
echo "1. Add API keys to .env file"
echo "2. Restart dev server: npm run dev"
echo "3. Check provider status: http://localhost:3000/api/ai/providers"
echo ""
echo "See PROVIDERS.md for detailed setup instructions."
