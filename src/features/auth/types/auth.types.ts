export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface LoginData {
  accessToken: string;
  refreshToken: string;
  user: User;
}
