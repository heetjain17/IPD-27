import { IconCompass } from '@tabler/icons-react-native';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { useAppTheme } from '@/context/ThemeContext';

type TablerIcon = React.ComponentType<{ size?: number; color?: string }>;

type Category = { label: string; icon: TablerIcon };

type Props = {
  categories: Category[];
  activeIndex: number;
  onSelect: (index: number) => void;
};

export function CategoryRow({ categories, activeIndex, onSelect }: Props) {
  const { colorScheme } = useAppTheme();
  const isDark = colorScheme === 'dark';

  return (
    <View className="flex-row items-center gap-5 px-5 py-4">
      {categories.map((cat, i) => {
        const Icon = cat.icon;
        const active = i === activeIndex;
        return (
          <Pressable key={cat.label} onPress={() => onSelect(i)} className="items-center gap-2">
            <View
              className={`h-14 w-14 items-center justify-center rounded-roundedness-full ${
                active
                  ? 'bg-primary'
                  : isDark
                    ? 'bg-surface-container-highest'
                    : 'bg-light-surface-container-highest'
              }`}
            >
              <Icon size={24} color={active ? '#4d5f00' : isDark ? '#adaaaa' : '#555555'} />
            </View>
            <Text
              className={`font-body text-[10px] font-bold uppercase tracking-widest ${
                active
                  ? 'text-primary'
                  : isDark
                    ? 'text-on-surface-variant'
                    : 'text-light-on-surface-variant'
              }`}
            >
              {cat.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
