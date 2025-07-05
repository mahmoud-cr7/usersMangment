@echo off
echo 🧪 Testing Deep Links for Users Management App
echo ==============================================
echo.

echo Testing: usersmgmt://user/1
npx uri-scheme open usersmgmt://user/1 --android
echo.

echo ✅ Deep link test sent!
echo Check your Android device - the app should open to User Details for user ID 1
echo.

echo 💡 Other test commands:
echo   npm run deeplink:user    - Test user profile
echo   npm run deeplink:users   - Test users list
echo.

echo 🔗 Manual test URLs (type in browser):
echo   usersmgmt://user/1
echo   usersmgmt://user/2
echo   usersmgmt://users
echo.

pause
