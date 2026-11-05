import baseConfig, { angularTsRecommended } from '../../../../eslint.config.mjs';
import nx from '@nx/eslint-plugin';

export default [
  ...baseConfig,
  ...nx.configs['flat/angular'],
  ...angularTsRecommended,
  {
    files: ['**/*.ts'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          allow: [],
          depConstraints: [
            {
              sourceTag: 'scope:fe-user-domain',
              onlyDependOnLibsWithTags: ['scope: fe-core', 'scope:fe-api', 'scope:fe-utils'],
            },
          ],
        },
      ],
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'lib',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'lib',
          style: 'kebab-case',
        },
      ],
    },
  },
  ...nx.configs['flat/angular-template'],
];
