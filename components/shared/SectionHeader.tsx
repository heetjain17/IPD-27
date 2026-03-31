import { IconChevronRight } from '@tabler/icons-react-native';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

type Props = {
  title: string;
  subtitle?: string;
  onSeeAll?: () => void;
};

export function SectionHeader({ title, subtitle, onSeeAll }: Props) {
  return (
    <View className="mb-5 flex-row items-end justify-between">
      <View className="mr-4 flex-1">
        <Text className="font-display text-title-lg font-bold text-on-surface">{title}</Text>
        {subtitle && (
          <Text className="mt-1 font-body text-body-sm text-on-surface-variant">{subtitle}</Text>
        )}
      </View>
      {onSeeAll && (
        <Pressable onPress={onSeeAll} className="flex-row items-center gap-1">
          <Text className="font-body text-label-sm font-bold uppercase tracking-widest text-primary">
            See All
          </Text>
          <IconChevronRight size={14} color="#d7fd4e" />
        </Pressable>
      )}
    </View>
  );
}
