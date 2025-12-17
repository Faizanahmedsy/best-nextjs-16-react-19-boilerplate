export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    REFRESH: "/auth/refresh",
    LOGOUT: "/auth/logout",
  },
  USERS: {
    LIST: "/users",
    CREATE: "/users",
    DETAIL: (id: string) => `/users/${id}`,
  },
} as const;
