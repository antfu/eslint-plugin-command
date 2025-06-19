import type { Command } from '../types'
import { AST_NODE_TYPES } from '@typescript-eslint/utils'

export const reverseIfElse: Command = {
  name: 'reverse-if-else',
  match: /^\s*[/:@]\s*(reverse-if-else|rife|rif)$/,
  action(ctx) {
    const node = ctx.findNodeBelow('IfStatement')

    if (!node)
      return ctx.reportError('Cannot find if statement')

    const maybeElseNode = node?.alternate
    if (!maybeElseNode)
      return ctx.reportError('Cannot find else statement')

    const isElseif = maybeElseNode.type === AST_NODE_TYPES.IfStatement
    if (isElseif)
      return ctx.reportError('Unable reverse when `else if` statement exist')

    const ifNode = node.consequent
    const elseNode = maybeElseNode

    ctx.report({
      loc: node.loc,
      message: 'Reverse if-else',
      fix(fixer) {
        const lineIndent = ctx.getIndentOfLine(node.loc.start.line)

        const conditionText = ctx.getTextOf(node.test)
        const ifText = ctx.getTextOf(ifNode)
        const elseText = ctx.getTextOf(elseNode)

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
