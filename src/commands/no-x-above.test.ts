import { $, run } from './_test-utils'
import { noXAbove as command } from './no-x-above'

run(
  command,
  // {
  //   code: $`
  //     /// no-await-below
  //     const obj = await foo()
  //   `,
  //   errors: ['command-error'],
  // },
  // $`
  //   const obj = await foo()
  //   /// no-await-below
  //   const obj = foo()
  // `,
  // {
  //   code: $`
  //     const obj = await foo()
  //     /// no-await-above
  //     const obj = foo()
  //   `,
  //   errors: ['command-fix'],
  // },
  // // Don't count outside of scope
  // $`
  //   await foo()
  //   async function foo() {
  //     /// no-await-above
  //     const obj = await Promise.all([])
  //   }
  // `,
  // Don't count inside
  $`
    async function foo() {
      /// no-await-below
      console.log('foo')
      const bar = async () => {
        const obj = await Promise.all([])
      }
    }
  `,
)
