# `keep-aligned`

Keep specific symbols within a block of code are aligned vertically.

## Triggers

- `/// keep-aligned <symbols>`
- `// @keep-aligned <symbols>`

### Examples

```typescript
// @keep-aligned , , ,
export const matrix = [
  1, 0, 0,
  0.866, -0.5, 0,
  0.5, 0.866, 42,
]
```

Will be converted to:

```typescript
// @keep-aligned , , ,
export const matrix = [
  1    , 0    , 0 ,
  0.866, -0.5 , 0 ,
  0.5  , 0.866, 42,
]
```

#### Repeat Mode

For the example above where `,` is the only repeating symbol for alignment, `keep-aligned*` could be used instead to indicate a repeating pattern:

```typescript
// @keep-aligned* ,
export const matrix = [
  1, 0, 0,
  0.866, -0.5, 0,
  0.5, 0.866, 42,
]
```

Will produce the same result.
