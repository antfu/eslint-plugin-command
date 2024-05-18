import { toTernary as command } from './to-ternary'
import { $, run } from './_test-utils'

run(
  command,
  // no `else`
  {
    code: $`
      /// to-ternary
      if (c1)
        foo()
      else if (c2)
        bar = 1
    `,
    errors: ['command-error'],
  },
  // too many lines in a `if`
  {
    code: $`
      /// 2ternary
      if (c1) {
        foo()
        bar = 1
      }
      else {
        bar = 2
      }
    `,
    errors: ['command-error'],
  },
  // normal
  {
    code: $`
      /// to-3
      if (c1)
        foo()
      else
        bar = 1
    `,
    output: $`
      c1 ? foo() : bar = 1
    `,
    errors: ['command-fix'],
  },
  // more `else-if` and block
  {
    code: $`
      /// 23
      if (a > b) {
        foo()
      }
      else if (c2) {
        bar = 1
      }
      else {
        baz()
      }
    `,
    output: $`
      a > b ? foo() : c2 ? bar = 1 : baz()
    `,
    errors: ['command-fix'],
  },
  // same name assignment
  {
    code: $`
      /// to-ternary
      if (c1)
        foo = 1
      else if (c2)
        foo = bar
      else
        foo = baz()
    `,
    output: $`
      foo = c1 ? 1 : c2 ? bar : baz()
    `,
    errors: ['command-fix'],
  },
  // different names assignment
  {
    code: $`
      /// to-ternary
      if (c1)
        foo = 1
      else if (c2)
        bar = 2
      else
        baz()
    `,
    output: $`
      c1 ? foo = 1 : c2 ? bar = 2 : baz()
    `,
    errors: ['command-fix'],
  },
)
