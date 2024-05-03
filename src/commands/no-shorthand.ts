import type { AST_NODE_TYPES } from '@typescript-eslint/utils'
import type { Command } from '../types'

export const noShorthand: Command = {
  name: 'no-shorthand',
  match: /^[\/:@]\s*(no-shorthand|ns)$/,
  action(ctx) {
    const nodes = ctx.findNodeBelow<AST_NODE_TYPES.Property>({
      filter: node => node.type === 'Property' && node.shorthand,
      findAll: true,
    })
    if (!nodes || nodes.length === 0)
      return ctx.reportError('Unable to find shorthand object property to convert')

    ctx.removeComment()
    for (const node of nodes) {
      ctx.report({
        node,
        message: 'Expand shorthand',
        fix(fixer) {
          return fixer.insertTextAfter(node.key, `: ${ctx.getTextOf(node.key)}`)
        },
      })
    }
  },
}
