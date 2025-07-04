import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { User } from "@/services/api";

interface UserCardProps {
  user: User;
  onPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onGuestRestriction?: () => void;
  isGuest?: boolean;
}

const UserCard: React.FC<UserCardProps> = ({
  user,
  onPress,
  onEdit,
  onDelete,
  onGuestRestriction,
  isGuest = false,
}) => {
  const handleDelete = () => {
    if (isGuest) {
      onGuestRestriction?.();
      return;
    }
    const fullName =
      `${user.firstname || ""} ${user.lastname || ""}`.trim() || "this user";
    Alert.alert("Delete User", `Are you sure you want to delete ${fullName}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: onDelete,
      },
    ]);
  };

  const handleEdit = () => {
    if (isGuest) {
      onGuestRestriction?.();
      return;
    }
    onEdit();
  };

  const getInitials = (firstname: string = "", lastname: string = "") => {
    const firstInitial = firstname ? firstname[0] : "";
    const lastInitial = lastname ? lastname[0] : "";
    return (firstInitial + lastInitial).toUpperCase() || "U";
  };

  const getFullName = () => {
    return (
      `${user.firstname || ""} ${user.lastname || ""}`.trim() || "Unknown User"
    );
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.leftSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {getInitials(user.firstname, user.lastname)}
          </Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{getFullName()}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          {user.username && (
            <Text style={styles.userHandle}>@{user.username}</Text>
          )}
        </View>
      </View>

      <View style={styles.rightSection}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={handleEdit}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="create-outline" size={18} color="#007AFF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={handleDelete}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="trash-outline" size={18} color="#FF3B30" />
        </TouchableOpacity>

        <Ionicons name="chevron-forward" size={16} color="#8E8E93" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    color: "#8E8E93",
    marginBottom: 2,
  },
  userHandle: {
    fontSize: 12,
    color: "#007AFF",
    fontWeight: "500",
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
  },
  editButton: {
    backgroundColor: "#F0F8FF",
  },
  deleteButton: {
    backgroundColor: "#FFF5F5",
  },
});

export default UserCard;
