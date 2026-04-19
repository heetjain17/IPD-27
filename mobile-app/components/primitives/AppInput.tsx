import React, { useState } from 'react';
import { TextInput, type TextInputProps, View } from 'react-native';

import { Colors } from '@/constants/colors';
import { useAppTheme } from '@/context/ThemeContext';
import { AppText } from './AppText';

interface AppInputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  helper?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

export function AppInput({
  label,
  error,
  helper,
  leftIcon,
  rightIcon,
  containerClassName = '',
  ...textInputProps
}: AppInputProps) {
  const { colorScheme } = useAppTheme();
  const palette = Colors[colorScheme];
  const [focused, setFocused] = useState(false);

  const borderColor = error ? palette.error : focused ? palette.primary : palette.outline;

  return (
    <View className={`gap-1 ${containerClassName}`}>
      {label && (
        <AppText variant="labelSM" color="muted" className="uppercase tracking-widest">
          {label}
        </AppText>
      )}

      <View
        className="flex-row items-center gap-3 rounded-roundedness-md bg-surface-raised px-4 py-2.5"
        style={{ borderWidth: 1.5, borderColor }}
      >
        {leftIcon && <View>{leftIcon}</View>}

        <TextInput
          className="flex-1 font-body text-body-lg text-on-surface"
          placeholderTextColor={palette.onSurfaceMuted}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...textInputProps}
        />

        {rightIcon && <View>{rightIcon}</View>}
      </View>

      {error ? (
        <AppText variant="bodySM" color="error">
          {error}
        </AppText>
      ) : helper ? (
        <AppText variant="bodySM" color="muted">
          {helper}
        </AppText>
      ) : null}
    </View>
  );
}
