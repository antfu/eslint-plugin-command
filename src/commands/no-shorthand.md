# `no-shorthand`

Expand object shorthand properties to their full form.

## Triggers

- `/// no-shorthand`
- `/// ns`

## Examples

```js
/// no-shorthand
const obj = { a, b, c: 0 }
```

Will be converted to:

```js
// eslint-disable-next-line object-shorthand
const obj = { a: a, b: b, c: 0 }
```
