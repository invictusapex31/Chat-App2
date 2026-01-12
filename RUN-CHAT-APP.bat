@echo off
cls
echo ========================================
echo    STARTING CHAT APP
echo ========================================
echo.

REM Kill existing processes
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do taskkill /F /PID %%a >nul 2>&1
timeout /t 1 /nobreak >nul

echo Starting Backend...
start "Backend" cmd /k "cd /d %~dp0 && node server/index.js"
timeout /t 3 /nobreak >nul

echo Starting Frontend...
start "Frontend" cmd /k "cd /d %~dp0client && npm start"
timeout /t 5 /nobreak >nul

echo.
echo ========================================
echo    CHAT APP STARTED!
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Opening browser...
timeout /t 3 /nobreak >nul
start http://localhost:3000

echo.
echo Press any key to exit...
pause >nul
