import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';

import type { ColorScheme } from '@/constants/theme';

const STORAGE_KEY = '@theme';

// ─── Context ────────────────────────────────────────────────────────────────

type ThemeContextValue = {
  colorScheme: ColorScheme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  colorScheme: 'dark',
  toggleTheme: () => {},
});

// ─── Provider ────────────────────────────────────────────────────────────────

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useSystemColorScheme();
  const [colorScheme, setColorScheme] = useState<ColorScheme>(
    systemScheme === 'light' ? 'light' : 'dark',
  );
  const [isReady, setIsReady] = useState(false);

  // Hydrate from AsyncStorage on mount
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (stored === 'light' || stored === 'dark') {
          setColorScheme(stored);
        }
      })
      .finally(() => setIsReady(true));
  }, []);

  const toggleTheme = useCallback(() => {
    setColorScheme((prev) => {
      const next: ColorScheme = prev === 'dark' ? 'light' : 'dark';
      AsyncStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);

  // Don't render children until we've read the stored preference
  if (!isReady) return null;

  return (
    <ThemeContext.Provider value={{ colorScheme, toggleTheme }}>{children}</ThemeContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useAppTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
