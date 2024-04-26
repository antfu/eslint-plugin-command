import type { Command } from '../types'
import { getNodesByIndexes, parseToNumberArray } from './_utils'

export const toStringLiteral: Command = {
  name: 'to-string-literal',
  match: /^[\/:@]\s*(?:to-|2)?(?:string-literal|sl)\s{0,}(.*)?$/,
  action(ctx) {
    const numbers = ctx.matches[1]
    // From integers 1-based to 0-based to match array indexes
    const indexes = parseToNumberArray(numbers, true).map(n => n - 1)
    const nodes = ctx.findNodesBelow('TemplateLiteral')
    if (!nodes)
      return
    for (const node of getNodesByIndexes(nodes, indexes)) {
      const raw = `'${ctx.source.getText(node).slice(1, -1)}'`
      ctx.report({
        node,
        message: 'Convert to string literal',
        fix(fixer) {
          return fixer.replaceTextRange(node.range, raw)
        },
      })
    }
  },
}
