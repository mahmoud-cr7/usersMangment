import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { ToastMessage } from "@/contexts/ToastContext";

interface ToastProps {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate in
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [translateY, opacity]);

  const handleDismiss = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -100,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss(toast.id);
    });
  };

  const getToastStyle = () => {
    switch (toast.type) {
      case "success":
        return styles.successToast;
      case "error":
        return styles.errorToast;
      case "warning":
        return styles.warningToast;
      case "info":
      default:
        return styles.infoToast;
    }
  };

  const getIconName = () => {
    switch (toast.type) {
      case "success":
        return "checkmark-circle";
      case "error":
        return "close-circle";
      case "warning":
        return "warning";
      case "info":
      default:
        return "information-circle";
    }
  };

  const getIconColor = () => {
    switch (toast.type) {
      case "success":
        return "#4CAF50";
      case "error":
        return "#F44336";
      case "warning":
        return "#FF9800";
      case "info":
      default:
        return "#2196F3";
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        getToastStyle(),
        {
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      <TouchableOpacity
        style={styles.content}
        onPress={handleDismiss}
        activeOpacity={0.9}
      >
        <Ionicons
          name={getIconName()}
          size={24}
          color={getIconColor()}
          style={styles.icon}
        />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{toast.title}</Text>
          {toast.message && <Text style={styles.message}>{toast.message}</Text>}
        </View>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={handleDismiss}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="close" size={20} color="#666" />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 36,
    marginTop: 38,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  content: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 16,
  },
  icon: {
    marginRight: 12,
    marginTop: 2,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 2,
  },
  message: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 20,
  },
  closeButton: {
    padding: 4,
    marginLeft: 8,
  },
  successToast: {
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50",
  },
  errorToast: {
    borderLeftWidth: 4,
    borderLeftColor: "#F44336",
  },
  warningToast: {
    borderLeftWidth: 4,
    borderLeftColor: "#FF9800",
  },
  infoToast: {
    borderLeftWidth: 4,
    borderLeftColor: "#2196F3",
  },
});

export default Toast;
