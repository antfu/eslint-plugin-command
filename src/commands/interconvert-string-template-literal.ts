import type { Command } from '../types'

const PREFIX = /[\/:@]\s*/
const STRING_LITERAL = /to-(?:string-literal|sl)|2sl/
const TEMPLATE_LITERAL = /to-(?:template-literal|tl)|2tl/
const NUMBER = /\s{0,}(.*)?/

function getNodes<T>(nodes: T[], numbers: number[]) {
  return numbers.length
    ? numbers.map(n => nodes[n - 1]).filter(Boolean)
    : nodes
}

export const interconvertStringTemplateLiteral: Command = {
  name: 'interconvert-string-template-literal',
  match: new RegExp(`^${PREFIX.source}(${STRING_LITERAL.source}|${TEMPLATE_LITERAL.source})${NUMBER.source}$`),
  action(ctx) {
    const commandName = ctx.groups[0]
    const numbers = ctx.groups[1]?.split(' ').map(Number) ?? []
    const isStringLiteral = STRING_LITERAL.test(commandName)
    if (isStringLiteral) {
      const nodes = ctx.findNodesBelow('TemplateLiteral')
      if (!nodes)
        return
      for (const node of getNodes(nodes, numbers)) {
        const raw = ctx.source.getText(node).replace(/`/g, '\'')
        ctx.report({
          node,
          message: 'Convert to string literal',
          fix(fixer) {
            return fixer.replaceTextRange(node.range, raw)
          },
        })
      }
      return
    }
    const nodes = ctx.findNodesBelow('Literal')?.filter(node => typeof node.value === 'string')
    if (!nodes)
      return
    for (const node of getNodes(nodes, numbers)) {
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
