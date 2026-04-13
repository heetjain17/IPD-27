import React from 'react';
import { View } from 'react-native';

import { AppSearchBar } from '@/components/shared/AppSearchBar';

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
  return (
    <View className="bg-surface px-5 pb-3 pt-4">
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
