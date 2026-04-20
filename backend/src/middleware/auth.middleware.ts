import type { Request, Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from '../types/auth.js';
import { supabaseAdmin } from '../lib/supabase.js';
import { ApiError } from '../utils/ApiError.js';

export async function optionalAuthMiddleware(req: Request, _res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    let token: string | undefined;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.replace('Bearer ', '');
    } else if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    if (token) {
      const { data, error } = await supabaseAdmin.auth.getUser(token);
      if (!error && data.user) {
        (req as AuthenticatedRequest).user = {
          authId: data.user.id,
          email: data.user.email!,
        };
      }
    }
  } catch {
    // Silently ignore — optional auth must never block the request
  }
  next();
}

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    // Check for token in Authorization header or cookie
    let token: string | undefined;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.replace('Bearer ', '');
    } else if (req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      throw new ApiError(401, 'No token provided');
    }

    // Verify JWT with Supabase
    const { data, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !data.user) {
      throw new ApiError(401, 'Invalid or expired token');
    }

    // Attach user to request
    (req as AuthenticatedRequest).user = {
      authId: data.user.id, // Supabase user ID
      email: data.user.email!,
    };

    next();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(401, 'Authentication failed');
  }
}
