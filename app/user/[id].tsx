import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

export default function UserDeepLinkHandler() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  useEffect(() => {
    // Redirect to the main app with the user ID
    // Since the main navigation is handled by RootNavigator,
    // we need to redirect to the index route and let RootNavigator handle it
    if (id) {
      console.log("Deep link handler: redirecting to user", id);
      // Navigate to the main app which will use RootNavigator
      router.replace("/");
    }
  }, [id, router]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
