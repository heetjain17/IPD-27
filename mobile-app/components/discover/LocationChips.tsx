import { IconMapPin } from '@tabler/icons-react-native';
import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

type Props = {
  locations: string[];
  activeIndex?: number;
  onSelect?: (index: number) => void;
};

export function LocationChips({ locations, activeIndex, onSelect }: Props) {
  const onSurfaceVariant = useThemeColor({}, 'onSurfaceVariant');

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 10, paddingRight: 8 }}
    >
      {locations.map((loc, i) => {
        const active = activeIndex === i;
        return (
          <Pressable
            key={loc}
            onPress={() => onSelect?.(i)}
            className={`flex-row items-center gap-2 rounded-roundedness-full px-5 py-2.5 ${
              active ? 'bg-surface-container' : 'bg-surface-container-highest'
            }`}
          >
            <View className="bg-surface-container-lowest h-6 w-6 items-center justify-center rounded-full">
              <IconMapPin size={13} color={onSurfaceVariant} strokeWidth={1.8} />
            </View>
            <Text
              className={`font-body text-label-sm font-bold uppercase tracking-[0.1em] ${
                active ? 'text-on-surface' : 'text-on-surface-variant'
              }`}
            >
              {loc}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
