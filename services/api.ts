const BASE_URL = "https://6866898389803950dbb31076.mockapi.io/task";

export interface User {
  id: string;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  avatar?: string;
  city: string;
  phone: string;
  birthdate: string;
}

export interface UsersResponse {
  data: User[];
  total: number;
  page: number;
  limit: number;
}

export interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface CreateUserData {
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  city?: string;
  phone?: string;
  avatar?: string;
}

export interface UpdateUserData extends CreateUserData {
  id: string;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${BASE_URL}${endpoint}`;

    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const error = new Error(`HTTP error! status: ${response.status}`);
        (error as any).status = response.status;
        throw error;
      }

      return await response.json();
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  async getUsers(params: GetUsersParams = {}): Promise<User[]> {
    const { page = 1, limit = 10, search } = params;

    let endpoint = `?page=${page}&limit=${limit}`;
    if (search) {
      endpoint += `&search=${encodeURIComponent(search)}`;
    }

    try {
      return await this.request<User[]>(endpoint);
    } catch (error) {
      // If search returns no results, MockAPI returns 404
      // Return empty array for search queries that find no results
      if (search && error instanceof Error && (error as any).status === 404) {
        console.log("Search returned no results (404), returning empty array");
        return [];
      }

      // For other search-related errors, also return empty array
      if (search && error instanceof Error) {
        console.log("Search error, returning empty array:", error.message);
        return [];
      }

      // For non-search queries, propagate the error
      throw error;
    }
  }

  async getUserById(id: string): Promise<User> {
    return this.request<User>(`/${id}`);
  }

  async createUser(userData: CreateUserData): Promise<User> {
    return this.request<User>("", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async updateUser(userData: UpdateUserData): Promise<User> {
    const { id, ...data } = userData;
    return this.request<User>(`/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteUser(id: string): Promise<void> {
    await this.request<void>(`/${id}`, {
      method: "DELETE",
    });
  }
}

export const apiService = new ApiService();
