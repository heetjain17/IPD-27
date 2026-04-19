import React from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';

import { Colors } from '@/constants/colors';
import { useAppTheme } from '@/context/ThemeContext';
import { AppText } from './AppText';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary';
export type ButtonSize = 'md' | 'sm';

interface AppButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const containerVariantClass: Record<ButtonVariant, string> = {
  primary: 'bg-primary rounded-roundedness-xl',
  secondary: 'bg-surface-raised border border-outline rounded-roundedness-xl',
  tertiary: 'rounded-roundedness-xl',
};

const sizeClass: Record<ButtonSize, string> = {
  md: 'px-6 py-3',
  sm: 'px-4 py-2',
};

const labelClass: Record<ButtonVariant, string> = {
  primary: '',
  secondary: 'text-on-surface font-semibold',
  tertiary: 'text-primary font-semibold',
};

export function AppButton({
  variant = 'primary',
  size = 'md',
  onPress,
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  children,
  className = '',
}: AppButtonProps) {
  const { colorScheme } = useAppTheme();
  const palette = Colors[colorScheme];
  const isInert = disabled || loading;

  const spinnerColor: Record<ButtonVariant, string> = {
    primary: palette.background,
    secondary: palette.onSurface,
    tertiary: palette.primary,
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={isInert}
      style={({ pressed }) => ({ opacity: pressed && !isInert ? 0.75 : isInert ? 0.5 : 1 })}
      className={`
        ${containerVariantClass[variant]}
        ${sizeClass[size]}
        ${fullWidth ? 'w-full' : 'self-start'}
        flex-row items-center justify-center gap-2
        ${className}
      `}
    >
      {loading ? (
        <ActivityIndicator size="small" color={spinnerColor[variant]} />
      ) : (
        <>
          {leftIcon && <View>{leftIcon}</View>}
          <AppText
            variant={size === 'md' ? 'bodyLG' : 'bodySM'}
            className={variant === 'primary' ? 'font-semibold' : labelClass[variant]}
            style={variant === 'primary' ? { color: palette.background } : undefined}
          >
            {children}
          </AppText>
        </>
      )}
    </Pressable>
  );
}
