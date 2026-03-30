/**
 * Reads colorScheme from ThemeContext so all callsites
 * (layouts, tabs, etc.) continue to work unchanged.
 */
export { useAppTheme as useColorScheme } from '@/context/ThemeContext';
