import * as Linking from "expo-linking";
import { Alert, Share } from "react-native";

export const shareUserProfile = async (userId: string, userName: string) => {
  try {
    // Create deep link
    const deepLink = `usersmgmt://user/${userId}`;

    // Create web fallback URL (you can replace this with your actual web URL)
    const webUrl = `https://your-app-domain.com/user/${userId}`;

    // Create message with both links
    const message = `Check out ${userName}'s profile!\n\nOpen in app: ${deepLink}\nView online: ${webUrl}`;

    const result = await Share.share({
      message,
      title: `${userName}'s Profile`,
      url: deepLink, // This will be used on iOS
    });

    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        console.log("Shared via:", result.activityType);
      } else {
        console.log("Shared successfully");
      }
    } else if (result.action === Share.dismissedAction) {
      console.log("Share dismissed");
    }
  } catch (error) {
    console.error("Error sharing:", error);
    Alert.alert("Error", "Unable to share profile");
  }
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
  const webUrl = `https://your-app-domain.com/user/${userId}`;

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
