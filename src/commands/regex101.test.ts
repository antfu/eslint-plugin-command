import { regex101 as command } from './regex101'
import { $, run } from './_test-utils'

run(
  command,
  // basic
  {
    code: $`
      // @regex101
      const foo = /(?:\\b|\\s)@regex101(\\s[^\\s]+)?(?:\\s|\\b|$)/g
    `,
    output: output => expect(output).toMatchInlineSnapshot(`
      "// @regex101 https://regex101.com/?regex=%28%3F%3A%5Cb%7C%5Cs%29%40regex101%28%5Cs%5B%5E%5Cs%5D%2B%29%3F%28%3F%3A%5Cs%7C%5Cb%7C%24%29&flags=g&flavor=javascript
      const foo = /(?:\\b|\\s)@regex101(\\s[^\\s]+)?(?:\\s|\\b|$)/g"
    `),
    errors: ['command-fix'],
  },
  // block comment
  {
    code: $`
      /**
       * Some jsdoc
       * 
       * @regex101
       * @deprecated
       */
      const foo = /(['"])?(foo|bar)\\1?/gi
    `,
    output: output => expect(output).toMatchInlineSnapshot(`
      "/**
       * Some jsdoc
       * 
       * @regex101 https://regex101.com/?regex=%28%5B%27%22%5D%29%3F%28foo%7Cbar%29%5C1%3F&flags=gi&flavor=javascript
       * @deprecated
       */
      const foo = /(['"])?(foo|bar)\\1?/gi"
    `),
    errors: ['command-fix'],
  },
  // example block
  {
    code: $`
      /**
       * Some jsdoc
       * 
       * @example str
       * \`\`\`js
       * if ('foo'.match(foo)) {
       *   const foo = bar
       * }
       * \`\`\`
       * 
       * @regex101
       */
      const foo = /(['"])?(foo|bar)\\1?/gi
    `,
    output: output => expect(output).toMatchInlineSnapshot(`
      "/**
       * Some jsdoc
       * 
       * @example str
       * \`\`\`js
       * if ('foo'.match(foo)) {
       *   const foo = bar
       * }
       * \`\`\`
       * 
       * @regex101 https://regex101.com/?regex=%28%5B%27%22%5D%29%3F%28foo%7Cbar%29%5C1%3F&flags=gi&flavor=javascript&testString=if+%28%27foo%27.match%28foo%29%29+%7B%0A++const+foo+%3D+bar%0A%7D
       */
      const foo = /(['"])?(foo|bar)\\1?/gi"
    `),
    errors: ['command-fix'],
  },
)
