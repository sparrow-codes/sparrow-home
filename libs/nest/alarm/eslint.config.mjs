import baseConfig from '../../../eslint.config.mjs';

export default [
  ...baseConfig,
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          depConstraints: [
            {
              sourceTag: 'scope: be-alarm',
              onlyDependOnLibsWithTags: [
                'scope: be-entities',
                'scope: external-api',
                'scope: be-auth',
                'scope: be-push',
              ],
            },
          ],
        },
      ],
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    // Override or add rules here
    rules: {},
  },
  {
    files: ['**/*.js', '**/*.jsx'],
    // Override or add rules here
    rules: {},
  },
];
