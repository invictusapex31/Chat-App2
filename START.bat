@echo off
title Chat App
color 0A
cls

echo ========================================
echo    STARTING CHAT APP
echo ========================================
echo.

REM Kill any existing processes
echo Cleaning up...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000 ^| findstr LISTENING') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING') do taskkill /F /PID %%a >nul 2>&1
timeout /t 2 /nobreak >nul

echo.
echo [1/2] Starting Backend Server...
start "Chat Backend" cmd /k "cd /d %~dp0 && node server/server.js"
timeout /t 4 /nobreak >nul

echo [2/2] Starting Frontend...
start "Chat Frontend" cmd /k "cd /d %~dp0client && npm start"

echo.
echo ========================================
echo    SERVERS STARTING...
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Wait 15 seconds for frontend to compile...
echo Browser will open automatically.
echo.
echo ========================================

timeout /t 15 /nobreak >nul
start http://localhost:3000

echo.
echo Press any key to exit this window...
pause >nul
