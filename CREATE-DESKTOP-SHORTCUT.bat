@echo off
echo Creating desktop shortcut for Chat App...

set SCRIPT="%TEMP%\CreateShortcut.vbs"
set DESKTOP=%USERPROFILE%\Desktop
set TARGET=%~dp0START-CHAT-APP.bat
set SHORTCUT=%DESKTOP%\Chat App.lnk

echo Set oWS = WScript.CreateObject("WScript.Shell") > %SCRIPT%
echo sLinkFile = "%SHORTCUT%" >> %SCRIPT%
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> %SCRIPT%
echo oLink.TargetPath = "%TARGET%" >> %SCRIPT%
echo oLink.WorkingDirectory = "%~dp0" >> %SCRIPT%
echo oLink.Description = "Real-Time Chat Application" >> %SCRIPT%
echo oLink.Save >> %SCRIPT%

cscript /nologo %SCRIPT%
del %SCRIPT%

echo.
echo ✅ Desktop shortcut created successfully!
echo.
echo You can now double-click "Chat App" on your desktop to start the app.
echo.
pause
