import React from 'react';
import { Keyboard, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppTheme } from '@/context/ThemeContext';

type Props = {
  children: React.ReactNode;
};

/**
 * Centralized screen root:
 * - SafeAreaView with top + bottom edges
 * - Tapping outside any input dismisses the keyboard
 * - Dark/light background from design tokens
 *
 * Uses TouchableWithoutFeedback so child touch events are NOT consumed.
 */
export function ScreenWrapper({ children }: Props) {
  const { colorScheme } = useAppTheme();
  const isDark = colorScheme === 'dark';

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView
        edges={['top', 'bottom']}
        style={[styles.root, { backgroundColor: isDark ? '#000000' : '#ffffff' }]}
      >
        <View style={styles.fill}>{children}</View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  fill: { flex: 1 },
});
