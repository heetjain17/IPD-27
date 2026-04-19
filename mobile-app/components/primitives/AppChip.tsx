import React from 'react';
import { Pressable } from 'react-native';

import { Colors } from '@/constants/colors';
import { useAppTheme } from '@/context/ThemeContext';
import { AppText } from './AppText';

interface AppChipProps {
  label: string;
  active?: boolean;
  onPress?: () => void;
  size?: 'sm' | 'md';
  className?: string;
}

export function AppChip({
  label,
  active = false,
  onPress,
  size = 'md',
  className = '',
}: AppChipProps) {
  const { colorScheme } = useAppTheme();
  const palette = Colors[colorScheme];

  const containerClass = active
    ? 'bg-primary rounded-roundedness-full'
    : 'bg-surface-raised rounded-roundedness-full';

  const paddingClass = size === 'md' ? 'px-4 py-2' : 'px-3 py-1.5';

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      className={`${containerClass} ${paddingClass} active:opacity-75 ${className}`}
    >
      <AppText
        variant={size === 'md' ? 'bodySM' : 'labelSM'}
        color={active ? 'default' : 'muted'}
        style={active ? { color: palette.background } : undefined}
      >
        {label}
      </AppText>
    </Pressable>
  );
}
