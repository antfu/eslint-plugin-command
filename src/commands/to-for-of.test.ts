import { toForOf as command } from './to-for-of'
import { $, run } from './_test-utils'

run(
  command,
  {
    code: $`
    /// to-for-of
    bar.forEach(b => {
      if (!b)
        return
      console.log(b)
    })`,
    output: $`
    for (const b of bar) {
      if (!b)
        continue
      console.log(b)
    }`,
    errors: ['command-fix'],
  },
  // Chaining
  {
    code: $`
    /// to-for-of
    a.sort().filter(b => !!b).forEach(b => {
      console.log(b)
    })`,
    output: $`
    for (const b of a.sort().filter(b => !!b)) {
      console.log(b)
    }`,
    errors: ['command-fix'],
  },
  // Chaining multi-line
  {
    code: $`
    /// to-for-of
    a
      .sort()
      .filter(b => !!b)
      .forEach(b => {
        console.log(b)
      })`,
    output: $`
    for (const b of a
      .sort()
      .filter(b => !!b)) {
        console.log(b)
      }`,
    errors: ['command-fix'],
  },
  // forEach with index (TODO: support this)
  {
    code: $`
    /// to-for-of
    a.forEach((b, i) => {
      console.log(i, b)
    })`,
    errors: ['command-error', 'command-error-cause'],
  },
)
