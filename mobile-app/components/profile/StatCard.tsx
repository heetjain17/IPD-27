import React from 'react';
import { Text, View } from 'react-native';

export function StatCard({ value, label }: { value: string | number; label: string }) {
  return (
    <View className="border-outline-variant/10 flex-1 items-center justify-center rounded-2xl border bg-surface-container-low py-3">
      <Text className="font-display text-title-lg font-bold text-on-surface">{value}</Text>
      <Text className="text-label-md mt-0.5 font-body text-on-surface-variant">{label}</Text>
    </View>
  );
}
