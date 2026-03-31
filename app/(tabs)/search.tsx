import { IconSearch } from '@tabler/icons-react-native';
import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SearchScreen() {
  return (
    <SafeAreaView className="flex-1 bg-surface-container-lowest" edges={['top']}>
      <View className="flex-1 items-center justify-center gap-4">
        <IconSearch size={48} color="#484848" />
        <Text className="font-body text-body-lg text-on-surface-variant">Search — coming soon</Text>
      </View>
    </SafeAreaView>
  );
}
