import { hoistRegExp } from './hoist-regexp'
import { inlineArrow } from './inline-arrow'
import { keepSorted } from './keep-sorted'
import { keepUnique } from './keep-unique'
import { noShorthand } from './no-shorthand'
import { noType } from './no-type'
import { regex101 } from './regex101'
import { toArrow } from './to-arrow'
import { toDestructuring } from './to-destructuring'
import { toDynamicImport } from './to-dynamic-import'
import { toForEach } from './to-for-each'
import { toForOf } from './to-for-of'
import { toFunction } from './to-function'
import { toPromiseAll } from './to-promise-all'
import { toStringLiteral } from './to-string-literal'
import { toTemplateLiteral } from './to-template-literal'
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
