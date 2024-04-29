import { toFunction } from './to-function'
import { toArrow } from './to-arrow'
import { keepSorted } from './keep-sorted'
import { toForEach } from './to-for-each'
import { toForOf } from './to-for-of'
import { toDynamicImport } from './to-dynamic-import'
import { toStringLiteral } from './to-string-literal'
import { toTemplateLiteral } from './to-template-literal'

// @keep-sorted
export {
  keepSorted,
  toArrow,
  toDynamicImport,
  toForEach,
  toForOf,
  toFunction,
  toStringLiteral,
  toTemplateLiteral,
}

// @keep-sorted
export const builtinCommands = [
  keepSorted,
  toArrow,
  toDynamicImport,
  toForEach,
  toForOf,
  toFunction,
  toStringLiteral,
  toTemplateLiteral,
]
