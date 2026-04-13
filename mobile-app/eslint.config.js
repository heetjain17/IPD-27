// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: [
      'dist/**',
      'build/**',
      'node_modules/**',
      '.expo/**',
      'expo-env.d.ts',
      'nativewind-env.d.ts',
      'scripts/**',
      'assets/**',
    ],
  },
]);
