import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { useAppTheme } from '@/context/ThemeContext';

type Props = {
  tabs: string[];
  activeIndex: number;
  onSelect: (index: number) => void;
};

export function FeedTabs({ tabs, activeIndex, onSelect }: Props) {
  const { colorScheme } = useAppTheme();
  const isDark = colorScheme === 'dark';

  return (
    <View className="mb-5 flex-row gap-7 border-b border-outline-variant/20 px-5">
      {tabs.map((tab, i) => {
        const active = i === activeIndex;
        return (
          <Pressable key={tab} onPress={() => onSelect(i)} className="relative pb-3">
            <Text
              className={`font-body text-[11px] font-bold uppercase tracking-widest ${
                active
                  ? 'text-primary'
                  : isDark
                    ? 'text-on-surface-variant'
                    : 'text-light-on-surface-variant'
              }`}
            >
              {tab}
            </Text>
            {active && (
              <View className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-primary" />
            )}
          </Pressable>
        );
      })}
    </View>
  );
}
