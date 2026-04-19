import { IconMoodEmpty } from '@tabler/icons-react-native';
import React from 'react';
import { View } from 'react-native';

import type { TablerIconProps } from './AppIcon';
import { AppButton } from './AppButton';
import { AppIcon } from './AppIcon';
import { AppText } from './AppText';

interface EmptyStateAction {
  label: string;
  onPress: () => void;
}

interface EmptyStateProps {
  title: string;
  message?: string;
  icon?: React.ComponentType<TablerIconProps>;
  action?: EmptyStateAction;
  fullScreen?: boolean;
}

export function EmptyState({
  title,
  message,
  icon: Icon = IconMoodEmpty,
  action,
  fullScreen = false,
}: EmptyStateProps) {
  return (
    <View className={`items-center justify-center gap-4 px-6 ${fullScreen ? 'flex-1' : 'py-12'}`}>
      <AppIcon Icon={Icon} size="lg" color="muted" />
      <View className="items-center gap-1">
        <AppText variant="titleMD" className="text-center">
          {title}
        </AppText>
        {message && (
          <AppText variant="bodySM" color="muted" className="text-center">
            {message}
          </AppText>
        )}
      </View>
      {action && (
        <AppButton variant="secondary" size="sm" onPress={action.onPress}>
          {action.label}
        </AppButton>
      )}
    </View>
  );
}
