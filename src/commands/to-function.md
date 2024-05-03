# `to-function`

Convert an arrow function to a standard function declaration.

Revese command: [`to-arrow`](./to-arrow)

## Triggers

- `/// to-function`
- `/// to-fn`
- `/// 2f`

## Examples

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
