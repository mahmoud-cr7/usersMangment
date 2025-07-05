import {
  NavigationContainer,
  NavigationIndependentTree,
} from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as Linking from "expo-linking";
import React, { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { useAuth } from "@/hooks/useAuth";
import AuthNavigator from "./AuthNavigator";
import BottomTabsNavigator from "./BottomTabsNavigator";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

const AppNavigator: React.FC = () => {
  const { isLoading, hasSeenAuth, isAuthenticated, isGuest, continueAsGuest } =
    useAuth();
  const [hasDeepLink, setHasDeepLink] = React.useState(false);

  console.log("AppNavigator - Auth State:", {
    isLoading,
    hasSeenAuth,
    isAuthenticated,
    isGuest,
    hasDeepLink,
  });

  useEffect(() => {
    Linking.getInitialURL().then((url) => {
      console.log("Initial URL:", url);

      // Check for deep link patterns
      const isDeepLinkToUser =
        url && (url.includes("user/") || url.includes("userId="));

      if (isDeepLinkToUser) {
        console.log(
          "Deep link detected, setting guest mode and bypassing auth screen"
        );
        setHasDeepLink(true);

        // If user hasn't seen auth screen, automatically set them as guest
        if (!hasSeenAuth && !isAuthenticated && !isGuest) {
          continueAsGuest();
        }
      }
    });
  }, [hasSeenAuth, isAuthenticated, isGuest, continueAsGuest]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  // If user hasn't seen auth screen AND no deep link, show auth flow
  if (!hasSeenAuth && !hasDeepLink) {
    console.log("Showing AuthNavigator");
    return <AuthNavigator />;
  }

  // If user has seen auth OR has deep link, show main app
  console.log("Showing BottomTabsNavigator");
  return <BottomTabsNavigator />;
};

const RootNavigator: React.FC = () => {
  const linking = {
    prefixes: [
      Linking.createURL("/"),
      "usersmgmt://",
      "https://usersmanagement.app",
      "https://www.usersmanagement.app",
    ],
    config: {
      // Define the main structure when authenticated
      screens: {
        UsersStack: {
          screens: {
            UsersList: "users",
            UserDetails: {
              path: "user/:userId",
              parse: {
                userId: (userId: string) => userId,
              },
            },
            AddEditUser: {
              path: "user/:userId/edit",
              parse: {
                userId: (userId: string) => userId,
              },
            },
          },
        },
        Profile: "profile",
        Login: "login",
        // Handle the app router user/[id] path
        "user/:id": {
          path: "user/:id",
          parse: {
            id: (id: string) => id,
          },
        },
      },
    },
  };

  // Global deep link handling
  const navigationRef = React.useRef<any>(null);
  const [pendingDeepLink, setPendingDeepLink] = React.useState<string | null>(
    null
  );

  React.useEffect(() => {
    const handleDeepLink = (url: string | null) => {
      if (url) {
        console.log("🔗 Deep link received:", url);

        // Parse the URL
        const parsed = Linking.parse(url);
        console.log("📝 Parsed URL:", parsed);

        let userId: string | null = null;

        // Check if this is a user deep link (usersmgmt://user/14)
        if (url.includes("user/")) {
          // Extract user ID from the URL - handle both "user/14" and "/user/14" patterns
          const userIdMatch = url.match(/user\/(\d+)/);
          if (userIdMatch) {
            userId = userIdMatch[1];
          }
        }

        // Check if this is a URL parameter (/?userId=14)
        if (url.includes("userId=")) {
          const urlParams = new URLSearchParams(url.split("?")[1]);
          const paramUserId = urlParams.get("userId");
          if (paramUserId) {
            userId = paramUserId;
          }
        }

        if (userId) {
          console.log("👤 Deep link to user:", userId);
          // Always store as pending deep link to handle after navigation is ready
          setPendingDeepLink(userId);
        }
      }
    };

    // Handle initial URL when app is opened from a link
    Linking.getInitialURL().then(handleDeepLink);

    // Handle URLs when app is already open
    const subscription = Linking.addEventListener("url", (event) => {
      handleDeepLink(event.url);
    });

    return () => {
      subscription?.remove();
    };
  }, []);

  // Handle pending deep link when navigation becomes ready
  React.useEffect(() => {
    if (pendingDeepLink && navigationRef.current?.isReady?.()) {
      console.log(
        "🚀 Navigation ready, handling pending deep link for user:",
        pendingDeepLink
      );

      // Add a longer delay to ensure navigation state is fully initialized
      setTimeout(() => {
        try {
          // Debug: Check navigation state before attempting navigation
          console.log(
            "🔍 Navigation state:",
            navigationRef.current?.getRootState()
          );
          console.log(
            "🔍 Current route:",
            navigationRef.current?.getCurrentRoute()
          );

          navigationRef.current?.navigate("UsersStack", {
            screen: "UserDetails",
            params: { userId: pendingDeepLink },
          });
          setPendingDeepLink(null);
        } catch (error) {
          console.log("❌ Pending navigation failed:", error);
          // Try again with even longer delay
          setTimeout(() => {
            try {
              console.log("🔄 Retrying navigation after longer delay...");
              navigationRef.current?.navigate("UsersStack", {
                screen: "UserDetails",
                params: { userId: pendingDeepLink },
              });
              setPendingDeepLink(null);
            } catch (retryError) {
              console.log("❌ Retry navigation failed:", retryError);
            }
          }, 2000);
        }
      }, 1500);
    }
  }, [pendingDeepLink]);

  // Add a navigation ready state listener
  const handleNavigationReady = React.useCallback(() => {
    console.log("🎯 Navigation container is ready");
    if (pendingDeepLink) {
      console.log("🚀 Handling pending deep link on ready:", pendingDeepLink);
      setTimeout(() => {
        try {
          navigationRef.current?.navigate("UsersStack", {
            screen: "UserDetails",
            params: { userId: pendingDeepLink },
          });
          setPendingDeepLink(null);
        } catch (error) {
          console.log("❌ Navigation on ready failed:", error);
        }
      }, 500);
    }
  }, [pendingDeepLink]);

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AuthProvider>
          <NavigationIndependentTree>
            <NavigationContainer
              ref={navigationRef}
              linking={linking as any}
              onReady={handleNavigationReady}
            >
              <AppNavigator />
            </NavigationContainer>
          </NavigationIndependentTree>
        </AuthProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});

export default RootNavigator;
