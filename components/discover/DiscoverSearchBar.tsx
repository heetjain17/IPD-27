import React from 'react';
import { View } from 'react-native';

import { AppSearchBar } from '@/components/shared/AppSearchBar';
import { useAppTheme } from '@/context/ThemeContext';

type Props = {
  value?: string;
  onChangeText?: (text: string) => void;
  onFilterPress?: () => void;
  onNotificationPress?: () => void;
};

export function DiscoverSearchBar({
  value,
  onChangeText,
  onFilterPress,
  onNotificationPress,
}: Props) {
  const { colorScheme } = useAppTheme();
  const isDark = colorScheme === 'dark';

  return (
    <View className={`px-5 pb-3 pt-4 ${isDark ? 'bg-surface' : 'bg-light-surface'}`}>
      <AppSearchBar
        value={value}
        onChangeText={onChangeText}
        onFilterPress={onFilterPress}
        notification={{ unread: true }}
        onNotificationPress={onNotificationPress}
        variant="solid"
      />
    </View>
  );
}
