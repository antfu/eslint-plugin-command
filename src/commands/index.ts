import { toFunction } from './to-function'
import { toArrow } from './to-arrow'
import { keepSorted } from './keep-sorted'
import { toForEach } from './to-for-each'
import { toForOf } from './to-for-of'
import { toDynamicImport } from './to-dynamic-import'
import { interconvertStringTemplateLiteral } from './interconvert-string-template-literal'

// @keep-sorted
export {
  interconvertStringTemplateLiteral,
  keepSorted,
  toArrow,
  toDynamicImport,
  toForEach,
  toForOf,
  toFunction,
}

// @keep-sorted
export const builtinCommands = [
  interconvertStringTemplateLiteral,
  keepSorted,
  toArrow,
  toDynamicImport,
  toForEach,
  toForOf,
  toFunction,
]
