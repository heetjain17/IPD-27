import { IconMap2 } from '@tabler/icons-react-native';
import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MapScreen() {
  return (
    <SafeAreaView className="flex-1 bg-surface-container-lowest" edges={['top']}>
      <View className="flex-1 items-center justify-center gap-4">
        <IconMap2 size={48} color="#484848" />
        <Text className="font-body text-body-lg text-on-surface-variant">Map — coming soon</Text>
      </View>
    </SafeAreaView>
  );
}
