import type { ApiSuccess, AuthResponse, User } from '@/types/api';

import { apiClient } from './api';

export async function register(
  email: string,
  password: string,
  name?: string,
): Promise<AuthResponse> {
  const { data } = await apiClient.post<ApiSuccess<AuthResponse>>('/api/v1/auth/register', {
    email,
    password,
    name,
  });
  return data.data;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const { data } = await apiClient.post<ApiSuccess<AuthResponse>>('/api/v1/auth/login', {
    email,
    password,
  });
  return data.data;
}

export async function logout(): Promise<void> {
  await apiClient.post('/api/v1/auth/logout');
}

export async function me(): Promise<User> {
  const { data } = await apiClient.get<ApiSuccess<User>>('/api/v1/auth/me');
  return data.data;
}

export async function refresh(refreshToken: string): Promise<AuthResponse> {
  const { data } = await apiClient.post<ApiSuccess<AuthResponse>>('/api/v1/auth/refresh', {
    refreshToken,
  });
  return data.data;
}
