import React from 'react';
import { Text, type TextProps } from 'react-native';

export type TextVariant =
  | 'displayLG'
  | 'displayMD'
  | 'titleLG'
  | 'titleMD'
  | 'bodyLG'
  | 'bodySM'
  | 'labelSM';
export type TextColor = 'default' | 'muted' | 'accent' | 'error';

const variantClass: Record<TextVariant, string> = {
  displayLG: 'text-display-lg font-display',
  displayMD: 'text-display-md font-display',
  titleLG: 'text-title-lg font-display',
  titleMD: 'text-title-md font-display',
  bodyLG: 'text-body-lg font-body',
  bodySM: 'text-body-sm font-body',
  labelSM: 'text-label-sm font-body',
};

const colorClass: Record<TextColor, string> = {
  default: 'text-on-surface',
  muted: 'text-on-surface-variant',
  accent: 'text-primary',
  error: 'text-error',
};

interface AppTextProps extends TextProps {
  variant?: TextVariant;
  color?: TextColor;
  className?: string;
}

export function AppText({
  variant = 'bodyLG',
  color = 'default',
  className = '',
  children,
  ...props
}: AppTextProps) {
  return (
    <Text className={`${variantClass[variant]} ${colorClass[color]} ${className}`} {...props}>
      {children}
    </Text>
  );
}
