import globals from 'globals';
import prettierPlugin from 'eslint-plugin-prettier';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  { ignores: ['**/.config/', 'public/**', '**/*.tsx'] },

  // Test files: add Jest globals
  {
    files: ['__tests__/**/*.js', '**/*.test.js', '**/*.spec.js'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
        describe: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        it: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
      },
    },
  },

  // JS files: enable Prettier rule via eslint-plugin-prettier
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        JitsiMeetExternalAPI: 'readonly',
      },
    },
    plugins: { prettier: prettierPlugin },
    rules: {
      'prettier/prettier': 'warn',
      'no-console': 'off',
    },
  },
  {
    files: ['**/*'],
    rules: {
      'no-unused-vars': 'warn',
      'no-debugger': 'warn',
      'no-undef': 'error',
    },
  },
]);
