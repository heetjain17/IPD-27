import type { Request, Response } from 'express';
import * as authService from './service.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import type { RegisterInput, LoginInput } from './schema.js';
import type { AuthenticatedRequest } from '../../types/auth.js';
import { getEnv } from '../../utils/getEnv.js';
import { ApiError } from '../../utils/ApiError.js';
import { apiSuccess } from '../../utils/apiSuccess.js';

export const register = asyncHandler(
  async (req: Request<object, object, RegisterInput>, res: Response) => {
    const result = await authService.register(req.body);

    // Set access token in HTTP-only cookie
    res.cookie('accessToken', result.session.accessToken, {
      httpOnly: true,
      secure: getEnv('NODE_ENV') === 'production' || getEnv('NODE_ENV') === 'development',
      sameSite: 'strict',
      maxAge: result.session.expiresIn * 1000, // Convert to milliseconds
    });

    // Set refresh token in HTTP-only cookie (longer expiry)
    res.cookie('refreshToken', result.session.refreshToken, {
      httpOnly: true,
      secure: getEnv('NODE_ENV') === 'production' || getEnv('NODE_ENV') === 'development',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      path: '/api/v1/auth/refresh', // Only sent to refresh endpoint
    });

    return res.status(201).json(apiSuccess(201, 'User registered successfully', result));
  },
);

export const login = asyncHandler(
  async (req: Request<object, object, LoginInput>, res: Response) => {
    const result = await authService.login(req.body);

    // Set access token in HTTP-only cookie
    res.cookie('accessToken', result.session.accessToken, {
      httpOnly: true,
      secure: getEnv('NODE_ENV') === 'production' || getEnv('NODE_ENV') === 'development',
      sameSite: 'strict',
      maxAge: result.session.expiresIn * 1000, // Convert to milliseconds
    });

    // Set refresh token in HTTP-only cookie (longer expiry)
    res.cookie('refreshToken', result.session.refreshToken, {
      httpOnly: true,
      secure: getEnv('NODE_ENV') === 'production' || getEnv('NODE_ENV') === 'development',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      path: '/api/v1/auth/refresh', // Only sent to refresh endpoint
    });

    return res.json(apiSuccess(200, 'Login successful', result));
  },
);

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const token = req.headers.authorization?.replace('Bearer ', '') || req.cookies.accessToken;

  if (!token) {
    throw new ApiError(401, 'No token provided');
  }

  await authService.logout(token);

  // Clear both cookies
  res.clearCookie('accessToken', {
    httpOnly: true,
    secure: getEnv('NODE_ENV') === 'production' || getEnv('NODE_ENV') === 'development',
    sameSite: 'strict',
  });

  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: getEnv('NODE_ENV') === 'production' || getEnv('NODE_ENV') === 'development',
    sameSite: 'strict',
    path: '/api/v1/auth/refresh',
  });

  return res.json(apiSuccess(200, 'Logged out successfully'));
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  // req.user is set by auth middleware
  const authId = (req as AuthenticatedRequest).user?.authId;

  if (!authId) {
    throw new ApiError(401, 'Not authenticated');
  }

  const user = await authService.getCurrentUser(authId);

  return res.json(apiSuccess(200, 'User retrieved successfully', user));
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw new ApiError(401, 'No refresh token provided');
  }

  const result = await authService.refreshSession(refreshToken);

  // Set new access token in cookie
  res.cookie('accessToken', result.session.accessToken, {
    httpOnly: true,
    secure: getEnv('NODE_ENV') === 'production' || getEnv('NODE_ENV') === 'development',
    sameSite: 'strict',
    maxAge: result.session.expiresIn * 1000,
  });

  // Set new refresh token in cookie
  res.cookie('refreshToken', result.session.refreshToken, {
    httpOnly: true,
    secure: getEnv('NODE_ENV') === 'production' || getEnv('NODE_ENV') === 'development',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    path: '/api/v1/auth/refresh',
  });

  return res.json(apiSuccess(200, 'Token refreshed successfully', result));
});
