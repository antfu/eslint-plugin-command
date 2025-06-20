import { hoistRegExp } from './hoist-regexp'
import { inlineArrow } from './inline-arrow'
import { keepAligned } from './keep-aligned'
import { keepSorted } from './keep-sorted'
import { keepUnique } from './keep-unique'
import { noShorthand } from './no-shorthand'
import { noType } from './no-type'
import { noXAbove } from './no-x-above'
import { regex101 } from './regex101'
import { reverseIfElse } from './reverse-if-else'
import { toArrow } from './to-arrow'
import { toDestructuring } from './to-destructuring'
import { toDynamicImport } from './to-dynamic-import'
import { toForEach } from './to-for-each'
import { toForOf } from './to-for-of'
import { toFunction } from './to-function'
import { toOneLine } from './to-one-line'
import { toPromiseAll } from './to-promise-all'
import { toStringLiteral } from './to-string-literal'
import { toTemplateLiteral } from './to-template-literal'
import { toTernary } from './to-ternary'

// @keep-sorted
export {
  hoistRegExp,
  inlineArrow,
  keepAligned,
  keepSorted,
  keepUnique,
  noShorthand,
  noType,
  noXAbove,
  regex101,
  reverseIfElse,
  toArrow,
  toDestructuring,
  toDynamicImport,
  toForEach,
  toForOf,
  toFunction,
  toOneLine,
  toPromiseAll,
  toStringLiteral,
  toTemplateLiteral,
  toTernary,
}

// @keep-sorted
export const builtinCommands = [
  hoistRegExp,
  inlineArrow,
  keepAligned,
  keepSorted,
  keepUnique,
  noShorthand,
  noType,
  noXAbove,
  regex101,
  reverseIfElse,
  toArrow,
  toDestructuring,
  toDynamicImport,
  toForEach,
  toForOf,
  toFunction,
  toOneLine,
  toPromiseAll,
  toStringLiteral,
  toTemplateLiteral,
  toTernary,
]
