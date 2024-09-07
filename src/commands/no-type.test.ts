import { $, run } from './_test-utils'
import { noType as command } from './no-type'

run(
  command,
  {
    code: $`
      /// no-type
      let a: string
    `,
    output: $`
      let a
    `,
    errors: ['command-fix'],
  },
  {
    code: $`
      /// no-type
      function a<T>(arg: A): R {}
    `,
    output: $`
      function a(arg) {}
    `,
    errors: ['command-fix'],
  },
  {
    code: $`
      /// no-type
      declare const a: string
    `,
    output: $`
      declare const a
    `,
    errors: ['command-fix'],
  },
  {
    code: $`
      /// no-type
      fn(arg as any)
    `,
    output: $`
      fn(arg)
    `,
    errors: ['command-fix'],
  },
  {
    code: $`
      /// no-type
      fn(arg satisfies any)
    `,
    output: $`
      fn(arg)
    `,
    errors: ['command-fix'],
  },
  {
    code: $`
      /// no-type
      fn(arg!)
    `,
    output: $`
      fn(arg)
    `,
    errors: ['command-fix'],
  },
  {
    code: $`
      /// no-type
      fn(<string>arg)
    `,
    output: $`
      fn(arg)
    `,
    errors: ['command-fix'],
  },
  {
    code: $`
      /// no-type
      const fn = foo<string>
    `,
    output: $`
      const fn = foo
    `,
    errors: ['command-fix'],
  },
  {
    code: $`
      /// no-type
      type A = string
    `,
    output: '',
    errors: ['command-fix'],
  },
  {
    code: $`
      /// nt
      const a = 1
    `,
    errors: ['command-error'],
  },
)
