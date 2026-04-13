import type { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: {
    authId: string;
    email: string;
  };
}
