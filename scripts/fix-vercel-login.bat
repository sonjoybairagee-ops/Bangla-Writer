@echo off
REM Fix Vercel Login Issue - Quick Script for Windows
REM Run: scripts\fix-vercel-login.bat

echo 🚀 Fixing Vercel Login Issue...
echo.

REM Check if vercel CLI is installed
where vercel >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Vercel CLI not found. Installing...
    npm install -g vercel
)

echo 📝 Setting environment variables on Vercel...
echo.
echo ⚠️ You'll need to enter these values manually:
echo.
echo 1. NEXTAUTH_URL = https://bangla-creator.vercel.app
echo 2. NEXTAUTH_SECRET = Kxj9mP3nQ8rW5tYv2bN4cM7zL0sA6hD1fG8eR3jT5iU9oP2wX4qV6kB7yC0mL8nH
echo.
echo Press any key to continue...
pause >nul

vercel env add NEXTAUTH_URL production
vercel env add NEXTAUTH_SECRET production

echo.
echo ✅ Environment variables set!
echo.
echo 🔄 Redeploying to Vercel...
vercel --prod

echo.
echo ✨ Done! Wait 1-2 minutes for deployment to complete.
echo 🌐 Then try logging in at: https://bangla-creator.vercel.app/login
echo.
pause
