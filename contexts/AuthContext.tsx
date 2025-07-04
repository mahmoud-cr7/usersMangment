import React, { createContext, useContext, useEffect, useState } from "react";

import { useToast } from "./ToastContext";

export interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isGuest: boolean;
  hasSeenAuth: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  continueAsGuest: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { showToast } = useToast();
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    isGuest: false,
    hasSeenAuth: false,
  });

  // Simulate checking authentication state on mount
  useEffect(() => {
    // Check if user has seen auth screen before
    // In a real app, you'd check AsyncStorage, tokens, etc.
    setTimeout(() => {
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        isGuest: false,
        hasSeenAuth: false, // User needs to see auth screen first
      });
    }, 1000);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log("AuthContext - login called with:", { email, password });
    try {
      // Simulate login API call
      setAuthState((prev) => ({ ...prev, isLoading: true }));

      // Mock successful login
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const user: User = {
        id: "1",
        email,
        name: "Demo User",
      };

      console.log("AuthContext - setting authenticated state");
      setAuthState({
        user,
        isLoading: false,
        isAuthenticated: true,
        isGuest: false,
        hasSeenAuth: true,
      });

      showToast({
        type: "success",
        title: "Welcome back!",
        message: `Logged in as ${user.name}`,
      });

      return true;
    } catch {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      showToast({
        type: "error",
        title: "Login failed",
        message: "Please check your credentials and try again",
      });
      return false;
    }
  };

  const continueAsGuest = async (): Promise<void> => {
    console.log("AuthContext - continueAsGuest called");
    setAuthState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      isGuest: true,
      hasSeenAuth: true,
    });
    console.log("AuthContext - guest state set");

    showToast({
      type: "info",
      title: "Guest mode",
      message: "You're browsing as a guest. Some features may be limited.",
    });
  };

  const logout = async (): Promise<void> => {
    setAuthState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      isGuest: false,
      hasSeenAuth: false, // Reset to show auth screen again
    });

    showToast({
      type: "success",
      title: "Logged out",
      message: "You have been successfully logged out",
    });
  };

  const signup = async (
    email: string,
    password: string,
    name: string
  ): Promise<boolean> => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }));

      // Simulate signup API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const user: User = {
        id: "1",
        email,
        name,
      };

      setAuthState({
        user,
        isLoading: false,
        isAuthenticated: true,
        isGuest: false,
        hasSeenAuth: true,
      });

      return true;
    } catch {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      return false;
    }
  };

  const value: AuthContextType = {
    ...authState,
    login,
    logout,
    signup,
    continueAsGuest,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
