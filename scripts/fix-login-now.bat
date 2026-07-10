@echo off
REM ===================================================
REM EMERGENCY LOGIN FIX - Automated Script
REM ===================================================
REM This script will:
REM 1. Check if Vercel CLI is installed
REM 2. Login to Vercel
REM 3. Set correct environment variables
REM 4. Redeploy with fresh build
REM ===================================================

echo.
echo ========================================
echo   EMERGENCY LOGIN FIX
echo ========================================
echo.
echo This will fix your login issue by:
echo 1. Setting correct NEXTAUTH_URL
echo 2. Setting NEXTAUTH_SECRET
echo 3. Redeploying to Vercel
echo.
echo Press CTRL+C to cancel, or
pause

REM Check if Node.js is installed
echo.
echo [1/6] Checking Node.js...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js not found!
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)
echo     Node.js found!

REM Check if Vercel CLI is installed
echo.
echo [2/6] Checking Vercel CLI...
where vercel >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo     Vercel CLI not found. Installing...
    npm install -g vercel
    if %ERRORLEVEL% NEQ 0 (
        echo ERROR: Failed to install Vercel CLI
        pause
        exit /b 1
    )
)
echo     Vercel CLI ready!

REM Login to Vercel
echo.
echo [3/6] Logging in to Vercel...
echo     A browser window will open. Please login.
vercel login
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Vercel login failed
    pause
    exit /b 1
)
echo     Logged in successfully!

REM Link project (if not already linked)
echo.
echo [4/6] Linking project...
vercel link --yes
if %ERRORLEVEL% NEQ 0 (
    echo WARNING: Project link failed, but continuing...
)

REM Set NEXTAUTH_URL
echo.
echo [5/6] Setting environment variables...
echo     Setting NEXTAUTH_URL...
echo https://bangla-creator.vercel.app | vercel env add NEXTAUTH_URL production --force
if %ERRORLEVEL% NEQ 0 (
    echo WARNING: NEXTAUTH_URL may already exist
)

echo     Setting NEXTAUTH_SECRET...
echo Kxj9mP3nQ8rW5tYv2bN4cM7zL0sA6hD1fG8eR3jT5iU9oP2wX4qV6kB7yC0mL8nH | vercel env add NEXTAUTH_SECRET production --force
if %ERRORLEVEL% NEQ 0 (
    echo WARNING: NEXTAUTH_SECRET may already exist
)

echo     Environment variables set!

REM Redeploy
echo.
echo [6/6] Redeploying to Vercel...
echo     This may take 2-3 minutes...
echo.
vercel --prod --yes
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Deployment failed!
    echo.
    echo Please check:
    echo 1. Your internet connection
    echo 2. Vercel dashboard for errors
    echo 3. https://vercel.com/your-username/bangla-creator
    pause
    exit /b 1
)

echo.
echo ========================================
echo   SUCCESS!
echo ========================================
echo.
echo Your app has been deployed with correct settings.
echo.
echo IMPORTANT: Wait 1-2 minutes for deployment to complete.
echo.
echo Then:
echo 1. Open: https://bangla-creator.vercel.app/login
echo 2. Press CTRL+SHIFT+R to hard refresh
echo 3. Or try in Incognito mode (CTRL+SHIFT+N)
echo 4. Login with your credentials
echo.
echo If still not working:
echo - Clear browser cache completely
echo - Wait 2-3 more minutes
echo - Check Vercel dashboard: https://vercel.com
echo.
pause
