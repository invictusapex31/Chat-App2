@echo off
echo Starting Chat App...
echo.
echo Opening Backend Server...
start "Chat Backend" cmd /k "cd /d %~dp0 && node server/index.js"
timeout /t 2 /nobreak >nul
echo Opening Frontend...
start "Chat Frontend" cmd /k "cd /d %~dp0client && npm start"
echo.
echo Both servers are starting in separate windows!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
pause
