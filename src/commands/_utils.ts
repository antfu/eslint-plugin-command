import type { Tree } from '../types'

export function getNodesByIndexes<T>(nodes: T[], indexes: number[]) {
  return indexes.length
    ? indexes.map(n => nodes[n]).filter(Boolean)
    : nodes
}

/**
 *
 * @param value Accepts a string of numbers separated by spaces
 * @param integer If true, only positive integers are returned
 */
export function parseToNumberArray(value: string | undefined, integer = false) {
  return value?.split(' ')
    .map(Number)
    .filter(n =>
      !Number.isNaN(n)
      && integer
        ? (Number.isInteger(n) && n > 0)
        : true,
    ) ?? []
}

export function insideRange(node: Tree.Node, range: [number, number], includeStart = true, includeEnd = true) {
  return (
    (includeStart ? node.range[0] >= range[0] : node.range[0] > range[0])
    && (includeEnd ? node.range[1] <= range[1] : node.range[1] < range[1])
  )
}

export function unwrapType(node: Tree.Node) {
  if (node.type === 'TSAsExpression' // foo as number
    || node.type === 'TSSatisfiesExpression' // foo satisfies T
    || node.type === 'TSNonNullExpression' // foo!
    || node.type === 'TSInstantiationExpression' // foo<string>
    || node.type === 'TSTypeAssertion') { // <number>foo
    return node.expression
  }
  return node
}
