# `no-type`

Removes TypeScript type annotations.

## Triggers

- `/// no-type`
- `/// nt`

## Examples

```ts
/// no-type
const foo: string = 'foo'
```

Will be converted to:

```ts
const foo = 'foo'
```
