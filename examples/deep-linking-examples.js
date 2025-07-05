/*
 * Example: How to test deep linking in the app
 */

// 1. From another app or web browser, try these URLs:

// Custom scheme (opens app directly)
// usersmgmt://user/1
// usersmgmt://user/2
// usersmgmt://users
// usersmgmt://profile

// Web URLs (Android App Links - opens app if installed, web if not)
// https://usersmanagement.app/user/1
// https://usersmanagement.app/user/2
// https://usersmanagement.app/users
// https://usersmanagement.app/profile

// 2. Using ADB (Android Debug Bridge):
/*
# Test custom scheme
adb shell am start -a android.intent.action.VIEW -c android.intent.category.BROWSABLE -d "usersmgmt://user/1" com.yourcompany.usersmanagement

# Test web URL
adb shell am start -a android.intent.action.VIEW -c android.intent.category.BROWSABLE -d "https://usersmanagement.app/user/1"
*/

import * as Linking from "expo-linking";

// 3. Using React Native Linking API programmatically:
export const testDeepLinkingExamples = async () => {
  // Open a user profile
  await Linking.openURL("usersmgmt://user/123");

  // Check if URL can be opened
  const canOpen = await Linking.canOpenURL("usersmgmt://user/123");
  console.log("Can open URL:", canOpen);
};

// 4. Testing in Expo Go development:
/*
# Start with tunnel
EXPO_TUNNEL_SUBDOMAIN=myapp npx expo start --tunnel

# Test link
npx uri-scheme open exp://myapp.ngrok.io/--/user/123 --android
*/

// 5. In-app testing:
// Use the "Test Deep Links" button in the UserDetailsScreen
// It will show a dialog with options to test different link types
