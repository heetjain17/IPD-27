/**
 * useThemeColor — thin helper for the rare case where you need a raw
 * color value in JS (e.g. icon color props that don't accept className).
 *
 * Prefers explicit overrides, falls back to the design-token palette.
 */
import * as Colors from '@/constants/colors';
import { useAppTheme } from '@/context/ThemeContext';

// Convert kebab-case (surface-container) keys from colors.js to the hook's accepted keys
export type AppColorKey = keyof typeof Colors.light;

export function useThemeColor(props: { light?: string; dark?: string }, colorName: AppColorKey) {
  const { colorScheme } = useAppTheme();
  const theme = colorScheme ?? 'dark';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}
