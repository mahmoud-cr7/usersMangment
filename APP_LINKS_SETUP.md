# Android App Links Setup Guide

## Problem

Your web URL `https://usersmanagement.app/user/14` doesn't open your app on Android devices, but the custom scheme `usersmgmt://user/14` works fine.

## Solution

You need to set up **Android App Links** to handle HTTPS URLs. This requires:

1. ✅ **Intent Filters** (already configured in app.json)
2. ❌ **Domain Verification** (needs to be set up)
3. ❌ **App Rebuild** (after getting fingerprint)

## Steps to Fix

### Step 1: Get Your App's SHA256 Fingerprint

Run this command to get your debug keystore fingerprint:

```bash
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
```

Or on Windows:

```cmd
keytool -list -v -keystore "%USERPROFILE%\.android\debug.keystore" -alias androiddebugkey -storepass android -keypass android
```

Look for the SHA256 line and copy the fingerprint (format: XX:XX:XX:...)

### Step 2: Update assetlinks.json

1. Open `.well-known/assetlinks.json`
2. Replace `YOUR_SHA256_FINGERPRINT_HERE` with your actual SHA256 fingerprint
3. The fingerprint should be in colon-separated format (AA:BB:CC:...)

### Step 3: Upload to Your Domain

Upload the `.well-known/assetlinks.json` file to:

```
https://usersmanagement.app/.well-known/assetlinks.json
```

### Step 4: Verify Domain Verification

Check if your setup is correct:

- Visit: https://developers.google.com/digital-asset-links/tools/generator
- Or test directly: `curl https://usersmanagement.app/.well-known/assetlinks.json`

### Step 5: Rebuild Your App

After setting up domain verification:

```bash
npm run android
# or
npx expo run:android
```

### Step 6: Test

Test both methods:

```bash
# Custom scheme (should work)
adb shell am start -W -a android.intent.action.VIEW -d "usersmgmt://user/14" com.yourcompany.usersmanagement

# HTTPS URL (should work after setup)
adb shell am start -W -a android.intent.action.VIEW -d "https://usersmanagement.app/user/14"
```

## Troubleshooting

### If HTTPS URLs still don't work:

1. **Check domain verification:**

   ```bash
   curl https://usersmanagement.app/.well-known/assetlinks.json
   ```

2. **Verify fingerprint matches:**

   - The SHA256 in assetlinks.json must match your app's signing certificate
   - For debug builds: use debug keystore fingerprint
   - For release builds: use release keystore fingerprint

3. **Clear app data and reinstall:**

   ```bash
   adb uninstall com.yourcompany.usersmanagement
   npm run android
   ```

4. **Check Android logs:**
   ```bash
   adb logcat | grep -i "digital.asset"
   ```

## Important Notes

- **Development**: Use debug keystore fingerprint for testing
- **Production**: Use release keystore fingerprint for Play Store builds
- **Domain ownership**: You must control the domain (usersmanagement.app)
- **HTTPS required**: App Links only work with HTTPS URLs, not HTTP

## Current Status

✅ Intent filters configured in app.json
✅ Custom scheme working (usersmgmt://)
❌ Domain verification needed for HTTPS URLs
❌ assetlinks.json needs real SHA256 fingerprint
