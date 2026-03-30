/**
 * Luminescent Curator Design System — Color Tokens
 * These match the custom classes defined in tailwind.config.js.
 * Used by ThemeContext to drive React Navigation theming.
 */

export type ColorScheme = 'dark' | 'light';

export const Colors = {
  dark: {
    // Surfaces
    background:              '#000000',
    surface:                 '#0e0e0e',
    surfaceContainerLow:     '#131313',
    surfaceContainer:        '#191a1a',
    surfaceContainerHigh:    '#202020',
    surfaceContainerHighest: '#262626',

    // Accent
    primary:          '#d7fd4e',
    primaryContainer: '#a6c913',
    onPrimary:        '#4d5f00',

    // Text
    onSurface:        '#ffffff',
    onSurfaceVariant: '#adaaaa',
    outlineVariant:   '#484848',
  },

  light: {
    // Surfaces
    background:              '#ffffff',
    surface:                 '#f5f5f5',
    surfaceContainerLow:     '#eeeeee',
    surfaceContainer:        '#e5e5e5',
    surfaceContainerHigh:    '#d9d9d9',
    surfaceContainerHighest: '#cccccc',

    // Accent — same lime punch on light backgrounds
    primary:          '#a6c913',
    primaryContainer: '#d7fd4e',
    onPrimary:        '#1a2200',

    // Text
    onSurface:        '#0e0e0e',
    onSurfaceVariant: '#555555',
    outlineVariant:   '#c0c0c0',
  },
} as const;

export type AppColors = typeof Colors.dark;
