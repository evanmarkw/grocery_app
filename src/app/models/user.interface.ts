export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  STORE_MANAGER = 'STORE_MANAGER',
  ADMIN = 'ADMIN'
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: UserRole;
  active: boolean;
  emailVerified: boolean;
  notificationsEnabled: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  token: string;
  message?: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role?: UserRole;
}
