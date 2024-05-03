import { toPromiseAll as command } from './to-promise-all'
import { d, run } from './_test-utils'

run(
  command,
  // Program level
  {
    code: d`
      /// to-promise-all
      const a = await foo()
      const b = await bar()
    `,
    output: d`
      const [
      a,
      b,
      ] = await Promise.all([
      foo(),
      bar(),
      ])
    `,
    errors: ['command-removal', 'command-fix'],
  },
  // Function declaration
  {
    filename: 'index.ts',
    code: d`
      async function fn() {
        /// to-promise-all
        const a = await foo()
        const b = await bar()
      }
    `,
    output: d`
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
    errors: ['command-removal', 'command-fix'],
  },
  // If Statement
  {
    code: d`
      if (true) {
        /// to-promise-all
        const a = await foo()
          .then(() => {})
        const b = await import('bar').then(m => m.default)
      }
    `,
    output: d`
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
    errors: ['command-removal', 'command-fix'],
  },
  // Mixed declarations
  {
    code: d`
      on('event', async () => {
        /// to-promise-all
        let a = await foo()
          .then(() => {})
        const { foo, bar } = await import('bar').then(m => m.default)
        const b = await baz(), c = await qux(), d = foo()
      })
    `,
    output: d`
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
    errors: ['command-removal', 'command-fix'],
  },
  // Await expressions
  {
    code: d`
      /// to-promise-all
      const a = await bar()
      await foo()
      const b = await baz()
      doSomething()
      const nonTarget = await qux()
    `,
    output: d`
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
    errors: ['command-removal', 'command-fix'],
  },
  // Should stop on first non-await expression
  {
    code: d`
      /// to-promise-all
      const a = await bar()
      let b = await foo()
      let c = baz()
      const d = await qux()
    `,
    output: d`
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
    errors: ['command-removal', 'command-fix'],
  },
)
