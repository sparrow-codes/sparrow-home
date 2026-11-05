import { FlatCompat } from '@eslint/eslintrc';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import angular from 'angular-eslint';
import js from '@eslint/js';
import nx from '@nx/eslint-plugin';
import eslintPluginSimpleImportSort from 'eslint-plugin-simple-import-sort';
import prettierConfig from 'eslint-config-prettier/flat';
import tseslint from 'typescript-eslint';

const compat = new FlatCompat({
  baseDirectory: dirname(fileURLToPath(import.meta.url)),
  recommendedConfig: js.configs.recommended,
});

// Angular 22's migration intentionally uses Eager change detection.
export const angularOnPushPreferenceOverride = {
  files: ['**/*.ts'],
  rules: {
    '@angular-eslint/prefer-on-push-component-change-detection': 'off',
  },
};

export const angularTsRecommended = angular.configs.tsRecommended.map((config) => ({
  ...config,
  files: ['**/*.ts'],
  rules: { ...config.rules, ...angularOnPushPreferenceOverride.rules },
}));

export default [
  ...nx.configs['flat/base'],
  { plugins: { 'simple-import-sort': eslintPluginSimpleImportSort } },
  ...compat
    .config({
      extends: ['eslint:recommended'],
    })
    .map((config) => ({
      ...config,
      files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
      rules: {
        ...config.rules,
        '@nx/enforce-module-boundaries': [
          'error',
          {
            enforceBuildableLibDependency: true,
            allow: [],
            depConstraints: [
              {
                sourceTag: '*',
                onlyDependOnLibsWithTags: ['*'],
              },
            ],
          },
        ],
      },
    })),
  ...tseslint.configs.recommended.map((config) => ({
    ...config,
    files: ['**/*.ts', '**/*.tsx'],
  })),
  ...nx.configs['flat/typescript'],
  {
    ...prettierConfig,
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      ...prettierConfig.rules,
      semi: 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      'arrow-spacing': 'error',
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/explicit-member-accessibility': 'error',
      '@typescript-eslint/no-inferrable-types': 'off',
      '@typescript-eslint/typedef': [
        'warn',
        {
          propertyDeclaration: true,
          parameter: true,
          variableDeclaration: true,
        },
      ],
    },
  },
  ...nx.configs['flat/javascript'],
  ...compat
    .config({
      env: {
        jest: true,
      },
    })
    .map((config) => ({
      ...config,
      files: ['**/*.spec.ts', '**/*.spec.tsx', '**/*.spec.js', '**/*.spec.jsx'],
      rules: {
        ...config.rules,
      },
    })),
];
