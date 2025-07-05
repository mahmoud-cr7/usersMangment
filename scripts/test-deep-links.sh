#!/bin/bash

# Deep Link Testing Script for Users Management App
# This script helps test various deep link scenarios

echo "🚀 Users Management Deep Link Testing Script"
echo "============================================="

# App package name
PACKAGE_NAME="com.yourcompany.usersmanagement"

# Test URLs
DEEP_LINK_SCHEME="usersmgmt://user/1"
WEB_LINK="https://usersmanagement.app/user/1"
EXPO_GO_LINK="exp://127.0.0.1:8081/--/user/1"

echo ""
echo "Available test commands:"
echo "1. Test custom scheme deep link"
echo "2. Test web URL (Android App Link)"
echo "3. Test Expo Go development link"
echo "4. Check if app is installed"
echo "5. Test all links"
echo ""

# Function to test custom scheme
test_custom_scheme() {
    echo "🔗 Testing custom scheme: $DEEP_LINK_SCHEME"
    adb shell am start -a android.intent.action.VIEW -c android.intent.category.BROWSABLE -d "$DEEP_LINK_SCHEME" "$PACKAGE_NAME"
    echo "✅ Custom scheme test sent"
}

# Function to test web URL
test_web_link() {
    echo "🌐 Testing web URL: $WEB_LINK"
    adb shell am start -a android.intent.action.VIEW -c android.intent.category.BROWSABLE -d "$WEB_LINK"
    echo "✅ Web URL test sent"
}

# Function to test Expo Go
test_expo_go() {
    echo "📱 Testing Expo Go link: $EXPO_GO_LINK"
    adb shell am start -a android.intent.action.VIEW -c android.intent.category.BROWSABLE -d "$EXPO_GO_LINK" "host.exp.exponent"
    echo "✅ Expo Go test sent"
}

# Function to check if app is installed
check_app_installed() {
    echo "📋 Checking if app is installed..."
    adb shell pm list packages | grep "$PACKAGE_NAME"
    if [ $? -eq 0 ]; then
        echo "✅ App is installed"
    else
        echo "❌ App is not installed"
    fi
}

# Function to test all
test_all() {
    echo "🧪 Running all tests..."
    echo ""
    check_app_installed
    echo ""
    test_custom_scheme
    sleep 2
    test_web_link
    sleep 2
    test_expo_go
    echo ""
    echo "✅ All tests completed"
}

# Check if ADB is available
if ! command -v adb &> /dev/null; then
    echo "❌ ADB is not installed or not in PATH"
    echo "Please install Android SDK Platform Tools"
    exit 1
fi

# Check if device is connected
if ! adb devices | grep -q "device$"; then
    echo "❌ No Android device connected"
    echo "Please connect an Android device or start an emulator"
    exit 1
fi

# Main menu
while true; do
    echo ""
    read -p "Enter your choice (1-5, or 'q' to quit): " choice
    
    case $choice in
        1)
            test_custom_scheme
            ;;
        2)
            test_web_link
            ;;
        3)
            test_expo_go
            ;;
        4)
            check_app_installed
            ;;
        5)
            test_all
            ;;
        q|Q)
            echo "👋 Goodbye!"
            exit 0
            ;;
        *)
            echo "❌ Invalid choice. Please enter 1-5 or 'q'"
            ;;
    esac
done
