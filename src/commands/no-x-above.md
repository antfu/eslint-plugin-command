# `no-x-above`

Disallow certain syntaxes above or below the comment, with in the current block.

## Triggers

- `// @no-await-above` - Disallow `await` above the comment.
- `// @no-await-below` - Disallow `await` below the comment.

## Examples

```js
const foo = syncOp()
const bar = await asyncOp() // <-- this is not allowed
// @no-await-above
const baz = await asyncOp() // <-- this is ok
```

The effect will only affect the current scope, for example:

```js
console.log(await foo()) // <-- this is not checked, as it's not in the function scope where the comment is

async function foo() {
  const bar = syncOp()
  const baz = await asyncOp() // <-- this is not allowed
  // @no-await-above
  const qux = await asyncOp() // <-- this is ok
}
```
