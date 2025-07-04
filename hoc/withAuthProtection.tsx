import BottomSheetLogin from "@/components/BottomSheetLogin";
import { useAuth } from "@/hooks/useAuth";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

interface WithAuthProtectionOptions {
  requireAuth?: boolean;
  blockGuests?: boolean;
  customGuestMessage?: string;
  customGuestTitle?: string;
}

const withAuthProtection = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: WithAuthProtectionOptions = {
    requireAuth: true,
    blockGuests: true,
    customGuestTitle: "Login Required",
    customGuestMessage: "Please login to access this feature",
  }
) => {
  const AuthProtectedComponent: React.FC<P> = (props) => {
    const { isAuthenticated, isLoading, isGuest } = useAuth();
    const [showGuestBottomSheet, setShowGuestBottomSheet] = useState(false);

    useEffect(() => {
      if (options.blockGuests && isGuest && !isLoading) {
        setShowGuestBottomSheet(true);
      } else {
        setShowGuestBottomSheet(false);
      }
    }, [isGuest, isLoading]);

    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      );
    }

    if (options.requireAuth && !isAuthenticated && !isGuest) {
      // User needs to see auth screen first
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      );
    }

    if (options.blockGuests && isGuest && !isLoading) {
      // Block guests from seeing the screen content
      return (
        <View style={styles.blockedContainer}>
          <BottomSheetLogin
            isVisible={true}
            onClose={() => {}} // Don't allow closing for blocked screens
            title={options.customGuestTitle}
            message={options.customGuestMessage}
          />
        </View>
      );
    }

    return (
      <>
        <WrappedComponent {...props} />
        <BottomSheetLogin
          isVisible={showGuestBottomSheet}
          onClose={() => setShowGuestBottomSheet(false)}
          title={options.customGuestTitle}
          message={options.customGuestMessage}
        />
      </>
    );
  };

  AuthProtectedComponent.displayName = `withAuthProtection(${
    WrappedComponent.displayName || WrappedComponent.name
  })`;

  return AuthProtectedComponent;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  blockedContainer: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
});

export default withAuthProtection;
