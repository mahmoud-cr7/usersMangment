import * as Clipboard from "expo-clipboard";
import * as Linking from "expo-linking";
import { Alert, Platform, Share } from "react-native";

export const shareUserProfile = async (userId: string, userName: string) => {
  try {
    // Create deep link
    const deepLink = `usersmgmt://user/${userId}`;

    // Create web fallback URL (you should replace with your actual domain)
    const webUrl = `https://usersmanagement.app/user/${userId}`;

    // Create comprehensive message
    const message = `Check out ${userName}'s profile!

To open in the Users Management app:
${deepLink}

Or view online:
${webUrl}

User ID: ${userId}`;

    const result = await Share.share({
      message,
      title: `${userName}'s Profile`,
      ...(Platform.OS === "ios" && { url: deepLink }),
    });

    if (result.action === Share.sharedAction) {
      console.log("Profile shared successfully");
    }
  } catch (error) {
    console.error("Error sharing:", error);
    Alert.alert("Error", "Unable to share profile");
  }
};

// Function to copy link to clipboard
export const copyUserProfileLink = async (userId: string, userName: string) => {
  try {
    const deepLink = `usersmgmt://user/${userId}`;
    await Clipboard.setStringAsync(deepLink);

    Alert.alert(
      "Link Copied",
      `${userName}'s profile link has been copied to clipboard:\n\n${deepLink}`,
      [{ text: "OK" }]
    );
  } catch (error) {
    console.error("Error copying link:", error);
    Alert.alert("Error", "Unable to copy link");
  }
};

// Function to show link options
export const showLinkOptions = (userId: string, userName: string) => {
  const webUrl = `https://usersmanagement.app/user/${userId}`;

  Alert.alert("Share Profile", `Choose how to share ${userName}'s profile:`, [
    {
      text: "Share Link",
      onPress: () => shareUserProfile(userId, userName),
    },
    {
      text: "Copy Deep Link",
      onPress: () => copyUserProfileLink(userId, userName),
    },

    {
      text: "Cancel",
      style: "cancel",
    },
  ]);
};

// Helper function to check if the app can handle deep links
export const canOpenDeepLink = async (url: string): Promise<boolean> => {
  try {
    return await Linking.canOpenURL(url);
  } catch {
    return false;
  }
};

// Helper function to open deep link with fallback
export const openUserProfile = async (userId: string) => {
  const deepLink = `usersmgmt://user/${userId}`;
  const webUrl = `https://usersmanagement.app/user/${userId}`;

  try {
    const canOpen = await Linking.canOpenURL(deepLink);
    if (canOpen) {
      await Linking.openURL(deepLink);
    } else {
      // Fallback to web URL
      await Linking.openURL(webUrl);
    }
  } catch (error) {
    console.error("Error opening link:", error);
    Alert.alert("Error", "Unable to open profile");
  }
};

// Helper function to create shareable links
export const createUserProfileLink = (
  userId: string,
  type: "deep" | "web" = "web"
) => {
  if (type === "deep") {
    return `usersmgmt://user/${userId}`;
  }
  return `https://usersmanagement.app/user/${userId}`;
};

// Test deep linking functionality
export const testDeepLink = async (userId: string) => {
  const deepLink = `usersmgmt://user/${userId}`;
  const webLink = `https://usersmanagement.app/user/${userId}`;

  console.log("Testing deep links:");
  console.log("Deep link:", deepLink);
  console.log("Web link:", webLink);

  try {
    const canOpenDeep = await Linking.canOpenURL(deepLink);
    const canOpenWeb = await Linking.canOpenURL(webLink);

    console.log("Can open deep link:", canOpenDeep);
    console.log("Can open web link:", canOpenWeb);

    Alert.alert(
      "Deep Link Test",
      `Deep link: ${canOpenDeep ? "Available" : "Not available"}\nWeb link: ${
        canOpenWeb ? "Available" : "Not available"
      }`,
      [
        { text: "Test Deep Link", onPress: () => Linking.openURL(deepLink) },
        { text: "Test Web Link", onPress: () => Linking.openURL(webLink) },
        { text: "Cancel", style: "cancel" },
      ]
    );
  } catch (error) {
    console.error("Error testing links:", error);
    Alert.alert("Error", "Unable to test links");
  }
};
