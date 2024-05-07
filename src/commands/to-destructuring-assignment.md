# `to-destructuring-assignment`

Convert import statement to dynamic import.

## Triggers

- `/// to-destructuring-assignment`
- `/// to-destructuring`
- `/// 2destructuring-assignment`
- `/// 2destructuring`

## Examples

```js
/// to-destructuring-assignment
const foo = bar.foo
```

Will be converted to:

```js
const { foo } = bar
```

```js
/// to-destructuring-assignment
const baz = bar.foo
```

Will be converted to:

```js
const { foo: baz } = bar
```

```js
/// to-destructuring-assignment
const foo = bar[0]
```

Will be converted to:

```js
const [foo] = bar
```

```js
/// to-destructuring-assignment
const foo = bar[1]
```

Will be converted to:

```js
const [,foo] = bar
```
