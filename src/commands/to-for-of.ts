import type { Command, Tree } from '../types'
import { FOR_TRAVERSE_IGNORE } from './to-for-each'

export const toForOf: Command = {
  name: 'to-for-of',
  match: /^[\/:@]\s*(?:to-|2)?(?:for-?of)$/i,
  action(ctx) {
    const target = ctx.findNodeBelow((node) => {
      if (node.type === 'CallExpression' && node.callee.type === 'MemberExpression' && node.callee.property.type === 'Identifier' && node.callee.property.name === 'forEach')
        return true
      return false
    }) as Tree.CallExpression | undefined

    if (!target)
      return ctx.reportError('Unable to find .forEach() to convert')

    const member = target.callee as Tree.MemberExpression
    const iterator = member.object
    const fn = target.arguments[0]
    if (fn.type !== 'ArrowFunctionExpression' && fn.type !== 'FunctionExpression')
      return ctx.reportError('Unable to find function to convert')

    // TODO: support this in some way
    if (fn.params.length !== 1) {
      return ctx.reportError(
        'Unable to convert forEach',
        {
          node: fn.params[0],
          message: 'Index argument in forEach is not yet supported for conversion',
        },
      )
    }

    // Find all return statements
    const returnNodes: Tree.ReturnStatement[] = []
    ctx.traverse(fn.body, (path, { SKIP }) => {
      if (FOR_TRAVERSE_IGNORE.includes(path.node.type))
        return SKIP
      if (path.node.type === 'ReturnStatement')
        returnNodes.push(path.node)
    })
    // Convert `continue` to `return`
    let textBody = ctx.getTextOf(fn.body)
    returnNodes
      .sort((a, b) => b.loc.start.line - a.loc.start.line)
      .forEach((c) => {
        textBody
          // eslint-disable-next-line prefer-template
          = textBody.slice(0, c.range[0] - fn.body.range[0])
          + 'continue'
          + textBody.slice(c.range[1] - fn.body.range[0])
      })

    const local = fn.params[0]
    const str = `for (const ${ctx.getTextOf(local)} of ${ctx.getTextOf(iterator)}) ${textBody}`

    ctx.removeComment()
    ctx.report({
      node: target,
      message: 'Convert to for-of loop',
      fix(fixer) {
        return fixer.replaceText(target, str)
      },
    })
  },
}
