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
  const { isLoading, hasSeenAuth, isAuthenticated, isGuest } = useAuth();

  console.log("AppNavigator - Auth State:", {
    isLoading,
    hasSeenAuth,
    isAuthenticated,
    isGuest,
  });
  useEffect(() => {
    Linking.getInitialURL().then((url) => {
      console.log("Initial URL:", url);
    });
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  // If user hasn't seen auth screen, show auth flow
  if (!hasSeenAuth) {
    console.log("Showing AuthNavigator");
    return <AuthNavigator />;
  }

  // If user has seen auth (either logged in or continued as guest), show main app
  console.log("Showing BottomTabsNavigator");
  return <BottomTabsNavigator />;
};

const RootNavigator: React.FC = () => {
  const linking = {
    prefixes: [
      Linking.createURL("/"),
      "usersmgmt://",
      "https://*.usersmanagement.app",
      "https://usersmanagement.app",
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

        // Check if this is a user deep link
        if (url.includes("user/")) {
          // Extract user ID from the URL - handle both "user/14" and "/user/14" patterns
          const userIdMatch = url.match(/user\/(\d+)/);
          if (userIdMatch) {
            const userId = userIdMatch[1];
            console.log("👤 Deep link to user:", userId);

            // Store the pending deep link if navigation isn't ready yet
            if (navigationRef.current?.isReady?.()) {
              console.log("🚀 Navigating immediately to user:", userId);
              navigationRef.current.navigate("UsersStack", {
                screen: "UserDetails",
                params: { userId },
              });
            } else {
              console.log(
                "⏳ Navigation not ready, storing pending deep link for user:",
                userId
              );
              setPendingDeepLink(userId);
            }
          }
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

      // Add a small delay to ensure navigation state is fully initialized
      setTimeout(() => {
        navigationRef.current?.navigate("UsersStack", {
          screen: "UserDetails",
          params: { userId: pendingDeepLink },
        });
        setPendingDeepLink(null);
      }, 500);
    }
  }, [pendingDeepLink]);

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AuthProvider>
          <NavigationIndependentTree>
            <NavigationContainer ref={navigationRef} linking={linking as any}>
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
