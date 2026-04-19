import { type IconProps as TablerIconProps } from '@tabler/icons-react-native';
import React from 'react';

import { Colors } from '@/constants/colors';
import { useAppTheme } from '@/context/ThemeContext';
import type { TextColor } from './AppText';

export type { TablerIconProps };

interface AppIconProps {
  Icon: React.ComponentType<TablerIconProps>;
  size?: 'sm' | 'md' | 'lg';
  color?: TextColor;
}

const sizeMap: Record<NonNullable<AppIconProps['size']>, number> = {
  sm: 16,
  md: 20,
  lg: 24,
};

export function AppIcon({ Icon, size = 'md', color = 'default' }: AppIconProps) {
  const { colorScheme } = useAppTheme();
  const palette = Colors[colorScheme];

  const colorMap: Record<TextColor, string> = {
    default: palette.onSurface,
    muted: palette.onSurfaceMuted,
    accent: palette.primary,
    error: palette.error,
  };

  return <Icon size={sizeMap[size]} color={colorMap[color]} />;
}
