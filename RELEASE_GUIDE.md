# Users Management App - Release Guide

This is a React Native app built with Expo that manages users with authentication, CRUD operations, and deep linking.

## Prerequisites

Before building for release, ensure you have:

1. **Node.js** (version 18 or higher)
2. **Expo CLI** installed globally: `npm install -g @expo/cli`
3. **EAS CLI** installed globally: `npm install -g eas-cli`
4. **Android Studio** (for Android builds) with Android SDK
5. **Xcode** (for iOS builds, macOS only)

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Login to Expo (create account if needed):

   ```bash
   eas login
   ```

3. Initialize EAS project:
   ```bash
   eas init
   ```

## Local Development Builds

### Option 1: Using Expo Prebuild (Recommended)

1. **Prebuild the native code:**

   ```bash
   npm run prebuild
   # or for clean prebuild
   npm run prebuild:clean
   ```

2. **Run on Android:**

   ```bash
   npm run build:android
   # or
   npx expo run:android
   ```

3. **Run on iOS:**
   ```bash
   npm run build:ios
   # or
   npx expo run:ios
   ```

### Option 2: Using EAS Build

1. **Build for development:**

   ```bash
   eas build --profile development --platform android
   eas build --profile development --platform ios
   ```

2. **Build for preview (APK):**
   ```bash
   eas build --profile preview --platform android
   ```

## Production Builds

### Using EAS Build (Cloud)

1. **Build for production:**

   ```bash
   # Android
   eas build --profile production --platform android

   # iOS
   eas build --profile production --platform ios

   # Both platforms
   eas build --profile production --platform all
   ```

2. **Submit to app stores:**

   ```bash
   # Google Play Store
   eas submit --platform android

   # Apple App Store
   eas submit --platform ios
   ```

### Using Local Builds

1. **Generate native code:**

   ```bash
   npx expo prebuild --clean
   ```

2. **Build Android APK:**

   ```bash
   cd android
   ./gradlew assembleRelease
   # APK will be in: android/app/build/outputs/apk/release/
   ```

3. **Build iOS Archive:**
   ```bash
   cd ios
   xcodebuild -workspace UsersManagement.xcworkspace -scheme UsersManagement archive
   ```

## Configuration Notes

### Bundle Identifiers

- **iOS:** `com.yourcompany.usersmanagement`
- **Android:** `com.yourcompany.usersmanagement`

⚠️ **Important:** Change these to your actual company domain before release!

### Deep Linking

- **URL Scheme:** `usersmgmt://`
- **Deep Link Format:** `usersmgmt://user/{userId}`

### Version Management

- Update `version` in `app.json` for app stores
- `buildNumber` (iOS) and `versionCode` (Android) auto-increment in production builds

## Environment Setup

### For Android Release:

1. Generate a keystore file
2. Configure signing in `android/app/build.gradle`
3. Set environment variables for keystore credentials

### For iOS Release:

1. Apple Developer account required
2. Configure provisioning profiles
3. Set up certificates in Xcode

## App Features

- ✅ User authentication with guest mode
- ✅ CRUD operations for user management
- ✅ Infinite scroll and search
- ✅ Deep linking support
- ✅ Toast notifications
- ✅ Guest restrictions and authentication protection
- ✅ Modern UI with React Navigation

## Troubleshooting

### Common Issues:

1. **Metro bundler issues:**

   ```bash
   npx expo start --clear
   ```

2. **Build cache issues:**

   ```bash
   npm run prebuild:clean
   ```

3. **Dependency conflicts:**

   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **Android build issues:**
   ```bash
   cd android
   ./gradlew clean
   ```

## Release Checklist

- [ ] Update version numbers in `app.json`
- [ ] Change bundle identifiers to your domain
- [ ] Test all features on both platforms
- [ ] Test deep linking functionality
- [ ] Test guest mode restrictions
- [ ] Verify API endpoints are production-ready
- [ ] Generate app icons and splash screens
- [ ] Configure app store metadata
- [ ] Test authentication flows
- [ ] Verify toast notifications work
- [ ] Test on different screen sizes

## Support

For issues with:

- **Expo:** [Expo Documentation](https://docs.expo.dev/)
- **EAS Build:** [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- **React Navigation:** [React Navigation Docs](https://reactnavigation.org/)
