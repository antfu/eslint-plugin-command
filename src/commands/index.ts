import { toFunction } from './to-function'
import { toArrow } from './to-arrow'
import { keepSorted } from './keep-sorted'
import { toForEach } from './to-for-each'
import { toForOf } from './to-for-of'
import { toDynamicImport } from './to-dynamic-import'
import { toStringLiteral } from './to-string-literal'
import { toTemplateLiteral } from './to-template-literal'
import { inlineArrow } from './inline-arrow'
import { toPromiseAll } from './to-promise-all'

// @keep-sorted
export {
  inlineArrow,
  keepSorted,
  toArrow,
  toDynamicImport,
  toForEach,
  toForOf,
  toFunction,
  toPromiseAll,
  toStringLiteral,
  toTemplateLiteral,
}

// @keep-sorted
export const builtinCommands = [
  inlineArrow,
  keepSorted,
  toArrow,
  toDynamicImport,
  toForEach,
  toForOf,
  toFunction,
  toPromiseAll,
  toStringLiteral,
  toTemplateLiteral,
]
