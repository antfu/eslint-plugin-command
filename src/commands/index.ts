import { hoistRegExp } from './hoist-regexp'
import { toFunction } from './to-function'
import { toArrow } from './to-arrow'
import { keepSorted } from './keep-sorted'
import { toForEach } from './to-for-each'
import { toForOf } from './to-for-of'
import { toDestructuring } from './to-destructuring'
import { toDynamicImport } from './to-dynamic-import'
import { toStringLiteral } from './to-string-literal'
import { toTemplateLiteral } from './to-template-literal'
import { inlineArrow } from './inline-arrow'
import { toPromiseAll } from './to-promise-all'
import { noShorthand } from './no-shorthand'
import { noType } from './no-type'
import { keepUnique } from './keep-unique'
import { regex101 } from './regex101'
import { toTernary } from './to-ternary'

// @keep-sorted
export {
  hoistRegExp,
  inlineArrow,
  keepSorted,
  keepUnique,
  noShorthand,
  noType,
  regex101,
  toArrow,
  toDestructuring,
  toDynamicImport,
  toForEach,
  toForOf,
  toFunction,
  toPromiseAll,
  toStringLiteral,
  toTemplateLiteral,
  toTernary,
}

// @keep-sorted
export const builtinCommands = [
  hoistRegExp,
  inlineArrow,
  keepSorted,
  keepUnique,
  noShorthand,
  noType,
  regex101,
  toArrow,
  toDestructuring,
  toDynamicImport,
  toForEach,
  toForOf,
  toFunction,
  toPromiseAll,
  toStringLiteral,
  toTemplateLiteral,
  toTernary,
]
