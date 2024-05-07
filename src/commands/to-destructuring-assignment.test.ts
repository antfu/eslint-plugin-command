import { toDestructuringAssignment as command } from './to-destructuring-assignment'
import { $, run } from './_test-utils'

run(
  command,
  {
    code: $`
    /// to-destructuring-assignment
    const foo = bar.foo`,
    output: $`
    const { foo } = bar`,
    errors: ['command-removal', 'command-fix'],
  },
  {
    code: $`
    /// to-destructuring-assignment
    const baz = bar.foo`,
    output: $`
    const { foo: baz } = bar`,
    errors: ['command-removal', 'command-fix'],
  },
  {
    code: $`
    /// to-destructuring-assignment
    const foo = bar?.foo`,
    output: $`
    const { foo } = bar ?? {}`,
    errors: ['command-removal', 'command-fix'],
  },
  {
    code: $`
    /// to-destructuring-assignment
    const foo = bar[1]`,
    output: $`
    const [,foo] = bar`,
    errors: ['command-removal', 'command-fix'],
  },
  {
    code: $`
    /// to-destructuring-assignment
    const foo = bar?.[0]`,
    output: $`
    const [foo] = bar ?? []`,
    errors: ['command-removal', 'command-fix'],
  },
  {
    code: $`
    /// to-destructuring-assignment
    const foo = bar().foo`,
    output: $`
    const { foo } = bar()`,
    errors: ['command-removal', 'command-fix'],
  },
  {
    code: $`
    /// to-destructuring-assignment
    const foo = bar()?.foo`,
    output: $`
    const { foo } = bar() ?? {}`,
    errors: ['command-removal', 'command-fix'],
  },
  {
    code: $`
    /// to-destructuring-assignment
    foo = bar.foo`,
    output: $`
    ;({ foo } = bar)`,
    errors: ['command-removal', 'command-fix'],
  },
  {
    code: $`
    /// to-destructuring-assignment
    baz = bar.foo`,
    output: $`
    ;({ foo: baz } = bar)`,
    errors: ['command-removal', 'command-fix'],
  },
  {
    code: $`
    /// to-destructuring-assignment
    foo = bar[0]`,
    output: $`
    ;([foo] = bar)`,
    errors: ['command-removal', 'command-fix'],
  },
  {
    code: $`
    /// to-destructuring-assignment
    foo = bar().foo`,
    output: $`
    ;({ foo } = bar())`,
    errors: ['command-removal', 'command-fix'],
  },
  {
    code: $`
    /// to-destructuring-assignment
    baz = bar().foo`,
    output: $`
    ;({ foo: baz } = bar())`,
    errors: ['command-removal', 'command-fix'],
  },
)
