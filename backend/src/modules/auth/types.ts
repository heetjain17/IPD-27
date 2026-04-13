export interface RegisterRequest {
  email: string;
  password: string;
  name?: string | undefined;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name?: string;
    createdAt: Date;
  };
  session: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };
}

export interface AuthUser {
  id: string;
  authId: string;
  email: string;
  name?: string;
}
