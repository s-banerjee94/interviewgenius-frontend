// Enums matching backend
export enum Experience {
  FRESHER = 'FRESHER',
  INTERMEDIATE = 'INTERMEDIATE',
  EXPERIENCED = 'EXPERIENCED'
}

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

// GET /users/{id} - Response
export interface UserResponse {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  experience: Experience;
  role: Role;
  isActive: boolean;
  isVerified: boolean;
  phoneNumber?: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  profileImageUrl?: string;
  authProviders: string[];
  skills?: string[]; // Array of skill names
}

// PUT /users/{id} - Request Body
export interface UpdateUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  password?: string; // Optional for updates, required for creation
  experience?: Experience;
  role?: Role;
  phoneNumber?: string;
}

// PATCH /users/{id}/change-password - Request Body
export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

// Error Response
export interface ErrorResponse {
  status: number;
  error: string;
  message: string;
  path: string;
  timestamp: string;
}
