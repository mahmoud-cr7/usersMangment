import {
  NavigationContainer,
  NavigationIndependentTree,
} from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as Linking from "expo-linking";
import React from "react";
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
    prefixes: [Linking.createURL("/"), "usersmgmt://"],
    config: {
      screens: {
        UsersStack: {
          screens: {
            UsersList: "users",
            UserDetails: "user/:userId",
            AddEditUser: {
              path: "user/:userId/edit",
              parse: {
                userId: (userId: string) => userId,
              },
            },
          },
        },
        Profile: "profile",
      },
    },
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AuthProvider>
          <NavigationIndependentTree>
            <NavigationContainer linking={linking as any}>
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
