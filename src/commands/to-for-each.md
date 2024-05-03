# `to-for-each`

Convert for-of/for-in loop to `.forEach()`.

Revese command: [`to-for-of`](./to-for-of)

## Triggers

- `/// to-for-each`
- `/// foreach`

## Examples

```js
/// to-for-each
for (const item of items) {
  if (!item)
    continue
  console.log(item)
}
```

Will be converted to:

```js
items.forEach((item) => {
  if (!item)
    return
  console.log(item)
})
```

For for-in loop:

```js
/// to-for-each
for (const key in obj) {
  if (!obj[key])
    continue
  console.log(obj[key])
}
```

Will be converted to:

```js
Object.keys(obj).forEach((key) => {
  if (!obj[key])
    return
  console.log(obj[key])
})
```
