/**
 * useThemeColor — thin helper for the rare case where you need a raw
 * color value in JS (e.g. icon color props that don't accept className).
 *
 * Prefers explicit overrides, falls back to the design-token palette.
 */
import { Colors } from '@/constants/theme';
import { useAppTheme } from '@/context/ThemeContext';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.dark & keyof typeof Colors.light,
): string {
  const { colorScheme } = useAppTheme();
  const override = props[colorScheme];
  if (override) return override;
  return Colors[colorScheme][colorName];
}
