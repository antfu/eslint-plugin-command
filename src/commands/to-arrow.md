# `to-arrow`

Convert a standard function declaration to an arrow function.

Revese command: [`to-function`](./to-function)

## Triggers

- `/// to-arrow`
- `/// 2a`

## Examples

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
