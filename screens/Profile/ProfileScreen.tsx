import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import withAuthProtection from "@/hoc/withAuthProtection";
import { useAuth } from "@/hooks/useAuth";

const ProfileScreen: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: logout,
      },
    ]);
  };

  const ProfileRow: React.FC<{
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    value?: string;
    onPress?: () => void;
    showChevron?: boolean;
  }> = ({ icon, label, value, onPress, showChevron = false }) => (
    <TouchableOpacity
      style={styles.profileRow}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.profileRowLeft}>
        <Ionicons
          name={icon}
          size={20}
          color="#007AFF"
          style={styles.profileRowIcon}
        />
        <Text style={styles.profileRowLabel}>{label}</Text>
      </View>
      <View style={styles.profileRowRight}>
        {value && <Text style={styles.profileRowValue}>{value}</Text>}
        {showChevron && (
          <Ionicons name="chevron-forward" size={16} color="#8E8E93" />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>

        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name
                .split(" ")
                .map((n) => n[0])
                .join("") || "U"}
            </Text>
          </View>
          <Text style={styles.userName}>{user?.name || "Unknown User"}</Text>
          <Text style={styles.userEmail}>{user?.email || "No email"}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.sectionContent}>
            <ProfileRow
              icon="person-outline"
              label="Name"
              value={user?.name || "Not set"}
            />
            <ProfileRow
              icon="mail-outline"
              label="Email"
              value={user?.email || "Not set"}
            />
            <ProfileRow
              icon="create-outline"
              label="Edit Profile"
              onPress={() => {
                // Navigate to edit profile
                Alert.alert(
                  "Edit Profile",
                  "Edit profile functionality coming soon!"
                );
              }}
              showChevron
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.sectionContent}>
            <ProfileRow
              icon="notifications-outline"
              label="Notifications"
              onPress={() => {
                Alert.alert(
                  "Notifications",
                  "Notification settings coming soon!"
                );
              }}
              showChevron
            />
            <ProfileRow
              icon="shield-outline"
              label="Privacy & Security"
              onPress={() => {
                Alert.alert("Privacy", "Privacy settings coming soon!");
              }}
              showChevron
            />
            <ProfileRow
              icon="help-circle-outline"
              label="Help & Support"
              onPress={() => {
                Alert.alert("Help", "Help & Support coming soon!");
              }}
              showChevron
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionContent}>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
    marginTop: 30, 
  },
  content: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000000",
  },
  profileSection: {
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    paddingVertical: 32,
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  userName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: "#8E8E93",
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#8E8E93",
    marginHorizontal: 16,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  sectionContent: {
    backgroundColor: "#FFFFFF",
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
  },
  profileRowLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  profileRowIcon: {
    marginRight: 12,
  },
  profileRowLabel: {
    fontSize: 16,
    color: "#000000",
  },
  profileRowRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileRowValue: {
    fontSize: 16,
    color: "#8E8E93",
    marginRight: 8,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FF3B30",
    marginLeft: 8,
  },
});

export default withAuthProtection(ProfileScreen, {
  requireAuth: false,
  blockGuests: true,
  customGuestTitle: "Profile Access Required",
  customGuestMessage:
    "Please login to view and manage your profile information",
});
