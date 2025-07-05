@echo off
echo Starting Android Release Build Process...
echo.

echo Step 1: Cleaning previous builds...
cd android
call gradlew clean
if %errorlevel% neq 0 (
    echo Error: Failed to clean Android project
    pause
    exit /b 1
)

echo.
echo Step 2: Building release APK...
call gradlew assembleRelease
if %errorlevel% neq 0 (
    echo Error: Failed to build release APK
    pause
    exit /b 1
)

echo.
echo SUCCESS: Release APK built successfully!
echo.
echo APK Location: android\app\build\outputs\apk\release\app-release.apk
echo.
echo You can find your APK at:
echo %cd%\app\build\outputs\apk\release\app-release.apk
echo.
pause
