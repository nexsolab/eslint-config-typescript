import config from './index.js';

export default [
  ...config,
  {
    name: '@nexso/eslint-config-typescript/repository-files',
    files: ['index.js', 'index.test.js', 'eslint.config.js'],
    rules: {
      'perfectionist/sort-arrays': 'off',
    },
  },
];
