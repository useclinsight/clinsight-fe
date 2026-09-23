import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const eslintConfig = defineConfig([
  globalIgnores([
    '**/node_modules/**',
    '**/.next/**',
    '**/dist/**',
    '**/build/**',
    '**/out/**',
    '**/.turbo/**',
    '**/next-env.d.ts',
    'run/**',
    'public/**',
    '.husky/**',
  ]),
  ...nextVitals,
  ...nextTs,

  {
    rules: {
      'react/display-name': 'off',
      '@next/next/no-img-element': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
]);

export default eslintConfig;
