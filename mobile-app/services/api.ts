import axios from 'axios';

// ─── Auth bridge ─────────────────────────────────────────────────────────────
// Populated from the auth store in step 7 / root layout so services have no
// direct dependency on the store module (avoids circular imports).

let tokenGetter: (() => string | null) | null = null;
let unauthorizedHandler: (() => void) | null = null;

export function configureApiInterceptors(opts: {
  tokenGetter: () => string | null;
  onUnauthorized: () => void;
}) {
  tokenGetter = opts.tokenGetter;
  unauthorizedHandler = opts.onUnauthorized;
}

// ─── Axios instance ───────────────────────────────────────────────────────────

export const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15_000,
});

// Inject bearer token on every request
apiClient.interceptors.request.use((config) => {
  const token = tokenGetter?.();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally (clear session + redirect to login)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      unauthorizedHandler?.();
    }
    return Promise.reject(error);
  },
);
