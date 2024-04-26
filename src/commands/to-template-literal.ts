import type { Command } from '../types'
import { getNodesByIndexes, parseToNumberArray } from './_utils'

export const toTemplateLiteral: Command = {
  name: 'to-template-literal',
  match: /^[\/:@]\s*(?:to-|2)?(?:template-literal|tl)\s{0,}(.*)?$/,
  action(ctx) {
    const numbers = ctx.matches[1]
    // From integers 1-based to 0-based to match array indexes
    const indexes = parseToNumberArray(numbers, true).map(n => n - 1)
    const nodes = ctx.findNodesBelow('Literal')?.filter(node => typeof node.value === 'string')
    if (!nodes)
      return
    for (const node of getNodesByIndexes(nodes, indexes)) {
      const raw = `\`${node.value}\``
      ctx.report({
        node,
        message: 'Convert to template literal',
        fix(fixer) {
          return fixer.replaceTextRange(node.range, raw)
        },
      })
    }
  },
}
