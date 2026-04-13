import React from 'react';
import { Pressable, Text, View } from 'react-native';

type Props = {
  tabs: string[];
  activeIndex: number;
  onSelect: (index: number) => void;
};

export function FeedTabs({ tabs, activeIndex, onSelect }: Props) {
  return (
    <View className="border-outline-variant/20 mb-5 flex-row gap-7 border-b px-5">
      {tabs.map((tab, i) => {
        const active = i === activeIndex;
        return (
          <Pressable key={tab} onPress={() => onSelect(i)} className="relative pb-3">
            <Text
              className={`font-display text-title-md font-bold tracking-tight ${
                active ? 'text-on-surface' : 'text-on-surface-variant'
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
