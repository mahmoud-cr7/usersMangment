import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

export default function UserDeepLinkHandler() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  useEffect(() => {
    // Redirect to the dedicated deeplink user details screen
    if (id) {
      console.log("Deep link handler: redirecting to deeplink user screen", id);
      router.replace({ pathname: "/deeplink/user/[id]", params: { id } });
    }
  }, [id, router]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
