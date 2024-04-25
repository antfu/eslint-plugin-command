// Vendored from https://github.com/discord/eslint-traverse

import type { RuleContext } from '@typescript-eslint/utils/ts-eslint'
import type { Tree } from './types'

// @keep-sorted
export interface TraversePath {
  node: Tree.Node
  parent: Tree.Node | null
  parentKey: string | null
  parentPath: TraversePath | null
}

export const SKIP = Symbol('skip')
export const STOP = Symbol('stop')

export type TraverseVisitor = (
  path: TraversePath,
  symbols: { SKIP: symbol, STOP: symbol }
) => symbol | void

export function traverse(
  context: RuleContext<any, any>,
  node: Tree.Node,
  visitor: TraverseVisitor,
): boolean {
  const allVisitorKeys = context.sourceCode.visitorKeys
  const queue: TraversePath[] = []

  // @keep-sorted
  queue.push({
    node,
    parent: null,
    parentKey: null,
    parentPath: null,
  })

  while (queue.length) {
    const currentPath = queue.shift()!

    const result = visitor(currentPath, { SKIP, STOP })
    if (result === STOP)
      return false
    if (result === SKIP)
      continue

    const visitorKeys = allVisitorKeys[currentPath.node.type]
    if (!visitorKeys)
      continue

    for (const visitorKey of visitorKeys) {
      const child = (currentPath.node as any)[visitorKey]

      if (!child) {
        continue
      }
      else if (Array.isArray(child)) {
        for (const item of child) {
          queue.push({
            node: item,
            parent: currentPath.node,
            parentKey: visitorKey,
            parentPath: currentPath,
          })
        }
      }
      else {
        queue.push({
          node: child,
          parent: currentPath.node,
          parentKey: visitorKey,
          parentPath: currentPath,
        })
      }
    }
  }

  return true
}
