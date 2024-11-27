import type { Command } from '../types'

const types = [
  'await',

  // TODO: implement
  // 'statements',
  // 'functions',
] as const

export const noXAbove: Command = {
  name: 'no-x-above',
  match: new RegExp(`^\\s*[/:@]\\s*no-(${types.join('|')})-(above|below)$`),
  action(ctx) {
    const type = ctx.matches[1] as (typeof types)[number]
    const direction = ctx.matches[2] as 'above' | 'below'

    const node = ctx.findNodeBelow(() => true)
    const parent = node?.parent
    if (!parent)
      return ctx.reportError('No parent node found')

    if (parent.type !== 'Program' && parent.type !== 'BlockStatement')
      return ctx.reportError('Parent node is not a block')

    const children = parent.body

    const targetNodes = direction === 'above'
      ? children.filter(c => c.range[1] <= ctx.comment.range[0])
      : children.filter(c => c.range[0] >= ctx.comment.range[1])

    if (!targetNodes.length)
      return

    switch (type) {
      case 'await':
        for (const target of targetNodes) {
          ctx.traverse(target, (path, { SKIP }) => {
            if (path.node.type === 'FunctionDeclaration' || path.node.type === 'FunctionExpression' || path.node.type === 'ArrowFunctionExpression') {
              return SKIP
            }
            if (path.node.type === 'AwaitExpression') {
              ctx.report({
                node: path.node,
                message: 'Disallowed await expression',
              })
            }
          })
        }
        return
      default:
        return ctx.reportError(`Unknown type: ${type}`)
    }
    // console.log({ targetRange: targetNodes })
  },
}
