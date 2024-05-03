# `to-for-of`

Convert `.forEach()` to for-of loop.

Revese command: [`to-for-each`](./to-for-each)

## Triggers

- `/// to-for-of`
- `/// forof`

## Examples

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
