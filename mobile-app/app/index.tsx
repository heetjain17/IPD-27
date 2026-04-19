import React from 'react';
import { Pressable, View } from 'react-native';

import { Colors } from '@/constants/colors';
import { AppScreen } from '@/components/primitives/AppScreen';
import { AppText } from '@/components/primitives/AppText';
import { useAppTheme } from '@/context/ThemeContext';

export default function HomeScreen() {
  const { colorScheme, toggleTheme } = useAppTheme();
  const palette = Colors[colorScheme];

  return (
    <AppScreen>
      <View className="flex-1 items-center justify-center">
        <View className="w-full max-w-md gap-4 rounded-roundedness-lg bg-surface-container p-6">
          <AppText variant="displayMD">Hello World</AppText>
          <AppText variant="bodyLG" color="muted">
            AppScreen + AppText primitives are working.
          </AppText>
          <AppText variant="titleMD">Title MD — display font</AppText>
          <AppText variant="bodySM" color="muted">
            Body SM — body font
          </AppText>
          <AppText variant="labelSM" color="accent">
            Label SM — accent
          </AppText>

          <Pressable
            onPress={toggleTheme}
            className="mt-2 items-center rounded-roundedness-xl py-3"
            style={{ backgroundColor: palette.primary }}
          >
            <AppText
              variant="bodyLG"
              className="font-semibold"
              style={{ color: palette.onPrimary }}
            >
              Toggle Theme
            </AppText>
          </Pressable>
        </View>
      </View>
    </AppScreen>
  );
}
