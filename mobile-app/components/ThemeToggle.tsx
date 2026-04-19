import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable } from 'react-native';

import { Colors } from '@/constants/colors';
import { useAppTheme } from '@/context/ThemeContext';

/**
 * A sun/moon toggle button styled with the Luminescent Curator design tokens.
 * Drop this anywhere in the UI to expose the light/dark mode switch.
 *
 * Usage:
 *   import { ThemeToggle } from '@/components/ThemeToggle';
 *   <ThemeToggle />
 */
export function ThemeToggle() {
  const { colorScheme, toggleTheme } = useAppTheme();
  const isDark = colorScheme === 'dark';
  const theme = Colors[colorScheme];

  return (
    <Pressable
      onPress={toggleTheme}
      className={`bg-surface-container-highest h-8 w-14 items-center justify-center rounded-full p-1 transition-colors duration-300`}
      accessibilityRole="button"
      accessibilityLabel={'Switch mode'}
    >
      <Ionicons name={isDark ? 'sunny-outline' : 'moon-outline'} size={22} color={theme.primary} />
    </Pressable>
  );
}
