import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useAuth } from "@/hooks/useAuth";

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, continueAsGuest } = useAuth();

  const handleLogin = async () => {
    console.log("handleLogin called");
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }

    setIsLoading(true);
    try {
      console.log("Calling login...");
      const success = await login(email, password);
      console.log("Login result:", success);
      if (success) {
        // Navigation will be handled by RootNavigator based on auth state
        console.log("Login successful");
      } else {
        Alert.alert("Error", "Login failed. Please try again.");
      }
    } catch {
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestAccess = async () => {
    console.log("handleGuestAccess called");
    setIsLoading(true);
    try {
      console.log("Calling continueAsGuest...");
      await continueAsGuest();
      console.log("Guest access granted");
      // Navigation will be handled by RootNavigator based on auth state
    } catch {
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons name="people-circle" size={80} color="#007AFF" />
          </View>
          <Text style={styles.title}>Welcome</Text>
          <Text style={styles.subtitle}>Sign in to manage users</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Ionicons
              name="mail-outline"
              size={20}
              color="#8E8E93"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.textInput}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color="#8E8E93"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.textInput}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />
          </View>

          <TouchableOpacity
            style={[styles.loginButton, isLoading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.loginButtonText}>Sign In</Text>
            )}
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={[styles.guestButton, isLoading && styles.buttonDisabled]}
            onPress={handleGuestAccess}
            disabled={isLoading}
          >
            <Ionicons name="person-outline" size={20} color="#007AFF" />
            <Text style={styles.guestButtonText}>Continue as Guest</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Demo app - use any email and password
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 48,
  },
  logoContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#8E8E93",
    textAlign: "center",
  },
  form: {
    marginBottom: 32,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 16,
    color: "#000000",
  },
  loginButton: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 24,
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E5EA",
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: "#8E8E93",
  },
  guestButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#007AFF",
  },
  guestButtonText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  footer: {
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#8E8E93",
    textAlign: "center",
  },
});

export default LoginScreen;
