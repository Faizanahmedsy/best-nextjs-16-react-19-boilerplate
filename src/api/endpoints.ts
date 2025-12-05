export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    REFRESH: "/auth/refresh",
    LOGOUT: "/auth/logout",
  },
  USERS: {
    LIST: "/users",
    DETAIL: (id: string) => `/users/${id}`, // Helper function for dynamic IDs
  },
} as const;
