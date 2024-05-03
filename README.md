# eslint-plugin-command

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]

Comment-as-command for one-off codemod with ESLint.

## Install

```bash
npm i eslint-plugin-command -D
```

In your flat config `eslint.config.mjs`:

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

Convert an arrow function to a standard function declaration.

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

Will be converted to (the command comment will be removed along the way):

```js
async function foo(msg: string): void {
  console.log(msg)
}
```

### `to-arrow`

Convert a standard function declaration to an arrow function.

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

### `inline-arrow`

Inline return statement of arrow function.

Triggers:
- `/// inline-arrow`
- `/// ia`

```js
/// inline-arrow
const foo = async (msg: string): void => {
  return fn(msg)
}
```

Will be converted to:

```js
const foo = async (msg: string): void => fn(msg)
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

#### Sort Array of Objects

This command takes an optional inline JSON configuration to specify the keys to sort.

```js
/// keep-sorted { "keys": ["index", "name"] }
const arr = [
  { index: 4, name: 'foo' },
  { index: 2, name: 'bar' },
  { index: 2, name: 'apple' },
  { index: 0, name: 'zip' },
]
```

Will be converted to:

```js
/// keep-sorted { "keys": ["index", "name"] }
const arr = [
  { index: 0, name: 'zip' },
  { index: 2, name: 'apple' },
  { index: 2, name: 'bar' },
  { index: 4, name: 'foo' },
]
```

### `to-for-each`

Convert for-of/for-in loop to `.forEach()`.

Triggers:
- `/// to-for-each`
- `/// foreach`

```js
/// to-for-each
for (const item of items) {
  if (!item)
    continue
  console.log(item)
}
```

Will be converted to:

```js
items.forEach((item) => {
  if (!item)
    return
  console.log(item)
})
```

For for-in loop:

```js
/// to-for-each
for (const key in obj) {
  if (!obj[key])
    continue
  console.log(obj[key])
}
```

Will be converted to:

```js
Object.keys(obj).forEach((key) => {
  if (!obj[key])
    return
  console.log(obj[key])
})
```

### `to-for-of`

Convert `.forEach()` to for-of loop.

Triggers:

- `/// to-for-of`
- `/// forof`

```js
/// to-for-of
items.forEach((item) => {
  if (!item)
    return
  console.log(item)
})
```

Will be converted to:

```js
for (const item of items) {
  if (!item)
    continue
  console.log(item)
}
```

### `to-dynamic-import`

Convert import statement to dynamic import.

Triggers:
- `/// to-dynamic-import`
- `/// to-dynamic`

```js
/// to-dynamic-import
import bar, { foo } from './foo'
```

Will be converted to:

```js
const { default: bar, foo } = await import('./foo')
```

### `to-string-literal`

Convert template literals to string literals.

Triggers:
- `/// to-string-literal`
- `/// to-sl`
- `/// 2string-literal`
- `/// 2sl`

or if you fancy `@`:

- `// @to-string-literal`
- `// @to-sl`
- `// @2string-literal`
- `// @2sl`

```js
/// @2sl
const foo = `foo`

// @2sl
const quxx = `${qux}quxx`

// Also supports using numbers to specify which items need to be converted (starts from 1)
// @2sl 1 3
const bar = `bar`; const baz = `baz`; const qux = `qux`
```

Will be converted to:

```js
const foo = 'bar'

// eslint-disable-next-line prefer-template
const quxx = qux + 'quxx'

const bar = 'bar'; const baz = `baz`; const qux = 'qux'
```

### `to-template-literal`

Convert string literals to template literals.

Triggers:
- `/// to-template-literal`
- `/// to-tl`
- `/// 2template-literal`
- `/// 2tl`

or if you fancy `@`:

- `// @to-template-literal`
- `// @to-tl`
- `// @2template-literal`
- `// @2tl`

```js
/// @2tl
const bar = 'bar'

// @2tl
// eslint-disable-next-line prefer-template
const quxx = qux + 'quxx'

// Also supports using numbers to specify which items need to be converted (starts from 1)
// @2tl 1 3
const foo = 'foo'; const baz = 'baz'; const qux = 'qux'
```

Will be converted to:

```js
const bar = `bar`

const quxx = `${qux}quxx`

const foo = `foo`; const baz = 'baz'; const qux = `qux`
```

### `to-promise-all`

Convert multiple `await` statements to `await Promise.all()`.

Triggers:
- `/// to-promise-all`
- `/// 2pa

```js
/// to-promise-all
const foo = await getFoo()
const { bar, baz } = await getBar()
```

Will be converted to:

```js
const [
  foo,
  { bar, baz },
] = await Promise.all([
  getFoo(),
  getBar(),
])
```

This command will try to search all continuous declarations with `await` and convert them to a single `await Promise.all()` call.

## Custom Commands

It's also possible to define your custom commands.

```js
// eslint.config.mjs
import command from 'eslint-plugin-command/config'
import { builtinCommands, defineCommand } from 'eslint-plugin-command/commands'

const myCommand = defineCommand({
  name: 'my-command',
  // RegExp to match the command comment (without leading `//`)
  match: /^@my-command$/,
  action(context) {
    // Do something with the context
  },
})

export default [
  // ... your other flat config
  command({
    commands: [
      ...builtinCommands,
      myCommand,
    ]
  }),
]
```

You can refer to [the built-in commands for examples](./src/commands/).

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
