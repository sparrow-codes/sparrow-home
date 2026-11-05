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
              sourceTag: 'scope:fe-user-feature',
              onlyDependOnLibsWithTags: ['scope:fe-user-domain', 'scope: fe-ui', 'scope: fe-core', 'scope:fe-api'],
            },
          ],
        },
      ],
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'sp',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'sp',
          style: 'kebab-case',
        },
      ],
    },
  },
  ...nx.configs['flat/angular-template'],
  {
    ignores: ['storybook-static'],
  },
];
