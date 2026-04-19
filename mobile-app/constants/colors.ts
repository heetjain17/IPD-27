/**
 * App color tokens for runtime TypeScript usage.
 * Keep this in sync with constants/colors.js which is consumed by tailwind.config.js.
 */
export const Colors = {
  dark: {
    background: '#0a0a0a',
    surface: '#111111',
    surfaceContainerLow: '#161616',
    surfaceContainer: '#1d1d1d',
    surfaceContainerHigh: '#252525',
    surfaceContainerHighest: '#2e2e2e',
    surfaceBright: '#343434',

    primary: '#c6f23a',
    primaryContainer: '#9fbe1e',
    onPrimary: '#1a2200',

    onSurface: '#ffffff',
    onSurfaceVariant: '#b8b8b8',
    outlineVariant: '#3f3f3f',
    outline: '#5a5a5a',
    error: '#ffb4ab',
  },

  light: {
    background: '#fafafa',
    surface: '#f3f3f3',
    surfaceContainerLow: '#ededed',
    surfaceContainer: '#e2e2e2',
    surfaceContainerHigh: '#d6d6d6',
    surfaceContainerHighest: '#cacaca',
    surfaceBright: '#ffffff',

    primary: '#9fbe1e',
    primaryContainer: '#c6f23a',
    onPrimary: '#1a2200',

    onSurface: '#0e0e0e',
    onSurfaceVariant: '#666666',
    outlineVariant: '#cfcfcf',
    outline: '#a0a0a0',
    error: '#ba1a1a',
  },
} as const;

export type ColorScheme = keyof typeof Colors;
export type AppColors = (typeof Colors)[ColorScheme];
