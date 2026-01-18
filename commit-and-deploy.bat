@echo off
echo === RTRWH Commit Script ===

echo.
echo Checking Git status...
git status

echo.
echo === Adding all changes ===
git add .

echo.
echo === Files to be committed: ===
echo - vercel.json (Vercel deployment config)
echo - Dockerfile (Docker containerization)
echo - railway.json (Railway deployment config)
echo - .github/workflows/deploy.yml (GitHub Actions CI/CD)
echo - deploy.md (Deployment guide)
echo - deploy.bat (Deployment script)
echo - .env.example (Environment variables template)
echo - Updated backend/main.py (Production static file serving)

echo.
echo === Committing changes ===
set /p commit_msg="Enter commit message (or press Enter for default): "
if "%commit_msg%"=="" set commit_msg="Add comprehensive deployment configurations for Railway, Vercel, Docker, and GitHub Actions"

git commit -m "%commit_msg%"

echo.
echo === Pushing to remote repository ===
git push origin main

if %errorlevel% neq 0 (
    echo Trying to push to master branch...
    git push origin master
)

echo.
echo === Commit completed successfully! ===
echo Your RTRWH app is now ready for Railway deployment.
echo.
echo Next steps:
echo 1. Go to https://railway.app
echo 2. Connect your GitHub repository
echo 3. Deploy with one click!
echo.
pause