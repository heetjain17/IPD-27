import { IconChevronRight } from '@tabler/icons-react-native';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { useAppTheme } from '@/context/ThemeContext';

type TablerIcon = React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;

type Props = {
  icon: TablerIcon;
  label: string;
  onPress?: () => void;
  showChevron?: boolean;
  rightElement?: React.ReactNode;
  isDestructive?: boolean;
};

export function SettingRow({
  icon: Icon,
  label,
  onPress,
  showChevron = true,
  rightElement,
  isDestructive,
}: Props) {
  const { colorScheme } = useAppTheme();
  const isDark = colorScheme === 'dark';

  const textColorClass = isDestructive ? 'text-error' : 'text-on-surface';

  const iconColor = isDestructive
    ? isDark
      ? '#ffb4ab'
      : '#ba1a1a' // error colors
    : isDark
      ? '#adaaaa'
      : '#767575'; // on-surface-variant

  return (
    <Pressable onPress={onPress} className="flex-row items-center justify-between py-3">
      <View className="flex-row items-center gap-3">
        <View className="h-8 w-8 items-center justify-center rounded-full bg-surface-container-highest">
          <Icon size={18} color={iconColor} />
        </View>
        <Text className={`font-body text-body-lg font-medium ${textColorClass}`}>{label}</Text>
      </View>

      {rightElement ? (
        rightElement
      ) : showChevron ? (
        <IconChevronRight size={18} color={isDark ? '#484848' : '#c7c7c7'} />
      ) : null}
    </Pressable>
  );
}
