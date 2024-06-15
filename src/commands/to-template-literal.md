# `to-template-literal`

Convert string literals to template literals.

Revese command: [`to-string-literal`](./to-string-literal)

## Triggers

- `/// to-template-literal`
- `/// to-tl`
- `/// 2template-literal`
- `/// 2tl`

or if you fancy `@`:

- `// @to-template-literal`
- `// @to-tl`
- `// @2template-literal`
- `// @2tl`

## Examples

```js
/// @2tl
const bar = 'bar'

// @2tl
// eslint-disable-next-line prefer-template
const quxx = bar + 'quxx'

// Also supports using numbers to specify which items need to be converted (starts from 1)
// @2tl 1 3
const foo = 'foo'; const baz = 'baz'; const qux = 'qux'
```

Will be converted to:

```js
const bar = `bar`

const quxx = `${bar}quxx`

const foo = `foo`; const baz = 'baz'; const qux = `qux`
```
