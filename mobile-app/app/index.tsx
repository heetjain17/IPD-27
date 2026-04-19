import React from 'react';
import { Pressable, SafeAreaView, Text, View } from 'react-native';

import { Colors } from '@/constants/colors';
import { useAppTheme } from '@/context/ThemeContext';

export default function HomeScreen() {
  const { colorScheme, toggleTheme } = useAppTheme();
  const palette = Colors[colorScheme];

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center px-6">
        <View className="w-full max-w-md rounded-roundedness-lg bg-surface-container p-6">
          <Text className="mb-2 font-display text-display-md text-on-surface">Hello World</Text>
          <Text className="mb-6 font-body text-body-lg text-on-surface-variant">
            Your app shell is running with centralized theme tokens.
          </Text>

          <Pressable
            onPress={toggleTheme}
            className="items-center rounded-roundedness-xl py-3"
            style={{ backgroundColor: palette.primary }}
          >
            <Text
              className="font-body text-body-lg font-semibold"
              style={{ color: palette.onPrimary }}
            >
              Toggle Theme
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
