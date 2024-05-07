import type { Command } from '../types'

export const toDestructuringAssignment: Command = {
  name: 'to-destructuring-assignment',
  match: /^[\/:@]\s*(?:to-|2)?(?:destructuring|d)(?:-?assignment|a)?$/i,
  action(ctx) {
    const node = ctx.findNodeBelow(
      'VariableDeclaration',
      'AssignmentExpression',
    )
    if (!node)
      return ctx.reportError('Unable to find object/array to convert')

    const isDeclaration = node.type === 'VariableDeclaration'

    const rightExpression = isDeclaration ? node.declarations[0].init : node.right
    const member = rightExpression?.type === 'ChainExpression' ? rightExpression.expression : rightExpression

    if (member?.type !== 'MemberExpression')
      return ctx.reportError('Unable to convert to destructuring assignment')

    const id = isDeclaration ? ctx.getTextOf(node.declarations[0].id) : ctx.getTextOf(node.left)
    const property = ctx.getTextOf(member.property)

    // TODO maybe there is no good way to know if this is an array or object
    const isArray = !Number.isNaN(Number(property))

    const left = isArray ? `${','.repeat(Number(property))}${id}` : `${id === property ? id : `${property}: ${id}`}`

    let right = `${ctx.getTextOf(member.object)}`
    if (member.optional)
      right += ` ?? ${isArray ? '[]' : '{}'}`

    let str = isArray ? `[${left}] = ${right}` : `{ ${left} } = ${right}`
    str = isDeclaration ? `${node.kind} ${str}` : `;(${str})`

    ctx.removeComment()
    ctx.report({
      node,
      message: 'Convert to destructuring assignment',
      fix: fixer => fixer.replaceTextRange(node.range, str),
    })
  },
}
