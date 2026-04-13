import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

type TablerIcon = React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;

type Props = {
  label: string;
  icon: TablerIcon;
  active?: boolean;
  onPress?: () => void;
};

/**
 * Filter / category pill chip.
 * Active: lime background + dark text.
 * Inactive: surface-container-highest + muted text.
 *
 * Pass the Tabler icon *component* (not JSX), e.g. icon={IconCompass}
 */
export function CategoryChip({ label, icon: Icon, active = false, onPress }: Props) {
  const onPrimary = useThemeColor({}, 'onPrimary');
  const onSurfaceVariant = useThemeColor({}, 'onSurfaceVariant');

  return (
    <Pressable
      onPress={onPress}
      className={`flex-row items-center gap-2 rounded-roundedness-full px-4 py-2 ${
        active ? 'bg-primary' : 'bg-surface-container-highest'
      }`}
    >
      <View>
        <Icon size={16} color={active ? onPrimary : onSurfaceVariant} />
      </View>
      <Text
        className={`font-body text-label-sm font-bold uppercase tracking-widest ${
          active ? 'text-on-primary' : 'text-on-surface-variant'
        }`}
      >
        {label}
      </Text>
    </Pressable>
  );
}
