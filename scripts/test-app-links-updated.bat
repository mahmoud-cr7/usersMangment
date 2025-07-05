@echo off
echo === App Link Verification Test ===
echo.

REM Updated fingerprint
set CURRENT_FINGERPRINT=FA:C6:17:45:DC:09:03:78:6F:B9:ED:E6:2A:96:2B:39:9F:73:48:F0:BB:6F:89:9B:83:32:66:75:91:03:3B:9C
set VERCEL_DOMAIN=usersmanagement-linkss-3p58oor4w-mahmouds-projects-414b5cea.vercel.app
set PACKAGE_NAME=com.yourcompany.usersmanagement

echo Current certificate fingerprint: %CURRENT_FINGERPRINT%
echo Vercel domain: %VERCEL_DOMAIN%
echo Package: %PACKAGE_NAME%
echo.

echo 🔍 Step 1: Checking domain verification status...
adb shell dumpsys package domain-preferred-apps | findstr -A 5 -B 2 "%PACKAGE_NAME%"
echo.

echo 📋 Step 2: Verifying assetlinks.json accessibility...
echo You need to make sure this URL returns the updated JSON:
echo https://%VERCEL_DOMAIN%/.well-known/assetlinks.json
echo.

echo 🧪 Step 3: Testing custom scheme (should work)...
adb shell am start -W -a android.intent.action.VIEW -d "usersmgmt://user/14" "%PACKAGE_NAME%"
echo.

echo 🌐 Step 4: Testing HTTPS URL (may still open Chrome until verification completes)...
adb shell am start -W -a android.intent.action.VIEW -d "https://%VERCEL_DOMAIN%/user/14"
echo.

echo ⚠️  NOTE: If HTTPS still opens Chrome:
echo 1. Upload the updated assetlinks.json to your Vercel domain
echo 2. Wait 10-15 minutes for verification to propagate
echo 3. Try clearing Chrome's cache or restarting the device
echo 4. Re-run this test script
echo.

pause
