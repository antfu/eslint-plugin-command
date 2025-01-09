# `keep-aligned`

Keep specific symbols within a block of code are aligned vertically.

## Triggers

- `/// keep-aligned <symbols>`
- `// @keep-aligned <symbols>`

## Examples

<!-- eslint-skip -->

```typescript
// @keep-aligned , , ,
export const matrix = [
  1, 0, 0,
  0.866, -0.5, 0,
  0.5, 0.866, 42,
]
```

Will be converted to:

<!-- eslint-skip -->

```typescript
// @keep-aligned , , ,
export const matrix = [
  1    , 0    , 0 ,
  0.866, -0.5 , 0 ,
  0.5  , 0.866, 42,
]
```

### Repeat Mode

For the example above where `,` is the only repeating symbol for alignment, `keep-aligned*` could be used instead to indicate a repeating pattern:

<!-- eslint-skip -->

```typescript
// @keep-aligned* ,
export const matrix = [
  1, 0, 0,
  0.866, -0.5, 0,
  0.5, 0.866, 42,
]
```

Will produce the same result.

> [!TIP]
> This rule does not work well with other spacing rules, namely `style/no-multi-spaces, style/comma-spacing, antfu/consistent-list-newline` were disabled for the example above to work. Consider adding `/* eslint-disable */` to specific ESLint rules for lines affected by this command.
>
> ```typescript
> /* eslint-disable style/no-multi-spaces, style/comma-spacing, antfu/consistent-list-newline */
> // @keep-aligned , , ,
> export const matrix = [
>   1    , 0    , 0 ,
>   0.866, -0.5 , 0 ,
>   0.5  , 0.866, 42,
> ]
> /* eslint-enable style/no-multi-spaces, style/comma-spacing, antfu/consistent-list-newline */
> ```
