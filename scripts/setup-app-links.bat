@echo off
echo === Quick App Links Setup ===
echo.

echo 🏗️ Building Android app with App Links support...
cd /d "d:\usersMangment"
call npm run android

echo.
echo 📋 Next Steps:
echo.
echo 1. Upload this file to your domain:
echo    📁 .well-known/assetlinks.json
echo    🌐 → https://usersmanagement.app/.well-known/assetlinks.json
echo.
echo 2. Test the setup:
echo    📱 ./scripts/test-app-links.bat
echo.
echo 3. Manual test commands:
echo    ✅ Custom scheme: adb shell am start -W -a android.intent.action.VIEW -d "usersmgmt://user/14" com.yourcompany.usersmanagement
echo    🌐 HTTPS URL: adb shell am start -W -a android.intent.action.VIEW -d "https://usersmanagement.app/user/14"
echo.
pause
