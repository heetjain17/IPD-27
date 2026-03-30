/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.tsx',
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './context/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  // Class-based dark mode: add className="dark" to root View to activate
  darkMode: 'class',
  theme: {
    extend: {
      // ─── Luminescent Curator Palette ───────────────────────────────────────
      colors: {
        // Dark mode surfaces (default)
        'surface-lowest': '#000000',
        surface: '#0e0e0e',
        'surface-container-low': '#131313',
        'surface-container': '#191a1a',
        'surface-container-high': '#202020',
        'surface-container-highest': '#262626',

        // Primary accent — the "laser"
        primary: '#d7fd4e',
        'primary-container': '#a6c913',
        'on-primary': '#4d5f00',

        // Text on surfaces
        'on-surface': '#ffffff',
        'on-surface-variant': '#adaaaa',
        'outline-variant': '#484848',

        // Light mode surfaces
        'light-surface-lowest': '#ffffff',
        'light-surface': '#f5f5f5',
        'light-surface-container-low': '#eeeeee',
        'light-surface-container': '#e5e5e5',
        'light-surface-container-high': '#d9d9d9',
        'light-surface-container-highest': '#cccccc',

        // Light mode text
        'light-on-surface': '#0e0e0e',
        'light-on-surface-variant': '#555555',
        'light-outline-variant': '#c0c0c0',
      },

      // ─── Border Radius Tokens ──────────────────────────────────────────────
      borderRadius: {
        'roundedness-sm': '0.5rem',
        'roundedness-md': '1.5rem',
        'roundedness-lg': '2rem',
        'roundedness-xl': '3rem',
        'roundedness-full': '9999px',
      },

      // ─── Typography Tokens ─────────────────────────────────────────────────
      fontFamily: {
        display: ['Manrope', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },

      fontSize: {
        'display-lg': [
          '3.5rem',
          { lineHeight: '1.1', letterSpacing: '-0.04em', fontWeight: '700' },
        ],
        'display-md': [
          '2.5rem',
          { lineHeight: '1.15', letterSpacing: '-0.03em', fontWeight: '700' },
        ],
        'title-lg': ['1.5rem', { lineHeight: '1.3', fontWeight: '600' }],
        'title-md': ['1.25rem', { lineHeight: '1.4', fontWeight: '600' }],
        'body-lg': ['1rem', { lineHeight: '1.6' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5' }],
        'label-sm': ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.05em' }],
      },

      // ─── Spacing Scale ─────────────────────────────────────────────────────
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
        26: '6.5rem',
      },
    },
  },
  plugins: [],
};
