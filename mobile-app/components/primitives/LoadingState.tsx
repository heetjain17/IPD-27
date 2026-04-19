import React from 'react';
import { ActivityIndicator, View } from 'react-native';

import { Colors } from '@/constants/colors';
import { useAppTheme } from '@/context/ThemeContext';
import { AppText } from './AppText';

interface LoadingStateProps {
  label?: string;
  fullScreen?: boolean;
}

export function LoadingState({ label, fullScreen = false }: LoadingStateProps) {
  const { colorScheme } = useAppTheme();
  const palette = Colors[colorScheme];

  return (
    <View className={`items-center justify-center gap-3 ${fullScreen ? 'flex-1' : 'py-12'}`}>
      <ActivityIndicator size="large" color={palette.primary} />
      {label && (
        <AppText variant="bodySM" color="muted">
          {label}
        </AppText>
      )}
    </View>
  );
}
