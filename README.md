# eslint-plugin-command

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]

Support one-off comment-as-command to do code transformation with ESLint.

Use ESLint as a codemod tool, on-demand.

> [!IMPORTANT]
> Experimental, feedbacks are welcome!

## Install

```bash
npm i eslint-plugin-command -D
```

In your Flat config:

```js
// eslint.config.mjs
import command from 'eslint-plugin-command/config'

export default [
  // ... your other flat config
  command(),
]
```

## Built-in Commands

### `to-function`

Provide a quick way to convert an arrow function to a standard function declaration.

Trigger with `/// to-function` comment (triple slashes) one line above the arrow function.

Triggers:
- `/// to-function`
- `/// to-fn`
- `/// 2f`

```js
/// to-function
const foo = async (msg: string): void => {
  console.log(msg)
}
```

Will be converted to (the command comment will also be removed):

```js
async function foo(msg: string): void {
  console.log(msg)
}
```

### `to-arrow`

Provide a quick way to convert a standard function declaration to an arrow function.

Triggers:
- `/// to-arrow`
- `/// 2a`

```js
/// to-arrow
function foo(msg: string): void {
  console.log(msg)
}
```

Will be converted to:

```js
const foo = (msg: string): void => {
  console.log(msg)
}
```

### `keep-sorted`

Keep the object keys or array items sorted.

Triggers:
- `/// keep-sorted`
- `// @keep-sorted`

```js
/// keep-sorted
const obj = {
  b: 2,
  a: 1,
  c: 3,
}
```

Will be converted to:

```js
/// keep-sorted
const obj = {
  a: 1,
  b: 2,
  c: 3,
}
```

Different from the other commands, the comment will not be removed after transformation to keep the sorting.

## Sponsors

<p align="center">
  <a href="https://cdn.jsdelivr.net/gh/antfu/static/sponsors.svg">
    <img src='https://cdn.jsdelivr.net/gh/antfu/static/sponsors.svg'/>
  </a>
</p>

## License

[MIT](./LICENSE) License © 2023-PRESENT [Anthony Fu](https://github.com/antfu)

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/eslint-plugin-command?style=flat&colorA=080f12&colorB=1fa669
[npm-version-href]: https://npmjs.com/package/eslint-plugin-command
[npm-downloads-src]: https://img.shields.io/npm/dm/eslint-plugin-command?style=flat&colorA=080f12&colorB=1fa669
[npm-downloads-href]: https://npmjs.com/package/eslint-plugin-command
