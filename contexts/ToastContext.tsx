import React, { createContext, ReactNode, useContext, useState } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";

import Toast from "@/components/Toast";

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info" | "warning";
  title: string;
  message?: string;
}

interface ToastContextType {
  toasts: ToastMessage[];
  showToast: (toast: Omit<ToastMessage, "id">) => void;
  hideToast: (id: string) => void;
  clearToasts: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (toast: Omit<ToastMessage, "id">) => {
    const id = Date.now().toString();
    const newToast: ToastMessage = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);

    // Auto-hide after 5 seconds
    setTimeout(() => {
      hideToast(id);
    }, 5000);
  };

  const hideToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const clearToasts = () => {
    setToasts([]);
  };

  const value: ToastContextType = {
    toasts,
    showToast,
    hideToast,
    clearToasts,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={hideToast} />
    </ToastContext.Provider>
  );
};

const ToastContainer: React.FC<{
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <View style={styles.toastContainer} pointerEvents="box-none">
      <SafeAreaView style={styles.safeArea} pointerEvents="box-none">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />
        ))}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    pointerEvents: "box-none",
  },
  safeArea: {
    flex: 1,
    pointerEvents: "box-none",
  },
});
