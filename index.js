import nexso from '@nexso/eslint-config';
import tseslint from 'typescript-eslint';

const typescriptFiles = ['**/*.ts', '**/*.cts', '**/*.mts', '**/*.tsx'];

const forTypeScript = (configs, namespace) => configs.map((config, index) => ({
  ...config,
  name: `@nexso/eslint-config-typescript/${namespace}-${index}`,
  files: typescriptFiles,
}));

const findBaseConfig = name => nexso.find(config => config.name === name);

const nodeConfig = findBaseConfig('@nexso/eslint-config/node-recommended');
const customConfig = findBaseConfig('@nexso/eslint-config/custom-rules');

const typescriptOverrides = {
  ...customConfig.rules,
  'no-shadow': 'off',
  'no-undef': 'off',
  'no-unused-vars': 'off',
  '@typescript-eslint/no-shadow': 'error',
  '@typescript-eslint/no-unused-vars': [
    'error',
    {
      argsIgnorePattern: '^_',
      caughtErrorsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
    },
  ],
};

const baseTypeScriptConfig = [
  ...nexso,
  ...forTypeScript(tseslint.configs.recommended, 'recommended'),
  {
    ...nodeConfig,
    name: '@nexso/eslint-config-typescript/node-recommended',
    files: typescriptFiles,
  },
  {
    name: '@nexso/eslint-config-typescript/custom-rules',
    files: typescriptFiles,
    rules: typescriptOverrides,
  },
];

export const nuxt = [
  ...baseTypeScriptConfig,
  {
    name: '@nexso/eslint-config-typescript/nuxt-vue-overrides',
    files: ['**/*.vue'],
    rules: typescriptOverrides,
  },
];

export const typeChecked = [
  ...baseTypeScriptConfig,
  ...forTypeScript(tseslint.configs.recommendedTypeChecked, 'type-checked'),
  {
    name: '@nexso/eslint-config-typescript/project-service',
    files: typescriptFiles,
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: process.cwd(),
      },
    },
  },
  {
    name: '@nexso/eslint-config-typescript/type-checked-overrides',
    files: typescriptFiles,
    rules: typescriptOverrides,
  },
];

export default baseTypeScriptConfig;
