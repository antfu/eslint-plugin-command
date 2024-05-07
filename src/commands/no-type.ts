import type { Command } from '../types'

export const noType: Command = {
  name: 'no-type',
  match: /^[\/:@]\s*(no-type|nt)$/,
  action(ctx) {
    const nodes = ctx.findNodeBelow({
      filter: node => node.type.startsWith('TS'),
      findAll: true,
      shallow: true,
    })

    if (!nodes || nodes.length === 0)
      return ctx.reportError('Unable to find type to remove')

    ctx.report({
      nodes,
      message: 'Remove type',
      *fix(fixer) {
        for (const node of nodes.reverse()) {
          if (node.type === 'TSAsExpression' // foo as number
            || node.type === 'TSSatisfiesExpression' // foo satisfies T
            || node.type === 'TSNonNullExpression' // foo!
            || node.type === 'TSInstantiationExpression') // foo<string>
            yield fixer.removeRange([node.expression.range[1], node.range[1]])
          else if (node.type === 'TSTypeAssertion') // <number>foo
            yield fixer.removeRange([node.range[0], node.expression.range[0]])
          else
            yield fixer.remove(node)
        }
      },
    })
  },
}
