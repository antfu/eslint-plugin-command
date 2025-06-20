# `reverse-if-else`

Reverse the order of if-else statements and negate the condition.

## Triggers

- `/// reverse-if-else`
- `/// rife`
- `/// rif`

## Examples

```ts
/// reverse-if-else
if (a === 1) {
  a = 2
}
else {
  a = 3
}
```

Will be converted to:

```ts
if (!(a === 1)) {
  a = 3
}
else {
  a = 2
}
```
