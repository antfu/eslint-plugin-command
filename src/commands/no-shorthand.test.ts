import { noShorthand as command } from './no-shorthand'
import { d, run } from './_test-utils'

run(
  command,
  {
    code: d`
    /// no-shorthand
    const obj = fn({ a, b, c: d })`,
    output: d`
    const obj = fn({ a: a, b: b, c: d })`,
    errors: ['command-removal', 'command-fix', 'command-fix'],
  },
  {
    code: d`
    /// nsh
    const obj = 10`,
    output: null,
    errors: 'command-error',
  },
  {
    code: d`
    /// nsh
    const obj = { key: value, key2: value2 }`,
    output: null,
    errors: 'command-error',
  },
)
