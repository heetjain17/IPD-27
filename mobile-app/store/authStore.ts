import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

import { configureApiInterceptors } from '@/services/api';
import type { Session, User } from '@/types/api';

const KEYS = {
  accessToken: '@auth/accessToken',
  refreshToken: '@auth/refreshToken',
  user: '@auth/user',
} as const;

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
}

interface AuthActions {
  setSession: (payload: { user: User; session: Session }) => Promise<void>;
  clearSession: () => Promise<void>;
  hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthState & AuthActions>()((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isHydrated: false,

  setSession: async ({ user, session }) => {
    await Promise.all([
      AsyncStorage.setItem(KEYS.accessToken, session.accessToken),
      AsyncStorage.setItem(KEYS.refreshToken, session.refreshToken),
      AsyncStorage.setItem(KEYS.user, JSON.stringify(user)),
    ]);
    set({
      user,
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
      isAuthenticated: true,
    });
  },

  clearSession: async () => {
    await Promise.all([
      AsyncStorage.removeItem(KEYS.accessToken),
      AsyncStorage.removeItem(KEYS.refreshToken),
      AsyncStorage.removeItem(KEYS.user),
    ]);
    set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
  },

  hydrate: async () => {
    try {
      const [accessToken, refreshToken, userJson] = await Promise.all([
        AsyncStorage.getItem(KEYS.accessToken),
        AsyncStorage.getItem(KEYS.refreshToken),
        AsyncStorage.getItem(KEYS.user),
      ]);
      const user = userJson ? (JSON.parse(userJson) as User) : null;
      set({
        accessToken,
        refreshToken,
        user,
        isAuthenticated: !!accessToken && !!user,
        isHydrated: true,
      });
    } catch {
      set({ isHydrated: true });
    }
  },
}));

// Wire Axios interceptors to the store singleton at module load time.
// One-way dependency: store → services/api (no cycle).
configureApiInterceptors({
  tokenGetter: () => useAuthStore.getState().accessToken,
  onUnauthorized: () => void useAuthStore.getState().clearSession(),
});
