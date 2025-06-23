import type { Command, Tree } from '../types'
import { defineAlias } from '../utils'
import { getNodesByIndexes, parseToNumberArray } from './_utils'

type NodeTypes = Tree.StringLiteral | Tree.BinaryExpression

export const toTemplateLiteral: Command = {
  name: 'to-template-literal',
  get alias() {
    return defineAlias(this, ['to-tl', '2template-literal', '2tl'])
  },
  match: /^\s*[/:@]\s*(?:to-|2)?(?:template-literal|tl)\s*(\S.*)?$/,
  action(ctx) {
    const numbers = ctx.matches[1]
    // From integers 1-based to 0-based to match array indexes
    const indexes = parseToNumberArray(numbers, true).map(n => n - 1)
    let nodes: NodeTypes[] | undefined
    nodes = ctx
      .findNodeBelow({
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

    ctx.report({
      nodes,
      message: 'Convert to template literal',
      * fix(fixer) {
        for (const node of nodes.reverse()) {
          if (node.type === 'BinaryExpression')
            yield fixer.replaceText(node, `\`${traverseBinaryExpression(node)}\``)
          else
            yield fixer.replaceText(node, `\`${escape(node.value)}\``)
        }
      },
    })
  },
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

function escape(raw: string) {
  // TODO handle multi escape characters '\\${str}'
  return raw.replace(/`/g, '\\`').replace(/\$\{/g, '\\${')
}
