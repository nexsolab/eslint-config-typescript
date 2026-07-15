# @nexso/eslint-config-typescript

Nexso's ESLint 10 Flat Config for TypeScript. It extends
`@nexso/eslint-config`, so JavaScript and TypeScript files share the same
security, import, Node.js, stylistic, and ordering conventions.

## Requirements

- Node.js `^20.19.0 || ^22.13.0 || >=24`
- ESLint `^10.7.0`
- TypeScript `>=5.0.0 <6.1.0`

## Installation

```bash
npm install --save-dev eslint typescript @nexso/eslint-config @nexso/eslint-config-typescript
```

## Usage

Create `eslint.config.js`:

```js
import nexsoTypeScript from '@nexso/eslint-config-typescript';

export default [
  ...nexsoTypeScript,
  {
    rules: {
      // Project overrides
    },
  },
];
```

The default preset uses the syntax-aware `typescript-eslint` recommended
rules. It does not require a `tsconfig.json` and is suitable for libraries,
scripts, and mixed JavaScript/TypeScript projects.

## Type-aware linting

Use the named `typeChecked` export when rules should use TypeScript's type
information:

```js
import { typeChecked } from '@nexso/eslint-config-typescript';

export default typeChecked;
```

This preset enables `parserOptions.projectService`. The linted TypeScript files
must belong to a TypeScript project. Use the default preset when that condition
is not true for every file.

`typescript-eslint` supplies the TypeScript parser, ESLint plugin, and rule
presets. It does not enable Prettier. Add Prettier separately only if the project
wants a formatter in addition to ESLint's `@stylistic` rules; avoid enabling
overlapping formatting rules in both tools.

## Nuxt

Nuxt needs framework-specific configuration for Vue SFC parsing, generated
globals, and Nuxt file conventions. Install and initialize `@nuxt/eslint`, then
compose this package with the generated config:

```bash
npx nuxi module add eslint
```

```js
// eslint.config.mjs
import withNuxt from './.nuxt/eslint.config.mjs';
import { nuxt as nexsoNuxt } from '@nexso/eslint-config-typescript';

export default withNuxt(
  ...nexsoNuxt,
);
```

Keep the Nuxt-generated config first so it owns the `.vue` parser and Nuxt
globals. The `nuxt` preset then adds the shared Nexso rules and disables core
rules such as `no-unused-vars` for `.vue` files when the
`@typescript-eslint` equivalent is active. It does not bundle a second copy of
the Vue/Nuxt plugins.

## Migrating from version 1

- Replace `.eslintrc*` with `eslint.config.js` or `eslint.config.mjs`.
- Spread the exported config array.
- Remove `eslint-config-airbnb-typescript`, `@typescript-eslint/parser`, and
  `@typescript-eslint/eslint-plugin` if they were installed only for this
  config; the unified `typescript-eslint` package now supplies them.
- Upgrade Node.js to a version supported by ESLint 10.

## License

MIT
