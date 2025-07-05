@echo off
echo === Getting SHA256 Fingerprint for Android App Links ===
echo.

REM Check if keytool is available
where keytool >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ keytool not found. Please make sure Java is installed and keytool is in your PATH.
    pause
    exit /b 1
)

echo 📱 Getting SHA256 fingerprint for debug keystore...
echo.

REM For debug builds
set DEBUG_KEYSTORE=%USERPROFILE%\.android\debug.keystore
if exist "%DEBUG_KEYSTORE%" (
    echo 🔑 Debug keystore found at: %DEBUG_KEYSTORE%
    echo.
    echo SHA256 Fingerprint (Debug):
    keytool -list -v -keystore "%DEBUG_KEYSTORE%" -alias androiddebugkey -storepass android -keypass android | findstr "SHA256:"
    echo.
) else (
    echo ❌ Debug keystore not found at %DEBUG_KEYSTORE%
    echo.
)

REM For release builds
echo 📦 For release builds, you'll need to get the fingerprint from your release keystore:
echo    keytool -list -v -keystore path\to\your\release.keystore -alias your_key_alias
echo.

echo 🌐 Steps to complete App Links setup:
echo 1. Copy the SHA256 fingerprint from above
echo 2. Replace 'YOUR_SHA256_FINGERPRINT_HERE' in .well-known/assetlinks.json
echo 3. Upload .well-known/assetlinks.json to https://usersmanagement.app/.well-known/assetlinks.json
echo 4. Rebuild your app with: npm run android
echo 5. Test with: adb shell am start -W -a android.intent.action.VIEW -d "https://usersmanagement.app/user/14"
echo.
echo 🔍 Verify your setup at: https://developers.google.com/digital-asset-links/tools/generator
echo.
pause
