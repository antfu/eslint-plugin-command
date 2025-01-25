import type { Command, NodeType, Tree } from '../types'

export const FOR_TRAVERSE_IGNORE: NodeType[] = [
  'FunctionDeclaration',
  'FunctionExpression',
  'ArrowFunctionExpression',
  'WhileStatement',
  'DoWhileStatement',
  'ForInStatement',
  'ForOfStatement',
  'ForStatement',
  'ArrowFunctionExpression',
]

export const toForEach: Command = {
  name: 'to-for-each',
  match: /^\s*[/:@]\s*(?:to-|2)?for-?each$/i,
  action(ctx) {
    const node = ctx.findNodeBelow('ForInStatement', 'ForOfStatement')
    if (!node)
      return ctx.reportError('Unable to find for statement to convert')

    const continueNodes: Tree.ContinueStatement[] = []
    const result = ctx.traverse(node.body, (path, { STOP, SKIP }) => {
      if (FOR_TRAVERSE_IGNORE.includes(path.node.type))
        return SKIP

      if (path.node.type === 'ContinueStatement') {
        continueNodes.push(path.node)
      }
      else if (path.node.type === 'BreakStatement') {
        ctx.reportError(
          'Unable to convert for statement with break statement',
          {
            node: path.node,
            message: 'Break statement has no equivalent in forEach',
          },
        )
        return STOP
      }
      else if (path.node.type === 'ReturnStatement') {
        ctx.reportError(
          'Unable to convert for statement with return statement',
          {
            node: path.node,
            message: 'Return statement has no equivalent in forEach',
          },
        )
        return STOP
      }
    })
    if (!result)
      return

    // Convert `continue` to `return`
    let textBody = ctx.getTextOf(node.body)
    continueNodes
      .sort((a, b) => b.loc.start.line - a.loc.start.line)
      .forEach((c) => {
        textBody
          // eslint-disable-next-line prefer-template
          = textBody.slice(0, c.range[0] - node.body.range[0])
            + 'return'
            + textBody.slice(c.range[1] - node.body.range[0])
      })
    // Add braces if missing
    if (!textBody.trim().startsWith('{'))
      textBody = `{\n${textBody}\n}`

    const localId = node.left.type === 'VariableDeclaration'
      ? node.left.declarations[0].id
      : node.left
    const textLocal = ctx.getTextOf(localId)
    let textIterator = ctx.getTextOf(node.right)

    if (!['Identifier', 'MemberExpression', 'CallExpression'].includes(node.right.type))
      textIterator = `(${textIterator})`

    let str = node.type === 'ForOfStatement'
      ? `${textIterator}.forEach((${textLocal}) => ${textBody})`
      : `Object.keys(${textIterator}).forEach((${textLocal}) => ${textBody})`

    // If it starts with `(`, add a semicolon to prevent AST confusion
    if (str[0] === '(')
      str = `;${str}`

    ctx.report({
      node,
      message: 'Convert to forEach',
      fix(fixer) {
        return fixer.replaceText(node, str)
      },
    })
  },
}
