@echo off
echo === RTRWH Frontend Deployment ===

echo.
echo === Building Frontend ===
cd frontend
call npm run build
if %errorlevel% neq 0 (
    echo Frontend build failed!
    pause
    exit /b 1
)

echo.
echo === Frontend built successfully ===
echo Build files are in frontend/build directory

echo.
echo === Choose Frontend Deployment Option ===
echo 1. Deploy to Vercel (Recommended)
echo 2. Deploy to Netlify
echo 3. Manual deployment (just build)
echo 4. Exit

set /p choice="Enter your choice (1-4): "

if "%choice%"=="1" goto vercel
if "%choice%"=="2" goto netlify
if "%choice%"=="3" goto manual
if "%choice%"=="4" goto end

:vercel
echo.
echo === Deploying to Vercel ===
echo Make sure you have Vercel CLI installed: npm i -g vercel
echo.
echo Run these commands:
echo   cd frontend
echo   vercel --prod
echo.
pause
goto end

:netlify
echo.
echo === Deploying to Netlify ===
echo Option 1 - Netlify CLI:
echo   npm i -g netlify-cli
echo   cd frontend
echo   netlify deploy --prod --dir=build
echo.
echo Option 2 - Drag and Drop:
echo   Go to https://netlify.com
echo   Drag the 'frontend/build' folder to deploy
echo.
pause
goto end

:manual
echo.
echo === Manual Deployment ===
echo Your frontend is built in: frontend/build
echo You can upload this folder to any static hosting service:
echo - GitHub Pages
echo - Firebase Hosting  
echo - AWS S3
echo - Any web server
echo.
pause
goto end

:end
echo.
echo Frontend deployment process completed!
cd ..
pause