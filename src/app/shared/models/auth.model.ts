export interface SignupRequest {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export interface SignupResponse {
  message?: string;
  userId?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  authProviders: string[];
  oauthProviderIds: { [key: string]: string };
  role: string;
  isActive: boolean;
  isVerified: boolean;
}

export interface LoginResponse {
  token: string;
  tokenType: string;
  expiresIn: number;
}