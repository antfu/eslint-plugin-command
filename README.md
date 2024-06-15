# eslint-plugin-command

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]

[**Documentations**](https://eslint-plugin-command.antfu.me/)

Comment-as-command for one-off codemod with ESLint.

https://github.com/antfu/eslint-plugin-command/assets/11247099/ec401a21-4081-42d0-8748-9d0376b7d501

## Introduction

**ESLint Plugin Command** is a special kind of ESLint plugin, that by default, **does nothing**. Instead of checking for code quality, it serves as a micro-codemod tool triggers by special comments on-demand, resuse the infrastructure of ESLint.

For example, one of the built-in commands, `/// to-function` allows you to convert a single arrow function expression to a function declaration.

<!-- eslint-skip -->

```ts
/// to-function
const foo = async <T>(msg: T): void => {
  console.log(msg)
}
```

Will be transformed to this when you hit save with your editor or run `eslint . --fix`. After executing the command, the comment will also be removed along with the transformation:

```ts
async function foo<T>(msg: T): void {
  console.log(msg)
}
```

One more example that `/// to-promis-all` converts a sequence of `await` expressions to `await Promise.all()`:

<!-- eslint-skip -->

```ts
/// to-promise-all
const foo = await bar().then
const { get } = await import('lodash-es')
```

Will be transformed to:

```ts
const [
  foo,
  { get },
] = await Promise.all([
  bar(),
  import('lodash-es'),
] as const)
```

Refer to the [documentation](https://eslint-plugin-command.antfu.me/) for more details.

## Sponsors

<p align="center">
  <a href="https://cdn.jsdelivr.net/gh/antfu/static/sponsors.circles.svg">
    <img src='https://cdn.jsdelivr.net/gh/antfu/static/sponsors.circles.svg'/>
  </a>
</p>

## License

MIT License © 2024-PRESENT [Anthony Fu](https://github.com/antfu)

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/eslint-plugin-command?style=flat&colorA=080f12&colorB=1fa669
[npm-version-href]: https://npmjs.com/package/eslint-plugin-command
[npm-downloads-src]: https://img.shields.io/npm/dm/eslint-plugin-command?style=flat&colorA=080f12&colorB=1fa669
[npm-downloads-href]: https://npmjs.com/package/eslint-plugin-command
