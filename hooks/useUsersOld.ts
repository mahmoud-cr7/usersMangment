import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  department?: string;
  joinDate?: string;
  status?: string;
}

// Mock API functions
const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "Admin",
    phone: "+1 (555) 123-4567",
    department: "Engineering",
    joinDate: "2023-01-15",
    status: "Active",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "User",
    phone: "+1 (555) 234-5678",
    department: "Marketing",
    joinDate: "2023-02-01",
    status: "Active",
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "User",
    phone: "+1 (555) 345-6789",
    department: "Sales",
    joinDate: "2023-03-10",
    status: "Active",
  },
];

const fetchUsers = async (): Promise<User[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockUsers;
};

const fetchUser = async (userId: string): Promise<User | null> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockUsers.find((user) => user.id === userId) || null;
};

const createUser = async (user: Omit<User, "id">): Promise<User> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  const newUser: User = {
    ...user,
    id: (mockUsers.length + 1).toString(),
  };
  mockUsers.push(newUser);
  return newUser;
};

const updateUser = async (
  userId: string,
  userData: Partial<User>
): Promise<User> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  const userIndex = mockUsers.findIndex((user) => user.id === userId);
  if (userIndex === -1) {
    throw new Error("User not found");
  }
  mockUsers[userIndex] = { ...mockUsers[userIndex], ...userData };
  return mockUsers[userIndex];
};

const deleteUser = async (userId: string): Promise<void> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  const userIndex = mockUsers.findIndex((user) => user.id === userId);
  if (userIndex === -1) {
    throw new Error("User not found");
  }
  mockUsers.splice(userIndex, 1);
};

// React Query hooks
export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });
};

export const useUser = (userId: string) => {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => fetchUser(userId),
    enabled: !!userId,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      userData,
    }: {
      userId: string;
      userData: Partial<User>;
    }) => updateUser(userId, userData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", data.id] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
