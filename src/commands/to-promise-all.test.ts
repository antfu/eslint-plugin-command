import { toPromiseAll as command } from './to-promise-all'
import { $, run } from './_test-utils'

run(
  command,
  {
    description: 'Program level',
    code: $`
      /// to-promise-all
      const a = await foo()
      const b = await bar()
    `,
    output: $`
      const [
      a,
      b,
      ] = await Promise.all([
      foo(),
      bar(),
      ])
    `,
    errors: ['command-fix'],
  },
  // Function declaration
  {
    filename: 'index.ts',
    code: $`
      async function fn() {
        /// to-promise-all
        const a = await foo()
        const b = await bar()
      }
    `,
    output: $`
      async function fn() {
        const [
        a,
        b,
        ] = await Promise.all([
        foo(),
        bar(),
        ] as const)
      }
    `,
    errors: ['command-fix'],
  },
  // If Statement
  {
    code: $`
      if (true) {
        /// to-promise-all
        const a = await foo()
          .then(() => {})
        const b = await import('bar').then(m => m.default)
      }
    `,
    output: $`
      if (true) {
        const [
        a,
        b,
        ] = await Promise.all([
        foo()
          .then(() => {}),
        import('bar').then(m => m.default),
        ])
      }
    `,
    errors: ['command-fix'],
  },
  // Mixed declarations
  {
    code: $`
      on('event', async () => {
        /// to-promise-all
        let a = await foo()
          .then(() => {})
        const { foo, bar } = await import('bar').then(m => m.default)
        const b = await baz(), c = await qux(), d = foo()
      })
    `,
    output: $`
      on('event', async () => {
        let [
        a,
        { foo, bar },
        b,
        c,
        d,
        ] = await Promise.all([
        foo()
          .then(() => {}),
        import('bar').then(m => m.default),
        baz(),
        qux(),
        foo(),
        ])
      })
    `,
    errors: ['command-fix'],
  },
  // Await expressions
  {
    code: $`
      /// to-promise-all
      const a = await bar()
      await foo()
      const b = await baz()
      doSomething()
      const nonTarget = await qux()
    `,
    output: $`
      const [
      a,
      /* discarded */,
      b,
      ] = await Promise.all([
      bar(),
      foo(),
      baz(),
      ])
      doSomething()
      const nonTarget = await qux()
    `,
    errors: ['command-fix'],
  },
  // Should stop on first non-await expression
  {
    code: $`
      /// to-promise-all
      const a = await bar()
      let b = await foo()
      let c = baz()
      const d = await qux()
    `,
    output: $`
      let [
      a,
      b,
      ] = await Promise.all([
      bar(),
      foo(),
      ])
      let c = baz()
      const d = await qux()
    `,
    errors: ['command-fix'],
  },
)
