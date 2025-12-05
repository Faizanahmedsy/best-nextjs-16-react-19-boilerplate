export interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
  phone: string;
  isActive: boolean;
}

export interface LoginData {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  refreshExpiresIn: number;
  user: User;
}
