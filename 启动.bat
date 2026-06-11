@echo off
title Filament Management System
color 0A

cd /d "%~dp0"

echo [1/3] Checking Node.js environment...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please download from: https://nodejs.org/
    pause
    exit /b 1
)
echo OK - Node.js is installed

echo.
echo [2/3] Checking dependencies...
if not exist "node_modules" (
    echo Installing dependencies, please wait...
    call npm install
)
echo OK - Dependencies are ready

echo.
echo [3/3] Starting server...
echo.
echo ========================================
echo SERVER STARTED SUCCESSFULLY!
echo Please visit: http://localhost:3001
echo ========================================
echo.
echo Press Ctrl+C to stop the server 
echo.

node app.js