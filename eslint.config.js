// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import pluginJest from 'eslint-plugin-jest';

export default [
  {
    ignores: [
      'dist', 
      'coverage', 
      'node_modules',
      'build/**/*',
      '.react-router/**/*',
      '*.min.js',
      '**/*.min.js',
      'debug-auth.js',
      '**/*.stories.tsx',
      '**/*.json'
    ] 
  },
  // Base config for all files
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
  {
    files: ["**/*.test.*", "**/__tests__/**/*", "**/tests/**/*", "jest.setup.ts"],
    plugins: {
      jest: pluginJest,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...pluginJest.environments.globals.globals,
      },
    },
    rules: {
      'jest/no-disabled-tests': 'warn',
      'jest/no-focused-tests': 'error',
      'jest/no-identical-title': 'error',
      'jest/prefer-to-have-length': 'warn',
      'jest/valid-expect': 'error',
    },
  },
  {
    files: ["server/**/*", "*.config.js", "*.config.ts", "vite.config.js", ".storybook/**/*"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  {
    files: ["tests/**/*"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  ...storybook.configs["flat/recommended"]
];
