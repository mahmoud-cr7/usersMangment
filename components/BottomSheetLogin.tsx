import { useAuth } from "@/hooks/useAuth";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { forwardRef, useCallback, useMemo } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface BottomSheetLoginProps {
  isVisible: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

const BottomSheetLogin = forwardRef<View, BottomSheetLoginProps>(
  (
    {
      isVisible,
      onClose,
      title = "Login Required",
      message = "Please login to access this feature",
    },
    ref
  ) => {
    const { logout } = useAuth();
    const navigation = useNavigation();

    const handleLoginRedirect = useCallback(async () => {
      onClose();
      // Reset navigation stack and go to login
      await logout();
    }, [logout, onClose]);

    const handleGoBack = useCallback(() => {
      onClose();
      // Navigate back to the previous screen
      if (navigation.canGoBack()) {
        navigation.goBack();
      }
    }, [navigation, onClose]);

    const backdropOpacity = useMemo(() => (isVisible ? 0.5 : 0), [isVisible]);
    const translateY = useMemo(
      () => (isVisible ? 0 : SCREEN_HEIGHT),
      [isVisible]
    );

    if (!isVisible) {
      return null;
    }

    return (
      <View style={styles.container} ref={ref}>
        <View style={[styles.backdrop, { opacity: backdropOpacity }]} />
        <View style={[styles.bottomSheet, { transform: [{ translateY }] }]}>
          <View style={styles.handle} />

          <View style={styles.content}>
            <View style={styles.iconContainer}>
              <Ionicons name="lock-closed" size={48} color="#007AFF" />
            </View>

            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.loginButton}
                onPress={handleLoginRedirect}
              >
                <Text style={styles.loginButtonText}>Go to Login</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleGoBack}
              >
                <Text style={styles.cancelButtonText}>Go Back</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#000000",
  },
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 8,
    paddingBottom: 34,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  handle: {
    width: 36,
    height: 4,
    backgroundColor: "#D1D1D6",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },
  content: {
    paddingHorizontal: 24,
    alignItems: "center",
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F2F2F7",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 8,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: "#8E8E93",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 22,
  },
  buttonContainer: {
    width: "100%",
    gap: 12,
  },
  loginButton: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    backgroundColor: "#F2F2F7",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#8E8E93",
    fontSize: 16,
    fontWeight: "500",
  },
});

BottomSheetLogin.displayName = "BottomSheetLogin";

export default BottomSheetLogin;
