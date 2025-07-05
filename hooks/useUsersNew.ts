import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useEffect, useState } from "react";

import {
  apiService,
  CreateUserData,
  GetUsersParams,
  UpdateUserData,
} from "@/services/api";

// Query keys
export const USERS_QUERY_KEY = "users";
export const USER_QUERY_KEY = "user";

// Hook for fetching users with infinite scroll and search
export const useUsers = (searchTerm: string = "") => {
  return useInfiniteQuery({
    queryKey: [USERS_QUERY_KEY, searchTerm],
    queryFn: async ({ pageParam = 1 }) => {
      const params: GetUsersParams = {
        page: pageParam,
        limit: 10,
        search: searchTerm || undefined,
      };
      return apiService.getUsers(params);
    },
    getNextPageParam: (lastPage, allPages) => {
      // If we got less than the limit, we've reached the end
      if (lastPage.length < 10) {
        return undefined;
      }
      return allPages.length + 1;
    },
    initialPageParam: 1,
  });
};

// Hook for fetching a single user
export const useUser = (id: string) => {
  return useQuery({
    queryKey: [USER_QUERY_KEY, id],
    queryFn: () => apiService.getUserById(id),
    enabled: !!id,
  });
};

// Hook for creating a user
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: CreateUserData) => apiService.createUser(userData),
    onSuccess: () => {
      // Invalidate and refetch users query
      queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] });
    },
  });
};

// Hook for updating a user
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: UpdateUserData) => apiService.updateUser(userData),
    onSuccess: (data) => {
      // Update the specific user in cache
      queryClient.setQueryData([USER_QUERY_KEY, data.id], data);
      // Invalidate users list to refresh
      queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] });
    },
  });
};

// Hook for deleting a user
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiService.deleteUser(id),
    onSuccess: () => {
      // Invalidate and refetch users query
      queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] });
    },
  });
};

// Hook for search functionality with debouncing
export const useUsersSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const usersQuery = useUsers(debouncedSearchTerm);

  return {
    searchTerm,
    setSearchTerm,
    debouncedSearchTerm,
    ...usersQuery,
  };
};
