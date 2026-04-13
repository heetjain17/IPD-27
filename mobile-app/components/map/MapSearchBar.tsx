import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { AppSearchBar } from '@/components/shared/AppSearchBar';
import { useThemeColor } from '@/hooks/use-theme-color';

type TablerIcon = React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;

type FilterChip = { label: string; icon?: TablerIcon };

type Props = {
  chips: FilterChip[];
  activeChipIndex: number;
  onChipPress: (index: number) => void;
  onFilterPress?: () => void;
};

/**
 * Floating search bar for the Map screen — uses AppSearchBar glass variant
 * with an absolute positioned wrapper and horizontal filter chips below.
 */
export function MapSearchBar({ chips, activeChipIndex, onChipPress, onFilterPress }: Props) {
  const onSurfaceVariant = useThemeColor({}, 'onSurfaceVariant');
  const onPrimary = useThemeColor({}, 'onPrimary');

  return (
    <View className="absolute left-0 right-0 top-0 z-10 gap-3 px-4" style={{ paddingTop: 12 }}>
      {/* Shared search bar in glass mode */}
      <AppSearchBar placeholder="Search on map…" onFilterPress={onFilterPress} variant="glass" />

      {/* Filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8 }}
      >
        {chips.map((chip, i) => {
          const active = i === activeChipIndex;
          const Icon = chip.icon;
          return (
            <Pressable
              key={chip.label}
              onPress={() => onChipPress(i)}
              className={`flex-row items-center gap-1.5 rounded-roundedness-full border px-4 py-2 ${
                active ? 'border-primary bg-primary' : 'border-outline-variant/30'
              }`}
              style={!active ? { backgroundColor: 'rgba(25,26,26,0.85)' } : undefined}
            >
              {Icon && (
                <Icon size={13} color={active ? onPrimary : onSurfaceVariant} strokeWidth={2} />
              )}
              <Text
                className={`font-body text-[11px] font-bold uppercase tracking-widest ${
                  active ? 'text-on-primary' : 'text-on-surface-variant'
                }`}
              >
                {chip.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
