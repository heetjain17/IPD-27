import {
  DarkTheme,
  DefaultTheme,
  type Theme as NavigationTheme,
  ThemeProvider as NavThemeProvider,
} from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { vars } from 'nativewind';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import '../global.css';

import { Colors, type ColorScheme } from '@/constants/colors';
import { ThemeProvider, useAppTheme } from '@/context/ThemeContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function buildVars(scheme: ColorScheme) {
  const palette = Colors[scheme];
  const entries = (Object.entries(palette) as [string, string][]).map(([key, value]) => {
    const varName = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}` as `--${string}`;
    return [varName, value] as const;
  });
  return vars(Object.fromEntries(entries) as Record<`--${string}`, string>);
}

const themeVars: Record<ColorScheme, ReturnType<typeof vars>> = {
  dark: buildVars('dark'),
  light: buildVars('light'),
};

/**
 * Inner layout — reads theme from context and applies the `dark` class to the
 * root View, which activates all NativeWind `dark:` variants app-wide.
 */
function RootLayoutInner() {
  const { colorScheme } = useAppTheme();
  const isDark = colorScheme === 'dark';
  const palette = Colors[colorScheme];
  const navigationTheme: NavigationTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      primary: palette.primary,
      background: palette.background,
      card: palette.surface,
      text: palette.onSurface,
      border: palette.outline,
      notification: palette.error,
    },
  };

  return (
    <NavThemeProvider value={navigationTheme}>
      {/* This View's className controls NativeWind dark-mode for the whole tree */}
      <View className={`flex-1 ${isDark ? 'dark' : ''}`} style={themeVars[colorScheme]}>
        <Stack screenOptions={{ headerShown: false }} />
        <StatusBar style={isDark ? 'light' : 'dark'} />
      </View>
    </NavThemeProvider>
  );
}

/**
 * Root layout — wraps the entire app in ThemeProvider so any descendant
 * can call useAppTheme() or use dark: Tailwind variants via NativeWind.
 */
export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <RootLayoutInner />
        </ThemeProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
