/**
 * App color tokens for runtime TypeScript usage.
 * Keep this in sync with constants/colors.js which is consumed by tailwind.config.js.
 */
export const Colors = {
  dark: {
    background: '#0b0d10',
    surface: '#12161b',
    surfaceRaised: '#1a2027',
    surfaceSubtle: '#151a20',

    primary: '#60a5fa',
    primaryStrong: '#3b82f6',

    onBackground: '#ffffff',
    onSurface: '#e6edf3',
    onSurfaceMuted: '#9aa4af',

    outline: '#2b3138',

    success: '#2ecc71',
    warning: '#f39c12',
    error: '#ff6b6b',
  },

  light: {
    background: '#f7f9fb',
    surface: '#ffffff',
    surfaceRaised: '#eef2f6',
    surfaceSubtle: '#f1f4f8',

    primary: '#1f6feb',
    primaryStrong: '#1557c0',

    onBackground: '#0b0d10',
    onSurface: '#111418',
    onSurfaceMuted: '#6b7280',

    outline: '#d1d5db',

    success: '#2ecc71',
    warning: '#f39c12',
    error: '#e74c3c',
  },
} as const;

export type ColorScheme = keyof typeof Colors;
export type AppColors = (typeof Colors)[ColorScheme];
