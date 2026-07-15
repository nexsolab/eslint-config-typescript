import assert from 'node:assert/strict';

import { ESLint } from 'eslint';

import config, { nuxt, typeChecked } from './index.js';

assert(Array.isArray(config));
assert(Array.isArray(nuxt));
assert(Array.isArray(typeChecked));
assert(config.every(({ name }) => typeof name === 'string'));

const eslint = new ESLint({
  overrideConfigFile: true,
  overrideConfig: config,
});

const calculatedConfig = await eslint.calculateConfigForFile('example.ts');

assert.equal(calculatedConfig.rules['no-unused-vars'][0], 0);
assert.equal(calculatedConfig.rules['@typescript-eslint/no-unused-vars'][0], 2);
assert.equal(calculatedConfig.rules['max-len'][0], 0);
assert.equal(calculatedConfig.rules['@stylistic/max-len'][0], 2);

const vueConfig = nuxt.find(({ name }) => name.endsWith('/nuxt-vue-overrides'));

assert.equal(vueConfig.rules['no-unused-vars'], 'off');
assert.equal(vueConfig.rules['@typescript-eslint/no-unused-vars'][0], 'error');

const [result] = await eslint.lintText('const value: any = 1;\n', {
  filePath: 'example.ts',
});
const ruleIds = result.messages.map(({ ruleId }) => ruleId);

assert(!result.messages.some(({ fatal }) => fatal), 'TypeScript must parse without fatal errors');
assert(ruleIds.includes('@typescript-eslint/no-explicit-any'));
assert(ruleIds.includes('@typescript-eslint/no-unused-vars'));

console.log('ESLint 10 TypeScript Flat Config tests passed.');
