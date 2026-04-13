/** @type {import('tailwindcss').Config} */
const appColors = require('./constants/colors.js');

module.exports = {
  content: [
    './App.tsx',
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './context/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      // ─── Luminescent Curator Palette ───────────────────────────────────────
      colors: Object.keys(appColors.light).reduce((acc, key) => {
        const cssVarName = key.replace(/([A-Z])/g, '-$1').toLowerCase();
        acc[cssVarName] = `var(--${cssVarName})`;
        return acc;
      }, {}),
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
    },
  },
  plugins: [
    function ({ addBase }) {
      const getCssVars = (themeObj) => {
        const vars = {};
        for (const [key, value] of Object.entries(themeObj)) {
          const cssVarName = key.replace(/([A-Z])/g, '-$1').toLowerCase();
          vars[`--${cssVarName}`] = value;
        }
        return vars;
      };

      addBase({
        ':root': getCssVars(appColors.light),
        '.dark': getCssVars(appColors.dark),
      });
    },
  ],
};
