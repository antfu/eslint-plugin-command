# `no-type`

Removes TypeScript type annotations.

## Triggers

- `/// no-type`
- `/// nt`

## Examples

```js
/// no-type
const foo: string = 'foo'
```

Will be converted to:

```js
const foo = 'foo'
```
