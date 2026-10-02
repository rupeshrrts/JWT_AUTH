import api from '@/lib/api';
import { ApiResponse, LoginInput, RegisterInput, User } from '@/types/auth';

export const authService = {
  async register(data: Omit<RegisterInput, 'confirmPassword'>): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/auth/register', data);
    return response.data;
  },

  async login(data: LoginInput): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/auth/login', data);
    return response.data;
  },

  async getMe(): Promise<ApiResponse<User>> {
    const response = await api.get<ApiResponse<User>>('/auth/me');
    return response.data;
  },

  async logout(): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/auth/logout');
    return response.data;
  },
};
