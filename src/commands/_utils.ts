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
