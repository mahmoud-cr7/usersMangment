@echo off
echo Testing Vercel domain app links...
echo.

echo 1. Testing assetlinks.json accessibility:
curl -s "https://usersmanagement-linkss-3p58oor4w-mahmouds-projects-414b5cea.vercel.app/.well-known/assetlinks.json"
echo.
echo.

echo 2. Testing app link with ADB:
adb shell am start -W -a android.intent.action.VIEW -d "https://usersmanagement-linkss-3p58oor4w-mahmouds-projects-414b5cea.vercel.app/user/14" com.yourcompany.usersmanagement
echo.

echo 3. Checking app link verification status:
adb shell dumpsys package domain-preferred-apps
echo.

pause
