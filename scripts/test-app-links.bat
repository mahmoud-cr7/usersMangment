@echo off
echo === Android App Links Test Script ===
echo.

REM App details
set PACKAGE_NAME=com.yourcompany.usersmanagement
set USER_ID=14
set CUSTOM_SCHEME_URL=usersmgmt://user/%USER_ID%
set HTTPS_URL=https://usersmanagement.app/user/%USER_ID%

echo 📱 Testing deep links for User Management App
echo Package: %PACKAGE_NAME%
echo User ID: %USER_ID%
echo.

REM Check if device is connected
echo 🔌 Checking device connection...
adb devices | findstr "device" >nul
if %errorlevel% neq 0 (
    echo ❌ No Android device found. Please connect a device or start an emulator.
    pause
    exit /b 1
)
echo ✅ Device connected
echo.

REM Test 1: Custom scheme
echo 🧪 Test 1: Custom Scheme URL
echo URL: %CUSTOM_SCHEME_URL%
echo Running: adb shell am start -W -a android.intent.action.VIEW -d "%CUSTOM_SCHEME_URL%" %PACKAGE_NAME%
adb shell am start -W -a android.intent.action.VIEW -d "%CUSTOM_SCHEME_URL%" "%PACKAGE_NAME%"
echo.
set /p custom_result="Did the app open with User %USER_ID%? (y/n): "
echo.

REM Test 2: HTTPS URL
echo 🧪 Test 2: HTTPS URL (App Links)
echo URL: %HTTPS_URL%
echo Running: adb shell am start -W -a android.intent.action.VIEW -d "%HTTPS_URL%"
adb shell am start -W -a android.intent.action.VIEW -d "%HTTPS_URL%"
echo.
set /p https_result="Did the app open with User %USER_ID%? (y/n): "
echo.

REM Results
echo === Test Results ===
echo Custom Scheme (usersmgmt://): %custom_result%
echo HTTPS URL (https://): %https_result%
echo.

if "%https_result%"=="y" (
    echo 🎉 SUCCESS! App Links are working correctly.
    echo Your HTTPS URLs will now open your app on Android devices.
) else (
    echo ❌ App Links not working. Troubleshooting steps:
    echo.
    echo 1. Verify domain verification:
    echo    curl https://usersmanagement.app/.well-known/assetlinks.json
    echo.
    echo 2. Check Android logs:
    echo    adb logcat ^| findstr /i "digital.asset"
    echo.
    echo 3. Verify app signature matches assetlinks.json:
    echo    Check SHA256 fingerprint in the uploaded assetlinks.json
    echo.
    echo 4. Clear app data and reinstall:
    echo    adb uninstall %PACKAGE_NAME%
    echo    npm run android
    echo.
    echo 5. Test domain verification:
    echo    https://developers.google.com/digital-asset-links/tools/generator
)
echo.
pause
