# @nexso/eslint-config-typescript

A extension of [@nexso/eslint-config](https://github.com/nexsolab/eslint-config#readme) style but for typescript environment. Used in the **Nexso** development (a SaaS ERP).

> This is intended to work in Node.js 14+ environments.
## How to use

### 1. Install the config and the packages bellow as development dependency:
```bash
npm i -D eslint typescript @nexso/eslint-config.
```

### 2. Create a `.eslintrc` file with:

```json
{
  "extends": "@nexso/eslint-config-typescript",
  "rules": {}
}
```

### 3. Initialize your typescript config:

```bash
npx tsc --init
```