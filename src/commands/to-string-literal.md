# `to-string-literal`

Convert template literals to string literals.

Revese command: [`to-template-literal`](./to-template-literal)

## Triggers

- `/// to-string-literal`
- `/// to-sl`
- `/// 2string-literal`
- `/// 2sl`

or if you fancy `@`:

- `// @to-string-literal`
- `// @to-sl`
- `// @2string-literal`
- `// @2sl`

## Examples

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
