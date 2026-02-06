/* eslint-disable @typescript-eslint/no-explicit-any */
import { ESLint } from 'eslint';

const eslintConfig = [
  {
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        React: 'readonly',
        JSX: 'readonly',
      },
    },
  },
];

export default eslintConfig;
