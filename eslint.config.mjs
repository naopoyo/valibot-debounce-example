import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginBetterTailwindcss from 'eslint-plugin-better-tailwindcss';
import eslintPluginImport from 'eslint-plugin-import';
import eslintPluginUnusedImports from 'eslint-plugin-unused-imports';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  eslintConfigPrettier,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
  {
    plugins: {
      import: eslintPluginImport,
      'unused-imports': eslintPluginUnusedImports,
    },
    rules: {
      'better-tailwindcss/no-unregistered-classes': ['error', { detectComponentClasses: true }],
      'unused-imports/no-unused-imports': 'error',
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling'],
            'object',
            'type',
            'index',
          ],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
    },
    settings: {
      'better-tailwindcss': {
        entryPoint: 'src/styles/globals.css',
      },
    },
  },
  {
    plugins: {
      'better-tailwindcss': eslintPluginBetterTailwindcss,
    },
    rules: {
      ...eslintPluginBetterTailwindcss.configs['recommended-error'].rules,
      'better-tailwindcss/no-unregistered-classes': ['error', { detectComponentClasses: true }],
    },
    settings: {
      'better-tailwindcss': {
        entryPoint: 'src/app/globals.css',
      },
    },
  },
]);

export default eslintConfig;
