export interface User {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  token?: string;
  user?: T;
  data?: T;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

// Aliases for versatility
export type RegisterCredentials = RegisterInput;
export type LoginCredentials = LoginInput;
