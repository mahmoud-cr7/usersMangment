import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import BottomSheetLogin from "@/components/BottomSheetLogin";
import { useToast } from "@/contexts/ToastContext";
import withAuthProtection from "@/hoc/withAuthProtection";
import { useAuth } from "@/hooks/useAuth";
import { useDeleteUser, useUser } from "@/hooks/useUsers";
import { showLinkOptions, testDeepLink } from "@/utils/shareLink";
import { UsersStackParamList } from "../../navigation/UsersStackNavigator";

type UserDetailsScreenNavigationProp = NativeStackNavigationProp<
  UsersStackParamList,
  "UserDetails"
>;
type UserDetailsScreenRouteProp = RouteProp<UsersStackParamList, "UserDetails">;

const UserDetailsScreen: React.FC = () => {
  const navigation = useNavigation<UserDetailsScreenNavigationProp>();
  const route = useRoute<UserDetailsScreenRouteProp>();
  const { userId } = route.params;
  const { showToast } = useToast();
  const { isGuest } = useAuth();
  const [showLoginSheet, setShowLoginSheet] = useState(false);
  console.log("UserDetails route.params:", route.params);
  // API hooks
  const { data: user, isLoading, isError, refetch } = useUser(userId);
  const deleteUserMutation = useDeleteUser();

  const handleEditUser = () => {
    if (isGuest) {
      setShowLoginSheet(true);
      return;
    }
    navigation.navigate("AddEditUser", { userId });
  };

  const handleDeleteUser = () => {
    if (isGuest) {
      setShowLoginSheet(true);
      return;
    }
    const userName = user ? `${user.firstname} ${user.lastname}` : "this user";
    Alert.alert("Delete User", `Are you sure you want to delete ${userName}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteUserMutation.mutateAsync(userId);
            showToast({
              type: "success",
              title: "User deleted successfully",
            });
            navigation.goBack();
          } catch {
            showToast({
              type: "error",
              title: "Failed to delete user",
            });
          }
        },
      },
    ]);
  };

  const handleShareUser = () => {
    if (user) {
      const userName = `${user.firstname} ${user.lastname}`;
      showLinkOptions(userId, userName);
    }
  };

  const handleTestDeepLink = () => {
    testDeepLink(userId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getInitials = (firstname: string = "", lastname: string = "") => {
    const firstInitial = firstname ? firstname[0] : "";
    const lastInitial = lastname ? lastname[0] : "";
    return (firstInitial + lastInitial).toUpperCase() || "U";
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#007AFF" />
          </TouchableOpacity>
          <Text style={styles.title}>User Details</Text>
          <View style={styles.headerActions} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading user details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isError || !user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#007AFF" />
          </TouchableOpacity>
          <Text style={styles.title}>User Details</Text>
          <View style={styles.headerActions} />
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#FF3B30" />
          <Text style={styles.errorTitle}>User not found</Text>
          <Text style={styles.errorSubtitle}>
            The user you are looking for does not exist or has been deleted.
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => refetch()}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const DetailRow: React.FC<{
    icon: string;
    label: string;
    value: string;
  }> = ({ icon, label, value }) => (
    <View style={styles.detailRow}>
      <View style={styles.detailRowLeft}>
        <Ionicons
          name={icon as any}
          size={20}
          color="#007AFF"
          style={styles.detailIcon}
        />
        <Text style={styles.detailLabel}>{label}</Text>
      </View>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.title}>User Details</Text>
        <View style={styles.headerActions}>
          {/* <TouchableOpacity
            style={styles.actionButton}
            onPress={handleTestDeepLink}
          >
            <Ionicons name="link-outline" size={20} color="#007AFF" />
          </TouchableOpacity> */}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleShareUser}
          >
            <Ionicons name="share-outline" size={20} color="#007AFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleEditUser}
          >
            <Ionicons name="create-outline" size={20} color="#007AFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            {user.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>
                  {getInitials(user.firstname, user.lastname)}
                </Text>
              </View>
            )}
          </View>
          <Text style={styles.userName}>
            {`${user.firstname} ${user.lastname}`}
          </Text>
          <Text style={styles.userHandle}>@{user.username}</Text>
        </View>

        {/* User Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View style={styles.sectionContent}>
            <DetailRow icon="mail-outline" label="Email" value={user.email} />
            <DetailRow icon="call-outline" label="Phone" value={user.phone} />
            <DetailRow icon="location-outline" label="City" value={user.city} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <View style={styles.sectionContent}>
            <DetailRow
              icon="person-outline"
              label="Username"
              value={user.username}
            />
            <DetailRow
              icon="calendar-outline"
              label="Birth Date"
              value={formatDate(user.birthdate)}
            />
            <DetailRow icon="time-outline" label="User ID" value={user.id} />
          </View>
        </View>

        {/* Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actions</Text>
          <View style={styles.sectionContent}>
            <TouchableOpacity
              style={styles.actionButtonLarge}
              onPress={handleShareUser}
            >
              <Ionicons name="share-outline" size={20} color="#007AFF" />
              <Text style={styles.actionButtonText}>Share Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButtonLarge}
              onPress={handleTestDeepLink}
            >
              <Ionicons name="link-outline" size={20} color="#007AFF" />
              <Text style={styles.actionButtonText}>Test Deep Links</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDeleteUser}
            >
              <Ionicons name="trash-outline" size={20} color="#FF3B30" />
              <Text style={styles.deleteButtonText}>Delete User</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <BottomSheetLogin
        isVisible={showLoginSheet}
        onClose={() => setShowLoginSheet(false)}
        title="Login Required"
        message="Please login to manage users"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
    marginTop: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
  },
  headerActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#8E8E93",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FF3B30",
    marginTop: 16,
    marginBottom: 8,
  },
  errorSubtitle: {
    fontSize: 16,
    color: "#8E8E93",
    textAlign: "center",
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: "#FF3B30",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  profileSection: {
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    paddingVertical: 32,
    marginBottom: 16,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  userName: {
    fontSize: 24,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 4,
  },
  userHandle: {
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
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
  },
  detailRowLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  detailIcon: {
    marginRight: 12,
  },
  detailLabel: {
    fontSize: 16,
    color: "#000000",
    flex: 1,
  },
  detailValue: {
    fontSize: 16,
    color: "#8E8E93",
    textAlign: "right",
    flexShrink: 1,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FF3B30",
    marginLeft: 8,
  },
  actionButtonLarge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007AFF",
    marginLeft: 8,
  },
});

export default withAuthProtection(UserDetailsScreen, {
  requireAuth: false,
  blockGuests: true,
  customGuestTitle: "Login Required",
  customGuestMessage: "Please login to view user details",
});
