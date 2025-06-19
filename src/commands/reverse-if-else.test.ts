import { $, run } from './_test-utils'
import { reverseIfElse as command } from './reverse-if-else'

run(
  command,
  {
    code: $`
      /// reverse-if-else
      const foo = 'bar'
    `,
    errors: ['command-error'],
  },
  // with else if
  {
    code: $`
      /// reverse-if-else
      if (a === 1) {
        a = 2
      }
      else if (a === 2) {
        a = 3
      }
    `,
    errors: ['command-error'],
  },
  {
    code: $`
      /// reverse-if-else
      if (a === 1) {
        a = 2
      }
      else {
        a = 3
      }
    `,
    output: $`
      if (!(a === 1)) {
        a = 3
      }
      else {
        a = 2
      }
    `,
    errors: ['command-fix'],
  },
)
