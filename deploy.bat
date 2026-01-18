@echo off
echo Starting RTRWH Deployment Process...

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
cd ..

echo.
echo === Choose Deployment Option ===
echo 1. Deploy to Vercel
echo 2. Deploy to Railway  
echo 3. Build Docker Image
echo 4. Deploy to Render
echo 5. Exit

set /p choice="Enter your choice (1-5): "

if "%choice%"=="1" goto vercel
if "%choice%"=="2" goto railway
if "%choice%"=="3" goto docker
if "%choice%"=="4" goto render
if "%choice%"=="5" goto end

:vercel
echo.
echo === Deploying to Vercel ===
echo Make sure you have Vercel CLI installed: npm i -g vercel
echo Run: vercel --prod
pause
goto end

:railway
echo.
echo === Deploying to Railway ===
echo Make sure you have Railway CLI installed: npm i -g @railway/cli
echo Run: railway login && railway up
pause
goto end

:docker
echo.
echo === Building Docker Image ===
docker build -t rtrwh-app .
if %errorlevel% neq 0 (
    echo Docker build failed!
    pause
    exit /b 1
)
echo Docker image built successfully!
echo Run: docker run -p 8000:8000 rtrwh-app
pause
goto end

:render
echo.
echo === Deploy to Render ===
echo 1. Go to https://render.com
echo 2. Connect your GitHub repository
echo 3. Create a new Web Service
echo 4. Use the following settings:
echo    - Build Command: cd frontend && npm run build
echo    - Start Command: python backend/run.py
echo    - Environment: Python 3
pause
goto end

:end
echo.
echo Deployment process completed!
pause