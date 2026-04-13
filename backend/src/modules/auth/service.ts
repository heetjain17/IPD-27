import { supabaseAdmin } from '../../lib/supabase.js';
import * as authRepo from './repository.js';
import type { RegisterRequest, LoginRequest, AuthResponse } from './types.js';
import { ApiError } from '../../utils/ApiError.js';

export async function register(data: RegisterRequest): Promise<AuthResponse> {
  // 1. Check if user already exists
  const existingUser = await authRepo.getUserByEmail(data.email);

  if (existingUser) {
    throw new ApiError(409, 'User with this email already exists');
  }

  // 2. Create user in Supabase Auth
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email: data.email,
    password: data.password,
    email_confirm: true, // Auto-confirm email for now
  });

  if (authError || !authData.user) {
    throw new ApiError(400, authError?.message || 'Failed to create auth user');
  }

  // 3. Create profile in public.users table
  const user = await authRepo.createUser({
    authId: authData.user.id,
    email: data.email,
    name: data.name,
  });

  // 4. Sign in to get session tokens
  const { data: sessionData, error: sessionError } = await supabaseAdmin.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if (sessionError || !sessionData.session) {
    throw new ApiError(500, 'Failed to create session');
  }

  return {
    user: {
      id: user.id,
      email: user.email,
      ...(user.name && { name: user.name }),
      createdAt: user.createdAt,
    },
    session: {
      accessToken: sessionData.session.access_token,
      refreshToken: sessionData.session.refresh_token,
      expiresIn: sessionData.session.expires_in || 3600,
    },
  };
}

export async function login(data: LoginRequest): Promise<AuthResponse> {
  // 1. Verify credentials with Supabase Auth
  const { data: authData, error: authError } = await supabaseAdmin.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if (authError || !authData.user || !authData.session) {
    throw new ApiError(401, 'Invalid credentials');
  }

  // 2. Get user profile from public.users
  const user = await authRepo.getUserByAuthId(authData.user.id);

  if (!user) {
    throw new ApiError(404, 'User profile not found');
  }

  return {
    user: {
      id: user.id,
      email: user.email,
      ...(user.name && { name: user.name }),
      createdAt: user.createdAt,
    },
    session: {
      accessToken: authData.session.access_token,
      refreshToken: authData.session.refresh_token,
      expiresIn: authData.session.expires_in || 3600,
    },
  };
}

export async function logout(accessToken: string): Promise<void> {
  const { error } = await supabaseAdmin.auth.admin.signOut(accessToken);

  if (error) {
    throw new ApiError(500, 'Failed to logout');
  }
}

export async function getCurrentUser(authId: string) {
  const user = await authRepo.getUserByAuthId(authId);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  return {
    id: user.id,
    email: user.email,
    ...(user.name && { name: user.name }),
    createdAt: user.createdAt,
  };
}

export async function refreshSession(refreshToken: string): Promise<AuthResponse> {
  // Use Supabase to refresh the session
  const { data, error } = await supabaseAdmin.auth.refreshSession({
    refresh_token: refreshToken,
  });

  if (error || !data.session || !data.user) {
    throw new ApiError(401, 'Invalid or expired refresh token');
  }

  // Get user profile
  const user = await authRepo.getUserByAuthId(data.user.id);

  if (!user) {
    throw new ApiError(404, 'User profile not found');
  }

  return {
    user: {
      id: user.id,
      email: user.email,
      ...(user.name && { name: user.name }),
      createdAt: user.createdAt,
    },
    session: {
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      expiresIn: data.session.expires_in || 3600,
    },
  };
}
