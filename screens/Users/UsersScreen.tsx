import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useCallback, useLayoutEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import BottomSheetLogin from "@/components/BottomSheetLogin";
import UserCard from "@/components/UserCard";
import withAuthProtection from "@/hoc/withAuthProtection";
import { useAuth } from "@/hooks/useAuth";
import { useDeleteUser, User, useUsersSearch } from "@/hooks/useUsers";
import { UsersStackParamList } from "../../navigation/UsersStackNavigator";

type UsersScreenNavigationProp = NativeStackNavigationProp<
  UsersStackParamList,
  "UsersList"
>;

const UsersScreen: React.FC = () => {
  const navigation = useNavigation<UsersScreenNavigationProp>();
  const { isGuest } = useAuth();
  const [showLoginSheet, setShowLoginSheet] = useState(false);

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
    searchTerm,
    setSearchTerm,
  } = useUsersSearch();

  const deleteUserMutation = useDeleteUser();

  const handleUserPress = (userId: string) => {
    navigation.navigate("UserDetails", { userId });
  };

  const handleAddUser = useCallback(() => {
    if (isGuest) {
      setShowLoginSheet(true);
      return;
    }
    navigation.navigate("AddEditUser", {});
  }, [isGuest, navigation, setShowLoginSheet]);

  // Set the header button
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity style={{ padding: 8 }} onPress={handleAddUser}>
          <Ionicons name="add" size={24} color="#007AFF" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, handleAddUser]);

  const handleEditUser = (user: User) => {
    if (isGuest) {
      setShowLoginSheet(true);
      return;
    }
    navigation.navigate("AddEditUser", { userId: user.id });
  };

  const handleDeleteUser = async (userId: string) => {
    if (isGuest) {
      setShowLoginSheet(true);
      return;
    }
    try {
      await deleteUserMutation.mutateAsync(userId);
      // Toast notification is now handled in the hook
    } catch {
      // Error toast is now handled in the hook
    }
  };

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const handleRefresh = () => {
    refetch();
  };

  // Flatten the pages data for FlatList and remove duplicates
  const allUsers = React.useMemo(() => {
    const flatUsers = data?.pages.flat() ?? [];
    // Remove duplicates based on user ID
    const uniqueUsers = flatUsers.filter(
      (user, index, self) => index === self.findIndex((u) => u.id === user.id)
    );
    return uniqueUsers;
  }, [data?.pages]);

  const renderUserItem = ({ item }: { item: User }) => (
    <UserCard
      user={item}
      onPress={() => handleUserPress(item.id)}
      onEdit={() => handleEditUser(item)}
      onDelete={() => handleDeleteUser(item.id)}
      onGuestRestriction={() => setShowLoginSheet(true)}
      isGuest={isGuest}
    />
  );

  const renderLoadingFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="small" color="#007AFF" />
      </View>
    );
  };

  const renderEmptyState = () => {
    if (isLoading) return null;

    return (
      <View style={styles.emptyState}>
        <Ionicons
          name={searchTerm ? "search-outline" : "people-outline"}
          size={64}
          color="#8E8E93"
        />
        <Text style={styles.emptyStateTitle}>
          {searchTerm ? "No users found" : "No users yet"}
        </Text>
        <Text style={styles.emptyStateSubtitle}>
          {searchTerm
            ? `No users match "${searchTerm}". Try a different search term.`
            : "Add your first user to get started"}
        </Text>
        {searchTerm ? (
          <TouchableOpacity
            style={styles.emptyStateButton}
            onPress={() => setSearchTerm("")}
          >
            <Text style={styles.emptyStateButtonText}>Clear Search</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.emptyStateButton}
            onPress={handleAddUser}
          >
            <Text style={styles.emptyStateButtonText}>Add User</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  if (isError) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorState}>
          <Ionicons name="alert-circle-outline" size={64} color="#FF3B30" />
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorSubtitle}>Failed to load users</Text>
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons
            name="search"
            size={20}
            color="#8E8E93"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search users..."
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholderTextColor="#8E8E93"
          />
          {searchTerm.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => setSearchTerm("")}
            >
              <Ionicons name="close-circle" size={20} color="#8E8E93" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading users...</Text>
        </View>
      ) : (
        <FlatList
          data={allUsers}
          renderItem={renderUserItem}
          keyExtractor={(item) => item.id}
          style={styles.list}
          contentContainerStyle={
            allUsers.length === 0 ? styles.emptyListContent : undefined
          }
          showsVerticalScrollIndicator={false}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.1}
          ListFooterComponent={renderLoadingFooter}
          ListEmptyComponent={renderEmptyState}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={handleRefresh}
              colors={["#007AFF"]}
              tintColor="#007AFF"
            />
          }
        />
      )}

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
    marginTop: 0, // Ensure no margin at the top
  },
  searchContainer: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F7",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#000000",
    paddingVertical: 4,
  },
  clearButton: {
    padding: 4,
  },
  list: {
    flex: 1,
    paddingTop: 16,
  },
  emptyListContent: {
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#8E8E93",
  },
  loadingFooter: {
    paddingVertical: 20,
    alignItems: "center",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000000",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: "#8E8E93",
    textAlign: "center",
    marginBottom: 24,
  },
  emptyStateButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  errorState: {
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
});

export default withAuthProtection(UsersScreen, {
  requireAuth: false,
  blockGuests: false, // Allow guests to see the users list
});
