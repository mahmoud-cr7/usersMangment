# Deep Linking Implementation Guide

This guide explains how deep linking has been implemented in the Users Management app and how to test it.

## What's Implemented

### 1. Custom URL Scheme (`usersmgmt://`)

- **Purpose**: Opens the app directly from other apps
- **Example**: `usersmgmt://user/123`
- **Use case**: Sharing user profiles between apps

### 2. Android App Links (HTTPS URLs)

- **Purpose**: Opens the app from web links automatically
- **Example**: `https://usersmanagement.app/user/123`
- **Use case**: Sharing links that work in web browsers and automatically open the app

### 3. Navigation Integration

- **Purpose**: Routes incoming links to the correct screen
- **Implementation**: Uses React Navigation's linking configuration

## File Changes Made

### 1. App Configuration (`app.json`)

```json
{
  "expo": {
    "scheme": "usersmgmt",
    "android": {
      "intentFilters": [
        {
          "action": "VIEW",
          "data": [{ "scheme": "usersmgmt" }],
          "category": ["BROWSABLE", "DEFAULT"]
        },
        {
          "action": "VIEW",
          "autoVerify": true,
          "data": [
            {
              "scheme": "https",
              "host": "*.usersmanagement.app",
              "pathPrefix": "/user"
            }
          ],
          "category": ["BROWSABLE", "DEFAULT"]
        }
      ]
    }
  }
}
```

### 2. Android App Links Verification (`public/.well-known/assetlinks.json`)

```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.yourcompany.usersmanagement",
      "sha256_cert_fingerprints": ["YOUR_APP_CERTIFICATE_FINGERPRINT"]
    }
  }
]
```

### 3. Navigation Configuration (`navigation/RootNavigator.tsx`)

- Added linking configuration to map URLs to screens
- Added deep link handling for app startup and runtime

### 4. Share Utilities (`utils/shareLink.ts`)

- Enhanced sharing to include both deep links and web links
- Added testing utilities for deep link functionality
- Added fallback mechanisms

### 5. User Details Screen (`screens/Users/UserDetailsScreen.tsx`)

- Added test deep link button
- Enhanced sharing functionality
- Added visual feedback for deep link testing

## How to Test Deep Links

### Prerequisites

1. **Android Device/Emulator**: Connected via ADB
2. **App Installed**: Either development build or production APK
3. **ADB Tools**: Android SDK Platform Tools installed

### Testing Methods

#### Method 1: Using the Test Script

```bash
# Make the script executable
chmod +x scripts/test-deep-links.sh

# Run the script
./scripts/test-deep-links.sh
```

#### Method 2: Manual ADB Commands

```bash
# Test custom scheme
adb shell am start -a android.intent.action.VIEW -c android.intent.category.BROWSABLE -d "usersmgmt://user/123" com.yourcompany.usersmanagement

# Test web URL
adb shell am start -a android.intent.action.VIEW -c android.intent.category.BROWSABLE -d "https://usersmanagement.app/user/123"

# Test Expo Go (development)
adb shell am start -a android.intent.action.VIEW -c android.intent.category.BROWSABLE -d "exp://127.0.0.1:8081/--/user/123" host.exp.exponent
```

#### Method 3: Using the In-App Test Button

1. Open a user details screen
2. Tap the "Test Deep Links" button (link icon)
3. Choose which link to test from the dialog

#### Method 4: Browser Testing

1. Open a web browser on your device
2. Enter: `usersmgmt://user/123`
3. The app should open automatically

### Expected Behavior

#### Successful Deep Link

1. App opens/comes to foreground
2. Navigates to User Details screen
3. Shows the correct user (ID from URL)
4. URL appears in console logs

#### Failed Deep Link

1. Error message or nothing happens
2. Check console for error logs
3. Verify app is installed
4. Check URL format

## Development Testing

### Using Expo Go

```bash
# Start development server with tunnel
EXPO_TUNNEL_SUBDOMAIN=myapp npx expo start --tunnel

# Test with Expo Go
npx uri-scheme open exp://myapp.ngrok.io/--/user/123 --ios
```

### Using Development Build

```bash
# Test custom scheme
npx uri-scheme open usersmgmt://user/123 --android
npx uri-scheme open usersmgmt://user/123 --ios
```

## Production Setup

### 1. Get Certificate Fingerprint

```bash
# For EAS Build
eas credentials -p android

# For local keystore
keytool -list -v -keystore your-keystore.jks -alias your-alias
```

### 2. Update assetlinks.json

- Replace `YOUR_APP_CERTIFICATE_FINGERPRINT` with actual fingerprint
- Host the file at `https://usersmanagement.app/.well-known/assetlinks.json`

### 3. Verify Domain

- Ensure the domain in app.json matches your actual domain
- Update all references from `usersmanagement.app` to your domain

### 4. Test Production Build

```bash
# Build and install
eas build --platform android --profile production
# Then test with the same ADB commands
```

## Troubleshooting

### Common Issues

#### 1. Links Not Opening App

- **Check**: App is installed
- **Check**: URL scheme is correct
- **Check**: Intent filters in app.json

#### 2. Android App Links Not Working

- **Check**: assetlinks.json is hosted correctly
- **Check**: Certificate fingerprint matches
- **Check**: Domain verification completed

#### 3. App Opens But Wrong Screen

- **Check**: Navigation linking configuration
- **Check**: Route parameter parsing
- **Check**: Screen exists and is accessible

#### 4. Development vs Production Differences

- **Development**: Uses Expo Go or development build
- **Production**: Uses production certificate
- **URLs**: Different formats for different environments

### Debug Steps

1. Enable debug logging in RootNavigator.tsx
2. Check ADB logcat for Android system logs
3. Test with simple URLs first (no parameters)
4. Verify intent filters with ADB dumpsys

## URL Patterns Supported

| URL Pattern                     | Screen       | Example                     |
| ------------------------------- | ------------ | --------------------------- |
| `usersmgmt://user/:userId`      | User Details | `usersmgmt://user/123`      |
| `usersmgmt://user/:userId/edit` | Edit User    | `usersmgmt://user/123/edit` |
| `usersmgmt://users`             | Users List   | `usersmgmt://users`         |
| `usersmgmt://profile`           | Profile      | `usersmgmt://profile`       |

The same patterns work with HTTPS URLs:

- `https://usersmanagement.app/user/123`
- `https://usersmanagement.app/user/123/edit`
- etc.

## Next Steps

1. **Replace Domain**: Update all references to your actual domain
2. **Get Certificate**: Obtain your app's certificate fingerprint
3. **Host Verification File**: Upload assetlinks.json to your domain
4. **Test Production**: Build and test production app
5. **Monitor**: Set up analytics to track deep link usage
