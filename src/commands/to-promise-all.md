# `to-promise-all`

Convert multiple `await` statements to `await Promise.all()`.

## Triggers

- `/// to-promise-all`
- `/// 2pa`

## Examples

```js
/// to-promise-all
const foo = await getFoo()
const { bar, baz } = await getBar()
```

Will be converted to:

```js
const [
  foo,
  { bar, baz },
] = await Promise.all([
  getFoo(),
  getBar(),
])
```

This command will try to search all continuous declarations with `await` and convert them to a single `await Promise.all()` call.
