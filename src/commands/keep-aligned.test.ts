import { $, run } from './_test-utils'
import { keepAligned } from './keep-aligned'

run(
  keepAligned,
  {
    code: $`
      // @keep-aligned , , ,
      export const matrix = [
        1, 0, 0,
        0.866, -0.5, 0,
        0.5, 0.866, 42,
      ]
    `,
    output(output) {
      expect(output).toMatchInlineSnapshot(`
        "// @keep-aligned , , ,
        export const matrix = [
          1    , 0    , 0 ,
          0.866, -0.5 , 0 ,
          0.5  , 0.866, 42,
        ]"
      `)
    },
  },
  {
    code: $`
      // @keep-aligned , , ]
      export const matrix = [
        [1, 0, 0],
        [0.866, -0.5, 0],
        [0.5, 0.866, 42],
      ] 
    `,
    output(output) {
      expect(output).toMatchInlineSnapshot(`
        "// @keep-aligned , , ]
        export const matrix = [
          [1    , 0    , 0 ],
          [0.866, -0.5 , 0 ],
          [0.5  , 0.866, 42],
        ] "
      `)
    },
  },
  {
    code: $`
      /// keep-aligned* ,
      export const matrix = [
        1, 0, 0, 0.866, 0.5, 0.866, 42,
        0.866, -0.5, 0, 0.5, 0.121212,
        0.5, 0.866, 118, 1, 0, 0, 0.866, -0.5, 12,
      ] 
    `,
    output(output) {
      expect(output).toMatchInlineSnapshot(`
        "/// keep-aligned* ,
        export const matrix = [
          1    , 0    , 0  , 0.866, 0.5     , 0.866, 42   ,
          0.866, -0.5 , 0  , 0.5  , 0.121212,
          0.5  , 0.866, 118, 1    , 0       , 0    , 0.866, -0.5, 12,
        ] "
      `)
    },
  },
  {
    code: $`
      function foo(arr: number[][], i: number, j: number) {
        // @keep-aligned arr[ ] arr[ ] ][j
        return arr[i - 1][j - 1] + arr[i - 1][j] + arr[i - 1][j + 1]
          + arr[i][j - 1] + arr[i][j] + arr[i][j + 1]
          + arr[i + 1][j - 1] + arr[i + 1][j] + arr[i][j + 1]
      }
    `,
    output(output) {
      expect(output).toMatchInlineSnapshot(`
        "function foo(arr: number[][], i: number, j: number) {
          // @keep-aligned arr[ ] arr[ ] ][j
          return arr[i - 1][j - 1] + arr[i - 1][j] + arr[i - 1][j + 1]
            +    arr[i    ][j - 1] + arr[i    ][j] + arr[i    ][j + 1]
            +    arr[i + 1][j - 1] + arr[i + 1][j] + arr[i    ][j + 1]
        }"
      `)
    },
  },
)
