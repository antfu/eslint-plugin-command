import { noShorthand as command } from './no-shorthand'
import { $, run } from './_test-utils'

run(
  command,
  {
    code: $`
    /// no-shorthand
    const obj = fn({ a, b, c: d })`,
    output: $`
    const obj = fn({ a: a, b: b, c: d })`,
    errors: ['command-removal', 'command-fix', 'command-fix'],
  },
  {
    code: $`
    /// nsh
    const obj = 10`,
    output: null,
    errors: 'command-error',
  },
  {
    code: $`
    /// nsh
    const obj = { key: value, key2: value2 }`,
    output: null,
    errors: 'command-error',
  },
)
