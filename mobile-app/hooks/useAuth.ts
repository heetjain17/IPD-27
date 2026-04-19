import { useMutation, useQueryClient } from '@tanstack/react-query';

import * as authService from '@/services/auth';
import { useAuthStore } from '@/store/authStore';

export function useLogin() {
  const setSession = useAuthStore((s) => s.setSession);

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authService.login(email, password),
    onSuccess: async (data) => {
      await setSession(data);
    },
  });
}

export function useRegister() {
  const setSession = useAuthStore((s) => s.setSession);

  return useMutation({
    mutationFn: ({ email, password, name }: { email: string; password: string; name?: string }) =>
      authService.register(email, password, name),
    onSuccess: async (data) => {
      await setSession(data);
    },
  });
}

export function useLogout() {
  const clearSession = useAuthStore((s) => s.clearSession);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSettled: async () => {
      await clearSession();
      queryClient.clear();
    },
  });
}
