import assert from 'node:assert/strict';

import { ESLint } from 'eslint';

import config, { nuxt, typeChecked } from './index.js';

assert.ok(Array.isArray(config));
assert.ok(Array.isArray(nuxt));
assert.ok(Array.isArray(typeChecked));
assert.ok(config.every(({ name }) => typeof name === 'string'));

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

assert.ok(!result.messages.some(({ fatal }) => fatal), 'TypeScript must parse without fatal errors');
assert.ok(ruleIds.includes('@typescript-eslint/no-explicit-any'));
assert.ok(ruleIds.includes('@typescript-eslint/no-unused-vars'));

for (const preset of [config, nuxt, typeChecked]) {
  const presetEslint = new ESLint({ overrideConfigFile: true, overrideConfig: preset });
  const [manifest] = await presetEslint.lintText('{"private":true}', {
    filePath: 'packages/example/package.json',
  });

  assert.ok(!manifest.messages.some(({ fatal }) => fatal), 'JSON must not use the TypeScript parser');
  assert.ok(manifest.messages.some(({ ruleId }) => ruleId === 'package-json/require-name'));
  assert.ok(manifest.messages.some(({ ruleId }) => ruleId === 'package-json/require-version'));

  const testConfig = await presetEslint.calculateConfigForFile('example.test.ts');

  assert.equal(testConfig.rules['node-test/no-only-test'][0], 2);
  assert.equal(testConfig.rules['node-test/no-sleep-in-test'][0], 2);
  assert.equal(testConfig.rules['node-test/require-top-level-describe'][0], 2);
  assert.equal(testConfig.rules['@typescript-eslint/no-unused-vars'][0], 2);
  assert.equal((await presetEslint.calculateConfigForFile('package.json'))
    .rules['node-test/no-only-test'], undefined);
}

const [nodeTestResult] = await eslint.lintText(`
import { it } from 'node:test';

it.only('checks typed values', t => {
  const value: number = 2;
  t.assert.equal(value, 2);
});
`, { filePath: 'example.test.ts' });

assert.ok(!nodeTestResult.messages.some(({ fatal }) => fatal), 'node:test must support TypeScript');
assert.ok(nodeTestResult.messages.some(({ ruleId }) => ruleId === 'node-test/no-only-test'));
assert.ok(nodeTestResult.messages.some(({ ruleId }) => ruleId === 'node-test/require-top-level-describe'));

console.log('ESLint 10 TypeScript, inherited package.json, and node:test integration tests passed.');
