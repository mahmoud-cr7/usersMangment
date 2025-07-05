import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface DeepLinkInfo {
  url: string | null;
  parsed: any;
  timestamp: string;
}

const DeepLinkDebugger: React.FC = () => {
  const [linkHistory, setLinkHistory] = useState<DeepLinkInfo[]>([]);
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);

  useEffect(() => {
    // Get initial URL when app is opened from a link
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleIncomingURL(url);
      }
    });

    // Listen for incoming URLs while app is open
    const subscription = Linking.addEventListener("url", (event) => {
      handleIncomingURL(event.url);
    });

    return () => subscription?.remove();
  }, []);

  const handleIncomingURL = (url: string) => {
    console.log("🔗 Deep link received:", url);

    const parsed = Linking.parse(url);
    const linkInfo: DeepLinkInfo = {
      url,
      parsed,
      timestamp: new Date().toLocaleTimeString(),
    };

    setCurrentUrl(url);
    setLinkHistory((prev) => [linkInfo, ...prev.slice(0, 9)]); // Keep last 10 links
  };

  const testLinks = [
    { label: "User 1", url: "usersmgmt://user/1" },
    { label: "User 2", url: "usersmgmt://user/2" },
    { label: "User 3", url: "usersmgmt://user/3" },
    { label: "Users List", url: "usersmgmt://users" },
    { label: "Profile", url: "usersmgmt://profile" },
  ];

  const testLink = async (url: string) => {
    try {
      const canOpen = await Linking.canOpenURL(url);
      console.log(`Can open ${url}:`, canOpen);

      if (canOpen) {
        await Linking.openURL(url);
      } else {
        console.warn("Cannot open URL:", url);
      }
    } catch (error) {
      console.error("Error opening URL:", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🔗 Deep Link Debugger</Text>

      {/* Current URL */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Current URL</Text>
        <Text style={styles.urlText}>
          {currentUrl || "No deep link received yet"}
        </Text>
      </View>

      {/* Test Links */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Test Deep Links</Text>
        {testLinks.map((link, index) => (
          <TouchableOpacity
            key={index}
            style={styles.testButton}
            onPress={() => testLink(link.url)}
          >
            <Ionicons name="link-outline" size={20} color="#007AFF" />
            <Text style={styles.testButtonText}>{link.label}</Text>
            <Text style={styles.testUrlText}>{link.url}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Link History */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Link History</Text>
        {linkHistory.length === 0 ? (
          <Text style={styles.emptyText}>No links received yet</Text>
        ) : (
          linkHistory.map((item, index) => (
            <View key={index} style={styles.historyItem}>
              <Text style={styles.historyTime}>{item.timestamp}</Text>
              <Text style={styles.historyUrl}>{item.url}</Text>
              <Text style={styles.historyParsed}>
                Path: {item.parsed.path || "N/A"} | Params:{" "}
                {JSON.stringify(item.parsed.queryParams || {})}
              </Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 24,
    color: "#333",
  },
  section: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#333",
  },
  urlText: {
    fontSize: 14,
    fontFamily: "monospace",
    backgroundColor: "#f0f0f0",
    padding: 8,
    borderRadius: 4,
    color: "#666",
  },
  testButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#f8f9fa",
    borderRadius: 6,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  testButtonText: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 8,
    flex: 1,
    color: "#333",
  },
  testUrlText: {
    fontSize: 12,
    color: "#666",
    fontFamily: "monospace",
  },
  emptyText: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
    textAlign: "center",
    padding: 20,
  },
  historyItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    paddingBottom: 8,
    marginBottom: 8,
  },
  historyTime: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  historyUrl: {
    fontSize: 14,
    fontFamily: "monospace",
    color: "#007AFF",
    marginBottom: 4,
  },
  historyParsed: {
    fontSize: 12,
    color: "#666",
    fontFamily: "monospace",
  },
});

export default DeepLinkDebugger;
