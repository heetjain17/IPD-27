import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavThemeProvider,
} from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import '../global.css';

import { ThemeProvider, useAppTheme } from '@/context/ThemeContext';

/**
 * Inner layout — reads theme from context and applies the `dark` class to the
 * root View, which activates all NativeWind `dark:` variants app-wide.
 */
function RootLayoutInner() {
  const { colorScheme } = useAppTheme();
  const isDark = colorScheme === 'dark';

  return (
    <NavThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      {/* This View's className controls NativeWind dark-mode for the whole tree */}
      <View className={`flex-1 ${isDark ? 'dark' : ''}`}>
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
      <ThemeProvider>
        <RootLayoutInner />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
