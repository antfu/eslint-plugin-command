import { toDestructuring as command } from './to-destructuring'
import { $, run } from './_test-utils'

run(
  command,
  {
    code: $`
      /// to-destructuring
      const foo = bar.foo
    `,
    output: $`
      const { foo } = bar
    `,
    errors: ['command-fix'],
  },
  {
    code: $`
      /// to-destructuring
      const baz = bar.foo
    `,
    output: $`
      const { foo: baz } = bar
    `,
    errors: ['command-fix'],
  },
  {
    code: $`
      /// to-destructuring
      const foo = bar?.foo
    `,
    output: $`
      const { foo } = bar ?? {}
    `,
    errors: ['command-fix'],
  },
  {
    code: $`
      /// to-destructuring
      const foo = bar[1]
    `,
    output: $`
      const [,foo] = bar
    `,
    errors: ['command-fix'],
  },
  {
    code: $`
      /// to-destructuring
      const foo = bar?.[0]
    `,
    output: $`
      const [foo] = bar ?? []
    `,
    errors: ['command-fix'],
  },
  {
    code: $`
      /// to-destructuring
      const foo = bar().foo
    `,
    output: $`
      const { foo } = bar()
    `,
    errors: ['command-fix'],
  },
  {
    code: $`
      /// to-destructuring
      const foo = bar()?.foo
    `,
    output: $`
      const { foo } = bar() ?? {}
    `,
    errors: ['command-fix'],
  },
  {
    code: $`
      /// to-destructuring
      foo = bar.foo
    `,
    output: $`
      ;({ foo } = bar)
    `,
    errors: ['command-fix'],
  },
  {
    code: $`
      /// to-destructuring
      baz = bar.foo
    `,
    output: $`
      ;({ foo: baz } = bar)
    `,
    errors: ['command-fix'],
  },
  {
    code: $`
      /// to-destructuring
      foo = bar[0]
    `,
    output: $`
      ;([foo] = bar)
    `,
    errors: ['command-fix'],
  },
  {
    code: $`
      /// to-destructuring
      foo = bar().foo
    `,
    output: $`
      ;({ foo } = bar())
    `,
    errors: ['command-fix'],
  },
  {
    code: $`
      /// to-destructuring
      baz = bar().foo
    `,
    output: $`
      ;({ foo: baz } = bar())
    `,
    errors: ['command-fix'],
  },
)
