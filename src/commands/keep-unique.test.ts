import { keepUnique as command } from './keep-unique'
import { $, run } from './_test-utils'
import { keepSorted } from './keep-sorted'

run(
  [
    command,
    keepSorted,
  ],
  // Already unique
  $`
  // @keep-unique
  export const arr = [
    'apple',
    'bar',
    'foo',
  ]`,
  // Unique
  {
    code: $`
    // @keep-unique
    export const arr = [
      1, 2, 3, 2, 1, '3',
      3,
      4, '3', 
      false, true, false,
    ]`,
    output: $`
    // @keep-unique
    export const arr = [
      1, 2, 3, '3',
      4, false, true, 
    ]`,
    errors: ['command-fix'],
  },
  {
    description: 'Unique combine with sort',
    code: $`
    /**
     * @keep-unique @keep-sorted
     */
    export const arr = [ 3, 2, 1, 2, 1, 'foo', 'bar' ]`,
    output(output) {
      expect(output).toMatchInlineSnapshot(`
        "
        /**
         * @keep-unique @keep-sorted
         */
        export const arr = [ 'bar', 'foo', 1, 2, 3, ]"
      `)
    },
  },
)
