import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';

type TablerIcon = React.ComponentType<{ size?: number; color?: string }>;

type Category = { label: string; icon: TablerIcon };

type Props = {
  categories: Category[];
  activeIndex: number;
  onSelect: (index: number) => void;
};

export function CategoryRow({ categories, activeIndex, onSelect }: Props) {
  const onPrimary = useThemeColor({}, 'onPrimary');
  const onSurfaceVariant = useThemeColor({}, 'onSurfaceVariant');

  return (
    <View className="flex-row items-center gap-5 px-5 py-4">
      {categories.map((cat, i) => {
        const Icon = cat.icon;
        const active = i === activeIndex;
        return (
          <Pressable key={cat.label} onPress={() => onSelect(i)} className="items-center gap-2">
            <View
              className={`h-14 w-14 items-center justify-center rounded-roundedness-full ${
                active ? 'bg-primary' : 'bg-surface-container-highest'
              }`}
            >
              <Icon size={24} color={active ? onPrimary : onSurfaceVariant} />
            </View>
            <Text
              className={`font-body text-[10px] font-bold uppercase tracking-widest ${
                active ? 'text-primary' : 'text-on-surface-variant'
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
