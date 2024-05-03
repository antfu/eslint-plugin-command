import type { Command, Tree } from '../types'
import type { CommandContext } from '../context'
import { getNodesByIndexes, parseToNumberArray } from './_utils'

type NodeTypes = Tree.StringLiteral | Tree.BinaryExpression

export const toTemplateLiteral: Command = {
  name: 'to-template-literal',
  match: /^[\/:@]\s*(?:to-|2)?(?:template-literal|tl)\s{0,}(.*)?$/,
  action(ctx) {
    const numbers = ctx.matches[1]
    // From integers 1-based to 0-based to match array indexes
    const indexes = parseToNumberArray(numbers, true).map(n => n - 1)
    let nodes: NodeTypes[] | undefined
    nodes = ctx.findNodeBelow({
      types: ['Literal', 'BinaryExpression'],
      shallow: true,
      findAll: true,
    })
      ?.filter(node =>
        node.type === 'Literal'
          ? typeof node.value === 'string'
          : node.type === 'BinaryExpression'
            ? node.operator === '+'
            : false,
      ) as NodeTypes[] | undefined

    if (!nodes || !nodes.length)
      return ctx.reportError('No string literals or binary expressions found')

    // Since we can specify numbers, the order is sensitive
    nodes = getNodesByIndexes(nodes, indexes)

    ctx.removeComment()
    for (const node of nodes) {
      if (node.type === 'BinaryExpression')
        convertBinaryExpression(node, ctx)
      else
        convertStringLiteral(node, ctx)
    }
  },
}

function convertBinaryExpression(node: Tree.BinaryExpression, context: CommandContext) {
  let str = '`'
  str += `${traverseBinaryExpression(node)}\``
  report(context, node, str)
}

function getExpressionValue(node: Tree.Expression | Tree.PrivateIdentifier) {
  if (node.type === 'Identifier')
    return `\${${node.name}}`
  if (node.type === 'Literal' && typeof node.value === 'string')
    return escape(node.value)

  return ''
}

function traverseBinaryExpression(node: Tree.BinaryExpression): string {
  let deepestExpr = node
  let str = ''

  while (deepestExpr.left.type === 'BinaryExpression')
    deepestExpr = deepestExpr.left

  let currentExpr: Tree.BinaryExpression | null = deepestExpr

  while (currentExpr) {
    str += getExpressionValue(currentExpr.left) + getExpressionValue(currentExpr.right)
    if (currentExpr === node)
      break
    currentExpr = currentExpr.parent as Tree.BinaryExpression | null
  }

  return str
}

function convertStringLiteral(node: Tree.StringLiteral, ctx: CommandContext) {
  const raw = `\`${escape(node.value)}\``
  report(ctx, node, raw)
}

function report(ctx: CommandContext, node: Tree.Node, raw: string) {
  ctx.report({
    node,
    message: 'Convert to template literal',
    fix(fixer) {
      return fixer.replaceTextRange(node.range, raw)
    },
  })
}

function escape(raw: string) {
  // TODO handle multi escape characters '\\${str}'
  return raw.replace(/`/g, '\\`').replace(/\$\{/g, '\\${')
}
