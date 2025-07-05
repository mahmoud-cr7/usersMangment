#!/bin/bash

# Simple Deep Link Test Script
echo "🧪 Testing Deep Links for Users Management App"
echo "=============================================="

PACKAGE_NAME="com.yourcompany.usersmanagement"

# Check if device is connected
if ! adb devices | grep -q "device$"; then
    echo "❌ No Android device connected"
    echo "Please connect an Android device or start an emulator"
    exit 1
fi

echo "✅ Device connected"
echo ""

# Test User Profile Deep Link
echo "📱 Testing: usersmgmt://user/1"
adb shell am start -a android.intent.action.VIEW -c android.intent.category.BROWSABLE -d "usersmgmt://user/1" "$PACKAGE_NAME" 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ Deep link sent successfully"
    echo "Check your device - the app should open to User Details for user ID 1"
else
    echo "❌ Failed to send deep link"
    echo "Make sure the app is installed on your device"
fi

echo ""
echo "💡 To test manually:"
echo "   1. Open any web browser on your device"
echo "   2. Type: usersmgmt://user/1"
echo "   3. The app should open automatically"
echo ""
echo "🔗 Other test URLs:"
echo "   usersmgmt://user/2"
echo "   usersmgmt://user/3"
echo "   usersmgmt://users (for users list)"
