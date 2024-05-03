import { noType as command } from './no-type'
import { d, run } from './_test-utils'

run(
  command,
  {
    code: d`
    /// no-type
    let a: string`,
    output: d`
    let a`,
    errors: ['command-removal', 'command-fix'],
  },
  {
    code: d`
    /// no-type
    function a<T>(arg: A): R {}`,
    output: d`
    function a(arg) {}`,
    errors: ['command-removal', 'command-fix', 'command-fix', 'command-fix'],
  },
  {
    code: d`
    /// no-type
    declare const a: string`,
    output: d`
    declare const a`,
    errors: ['command-removal', 'command-fix'],
  },
  {
    code: d`
    /// no-type
    fn(arg as any)`,
    output: d`
    fn(arg)`,
    errors: ['command-removal', 'command-fix'],
  },
  {
    code: d`
    /// no-type
    fn(arg satisfies any)`,
    output: d`
    fn(arg)`,
    errors: ['command-removal', 'command-fix'],
  },
  {
    code: d`
    /// no-type
    fn(arg!)`,
    output: d`
    fn(arg)`,
    errors: ['command-removal', 'command-fix'],
  },
  {
    code: d`
    /// no-type
    fn(<string>arg)`,
    output: d`
    fn(arg)`,
    errors: ['command-removal', 'command-fix'],
  },
  {
    code: d`
    /// no-type
    const fn = foo<string>`,
    output: d`
    const fn = foo`,
    errors: ['command-removal', 'command-fix'],
  },
  {
    code: d`
    /// no-type
    type A = string`,
    output: '\n',
    errors: ['command-removal', 'command-fix'],
  },
  {
    code: d`
    /// nt
    const a = 1`,
    output: null,
    errors: 'command-error',
  },
)
