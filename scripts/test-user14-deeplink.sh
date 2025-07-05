#!/bin/bash

echo "🧪 Testing Deep Link for User ID 14"
echo "====================================="

PACKAGE_NAME="com.yourcompany.usersmanagement"
DEEP_LINK="usersmgmt://user/14"

# Check if device is connected
if ! adb devices | grep -q "device$"; then
    echo "❌ No Android device connected"
    echo "Please connect an Android device or start an emulator"
    exit 1
fi

echo "✅ Device connected"
echo ""

echo "📱 Testing: $DEEP_LINK"
adb shell am start -W -a android.intent.action.VIEW -d "$DEEP_LINK" "$PACKAGE_NAME"

if [ $? -eq 0 ]; then
    echo "✅ Deep link sent successfully"
    echo "Check your device - the app should open to User Details for user ID 14"
else
    echo "❌ Failed to send deep link"
    echo "Make sure the app is installed on your device"
fi

echo ""
echo "🔍 If the app goes to the not-found screen, check the console logs for debugging info"
