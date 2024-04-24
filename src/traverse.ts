// Vendored from https://github.com/discord/eslint-traverse

import type { RuleContext } from '@typescript-eslint/utils/ts-eslint'
import type { TSESTree } from '@typescript-eslint/utils'

// @keep-sorted
export interface Path {
  node: TSESTree.Node
  parent: TSESTree.Node | null
  parentKey: string | null
  parentPath: Path | null
}

export const SKIP = Symbol('skip')
export const STOP = Symbol('stop')

export function traverse(
  context: RuleContext<any, any>,
  node: TSESTree.Node,
  visitor: (path: Path) => symbol | void,
) {
  const allVisitorKeys = context.sourceCode.visitorKeys
  const queue: Path[] = []

  // @keep-sorted
  queue.push({
    node,
    parent: null,
    parentKey: null,
    parentPath: null,
  })

  while (queue.length) {
    const currentPath = queue.shift()!

    const result = visitor(currentPath)
    if (result === STOP)
      break
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
}
