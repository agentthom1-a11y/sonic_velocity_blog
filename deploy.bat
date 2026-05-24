@echo off
REM SonicVelo Blog - Quick Deployment Script for Hostinger
REM This script builds and packages the app for deployment

echo ========================================
echo SonicVelo Blog - Hostinger Deployment
echo ========================================
echo.

REM Step 1: Build production
echo [1/3] Building production bundle...
call npm run build
if errorlevel 1 (
    echo ERROR: Build failed!
    pause
    exit /b 1
)
echo ✓ Build completed successfully
echo.

REM Step 2: Create deployment package
echo [2/3] Creating deployment package...
if exist sonicvelo-deploy.zip del sonicvelo-deploy.zip

powershell -Command "Compress-Archive -Path .next,app,lib,public,data,package.json,server.js,.env.local -DestinationPath sonicvelo-deploy.zip -Force"

if errorlevel 1 (
    echo ERROR: Failed to create deployment package!
    pause
    exit /b 1
)
echo ✓ Deployment package created: sonicvelo-deploy.zip
echo.

REM Step 3: Show deployment instructions
echo [3/3] Deployment package ready!
echo.
echo ========================================
echo Next Steps:
echo ========================================
echo 1. Upload sonicvelo-deploy.zip to Hostinger
echo 2. Extract the zip file in your app directory
echo 3. Run: npm install --production
echo 4. Run: npm start
echo.
echo For detailed instructions, see: DEPLOYMENT_GUIDE.md
echo.
pause
