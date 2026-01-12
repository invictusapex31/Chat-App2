@echo off
title Chat App Launcher
color 0A
cls

echo ========================================
echo    REAL-TIME CHAT APP LAUNCHER
echo ========================================
echo.
echo Starting your chat application...
echo.

REM Kill any existing node processes on ports 3000 and 5000
echo [1/4] Cleaning up ports...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do taskkill /F /PID %%a >nul 2>&1
timeout /t 2 /nobreak >nul

REM Start Backend Server
echo [2/4] Starting Backend Server...
start "Chat Backend - Port 5000" cmd /k "cd /d %~dp0 && echo Starting Backend Server... && node server/index-simple.js"
timeout /t 3 /nobreak >nul

REM Start Frontend
echo [3/4] Starting Frontend...
start "Chat Frontend - Port 3000" cmd /k "cd /d %~dp0client && echo Starting Frontend... && npm start"
timeout /t 2 /nobreak >nul

REM Wait for servers to start
echo [4/4] Waiting for servers to initialize...
timeout /t 8 /nobreak >nul

cls
echo ========================================
echo    CHAT APP IS RUNNING!
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Two windows have opened:
echo   1. Backend Server (Port 5000)
echo   2. Frontend App (Port 3000)
echo.
echo Your browser will open automatically...
echo.
echo To stop: Close both server windows
echo ========================================
echo.

REM Open browser
start http://localhost:3000

echo Press any key to close this launcher...
pause >nul
