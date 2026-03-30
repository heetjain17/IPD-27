import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable } from 'react-native';

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

  return (
    <Pressable
      onPress={toggleTheme}
      className={[
        'items-center justify-center rounded-roundedness-full p-3',
        isDark ? 'bg-surface-container-highest' : 'bg-light-surface-container-highest',
      ].join(' ')}
      accessibilityRole="button"
      accessibilityLabel={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <Ionicons
        name={isDark ? 'sunny-outline' : 'moon-outline'}
        size={22}
        color={isDark ? '#d7fd4e' : '#a6c913'}
      />
    </Pressable>
  );
}
