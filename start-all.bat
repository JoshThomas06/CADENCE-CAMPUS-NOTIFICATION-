@echo off
TITLE Cadence Campus Pulse - System Launcher
echo ================================================================
echo   CADENCE CAMPUS PULSE - REAL-TIME ALERT PLATFORM
echo ================================================================
echo.
echo Checking Node.js environment...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not found in your PATH!
    echo Please install Node.js 18+ from https://nodejs.org
    pause
    exit /b 1
)

echo.
echo [1/3] Verifying backend dependencies...
if not exist node_modules (
    echo Installing backend dependencies...
    call npm install
)

echo.
echo [2/3] Verifying frontend dependencies...
if not exist frontend\node_modules (
    echo Installing frontend dependencies...
    cd frontend
    call npm install
    cd ..
)

echo.
echo [3/3] Starting full-stack system orchestrator...
echo Gateway: http://localhost:4000
echo Frontend: http://localhost:3000
echo.
call npm run dev:all
pause
