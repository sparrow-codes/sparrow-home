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
              sourceTag: 'scope: be-device',
              onlyDependOnLibsWithTags: [
                'scope: be-entities',
                'scope: be-auth',
                'scope: external-api',
                'scope: be-shared',
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
