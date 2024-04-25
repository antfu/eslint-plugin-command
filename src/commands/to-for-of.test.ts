import { toForOf as command } from './to-for-of'
import { d, run } from './_test-utils'

run(
  command,
  {
    code: d`
    /// to-for-of
    bar.forEach(b => {
      if (!b)
        return
      console.log(b)
    })`,
    output: d`
    for (const b of bar) {
      if (!b)
        continue
      console.log(b)
    }`,
    errors: ['command-removal', 'command-fix'],
  },
  // Chaining
  {
    code: d`
    /// to-for-of
    a.sort().filter(b => !!b).forEach(b => {
      console.log(b)
    })`,
    output: d`
    for (const b of a.sort().filter(b => !!b)) {
      console.log(b)
    }`,
    errors: ['command-removal', 'command-fix'],
  },
  // Chaining multi-line
  {
    code: d`
    /// to-for-of
    a
      .sort()
      .filter(b => !!b)
      .forEach(b => {
        console.log(b)
      })`,
    output: d`
    for (const b of a
      .sort()
      .filter(b => !!b)) {
        console.log(b)
      }`,
    errors: ['command-removal', 'command-fix'],
  },
  // forEach with index (TODO: support this)
  {
    code: d`
    /// to-for-of
    a.forEach((b, i) => {
      console.log(i, b)
    })`,
    output: null,
    errors: ['command-error', 'command-error-cause'],
  },
)
