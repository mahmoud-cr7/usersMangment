#!/bin/bash

echo "Testing Vercel-hosted assetlinks.json..."
echo ""

# Test 1: Check if assetlinks.json is accessible
echo "1. Testing assetlinks.json accessibility:"
curl -s -I "https://usersmanagement-linkss-3p58oor4w-mahmouds-projects-414b5cea.vercel.app/.well-known/assetlinks.json" | head -5
echo ""

echo "2. Getting assetlinks.json content:"
curl -s "https://usersmanagement-linkss-3p58oor4w-mahmouds-projects-414b5cea.vercel.app/.well-known/assetlinks.json" | head -20
echo ""

echo "3. Testing app link with ADB (after build completes):"
echo "adb shell am start -W -a android.intent.action.VIEW -d \"https://usersmanagement-linkss-3p58oor4w-mahmouds-projects-414b5cea.vercel.app/user/14\" com.yourcompany.usersmanagement"
echo ""

echo "4. Check for your app in domain verification:"
echo "adb shell dumpsys package domain-preferred-apps | grep -A 10 -B 2 \"com.yourcompany.usersmanagement\""
echo ""

echo "Note: Make sure to rebuild and install your app after updating the configuration!"
