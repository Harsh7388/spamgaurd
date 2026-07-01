@echo off
REM SpamGuard Deployment Script for Render
REM This script automates the deployment process

echo ============================================
echo SpamGuard Backend Deployment to Render
echo ============================================
echo.

REM Check if git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Git is not installed. Please install Git from https://git-scm.com/
    pause
    exit /b 1
)

echo [1/3] Checking git status...
git status
echo.

echo [2/3] Current remote configuration:
git remote -v
echo.

echo NEXT STEPS:
echo ===========
echo.
echo 1. PUSH CODE TO GITHUB
echo    - Create a new repository on GitHub
echo    - Run these commands:
echo       git remote add origin https://github.com/YOUR_USERNAME/spamguard.git
echo       git branch -M main
echo       git push -u origin main
echo.
echo 2. DEPLOY TO RENDER
echo    a) Go to https://render.com
echo    b) Sign in with GitHub
echo    c) Click "New +" then "Web Service"
echo    d) Select your "spamguard" repository
echo    e) Configure with these settings:
echo       - Name: spamguard-backend
echo       - Environment: Python
echo       - Build Command: pip install -r backend/requirements.txt
echo       - Start Command: cd backend ^&^& gunicorn -w 4 -b 0.0.0.0:$PORT app:app
echo.
echo 3. Once deployed, note your backend URL (e.g., https://spamguard-backend-xxxx.onrender.com)
echo.
echo 4. UPDATE FRONTEND (if URL changes)
echo    Edit: frontend/src/services/api.js
echo    Update: const API_BASE_URL = "YOUR_RENDER_URL"
echo.

pause
