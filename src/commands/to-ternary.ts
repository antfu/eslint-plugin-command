import type { Command, Tree } from '../types'

export const toTernary: Command = {
  name: 'to-ternary',
  alias: ['to-3', '2ternary', '23'],
  match: /^\s*[/:@]\s*(?:to-|2)(?:ternary|3)$/,
  action(ctx) {
    const node = ctx.findNodeBelow('IfStatement')

    if (!node)
      return ctx.reportError('Unable to find an `if` statement to convert')

    let result = ''
    let isAssignment = true

    const normalizeStatement = (n: Tree.Statement | null) => {
      if (!n)
        return ctx.reportError('Unable to convert `if` statement without an `else` clause')
      if (n.type === 'BlockStatement') {
        if (n.body.length !== 1)
          return ctx.reportError('Unable to convert statement contains more than one expression')
        else return n.body[0]
      }
      else {
        return n
      }
    }

    const getAssignmentId = (n: Tree.Statement) => {
      if (n.type === 'IfStatement')
        n = n.consequent
      if (n.type !== 'ExpressionStatement' || n.expression.type !== 'AssignmentExpression' || n.expression.left.type !== 'Identifier')
        return
      return ctx.getTextOf(n.expression.left)
    }

    let ifNode: Tree.IfStatement = node
    while (ifNode) {
      const consequent = normalizeStatement(ifNode.consequent)
      const alternate = normalizeStatement(ifNode.alternate)

      if (!consequent || !alternate)
        return

      if (isAssignment) {
        const ifId = getAssignmentId(consequent)
        const elseId = getAssignmentId(alternate)

        if (!ifId || ifId !== elseId)
          isAssignment = false
      }

      result += `${ctx.getTextOf(ifNode.test)} ? ${ctx.getTextOf(consequent)} : `

      if (alternate.type !== 'IfStatement') {
        result += ctx.getTextOf(alternate)
        break
      }
      else {
        ifNode = alternate
      }
    }

    if (isAssignment) {
      const id = getAssignmentId(normalizeStatement(node.consequent)!)
      result = `${id} = ${result.replaceAll(`${id} = `, '')}`
    }

    ctx.report({
      node,
      message: 'Convert to ternary',
      fix: fix => fix.replaceTextRange(node.range, result),
    })
  },
}
