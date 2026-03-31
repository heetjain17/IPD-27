import { IconSearch } from '@tabler/icons-react-native';
import React from 'react';
import { Text, View } from 'react-native';

import { ScreenWrapper } from '@/components/shared/ScreenWrapper';

export default function SearchScreen() {
  return (
    <ScreenWrapper>
      <View className="flex-1 items-center justify-center gap-4">
        <IconSearch size={48} color="#484848" />
        <Text className="font-body text-body-lg text-on-surface-variant">Search — coming soon</Text>
      </View>
    </ScreenWrapper>
  );
}
