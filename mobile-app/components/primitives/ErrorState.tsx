import { IconAlertTriangle } from '@tabler/icons-react-native';
import React from 'react';
import { View } from 'react-native';

import { AppButton } from './AppButton';
import { AppIcon } from './AppIcon';
import { AppText } from './AppText';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  fullScreen?: boolean;
}

export function ErrorState({
  title = 'Something went wrong',
  message,
  onRetry,
  fullScreen = false,
}: ErrorStateProps) {
  return (
    <View className={`items-center justify-center gap-4 px-6 ${fullScreen ? 'flex-1' : 'py-12'}`}>
      <AppIcon Icon={IconAlertTriangle} size="lg" color="error" />
      <View className="items-center gap-1">
        <AppText variant="titleMD" className="text-center">
          {title}
        </AppText>
        <AppText variant="bodySM" color="muted" className="text-center">
          {message}
        </AppText>
      </View>
      {onRetry && (
        <AppButton variant="secondary" size="sm" onPress={onRetry}>
          Try again
        </AppButton>
      )}
    </View>
  );
}
