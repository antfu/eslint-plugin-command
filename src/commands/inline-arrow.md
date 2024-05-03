# `inline-arrow`

Inline return statement of arrow function.

## Triggers

- `/// inline-arrow`
- `/// ia`

## Examples

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
