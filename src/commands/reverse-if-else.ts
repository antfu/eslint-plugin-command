import type { AST_NODE_TYPES } from '@typescript-eslint/utils'
import type { Command } from '../types'
import { defineAlias } from '../utils'

export const reverseIfElse: Command = {
  name: 'reverse-if-else',
  get alias() {
    return defineAlias(this, ['rife', 'rif'])
  },
  match: /^\s*[/:@]\s*(reverse-if-else|rife|rif)$/,
  action(ctx) {
    const node = ctx.findNodeBelow('IfStatement')

    if (!node)
      return ctx.reportError('Cannot find if statement')

    const elseNode = node.alternate

    const isElseif = elseNode?.type === ('IfStatement' as AST_NODE_TYPES.IfStatement)
    if (isElseif)
      return ctx.reportError('Unable reverse when `else if` statement exist')

    const ifNode = node.consequent

    ctx.report({
      loc: node.loc,
      message: 'Reverse if-else',
      fix(fixer) {
        const lineIndent = ctx.getIndentOfLine(node.loc.start.line)

        const conditionText = ctx.getTextOf(node.test)
        const ifText = ctx.getTextOf(ifNode)
        const elseText = elseNode ? ctx.getTextOf(elseNode) : '{\n}'

        const str = [
          `if (!(${conditionText})) ${elseText}`,
          `else ${ifText}`,
        ]
          .map((line, idx) => idx ? lineIndent + line : line)
          .join('\n')

        return fixer.replaceText(node, str)
      },
    })
  },
}
