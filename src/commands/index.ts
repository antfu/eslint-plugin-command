import { toFunction } from './to-function'
import { toArrow } from './to-arrow'
import { keepSorted } from './keep-sorted'
import { toForEach } from './to-for-each'
import { toForOf } from './to-for-of'
import { toDynamicImport } from './to-dynamic-import'

// @keep-sorted
export const commands = {
  keepSorted,
  toArrow,
  toDynamicImport,
  toForEach,
  toForOf,
  toFunction,
}
