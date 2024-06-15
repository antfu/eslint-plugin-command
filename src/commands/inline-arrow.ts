import type { Command, Tree } from '../types'
import { unwrapType } from './_utils'

export const inlineArrow: Command = {
  name: 'inline-arrow',
  match: /^\s*[/:@]\s*(inline-arrow|ia)$/,
  action(ctx) {
    const arrowFn = ctx.findNodeBelow('ArrowFunctionExpression')
    if (!arrowFn)
      return ctx.reportError('Unable to find arrow function to convert')
    const body = arrowFn.body
    if (body.type !== 'BlockStatement')
      return ctx.reportError('Arrow function body must have a block statement')

    const statements = body.body
    if (
      (statements.length !== 1 || statements[0].type !== 'ReturnStatement')
      && (statements.length !== 0)
    ) {
      return ctx.reportError('Arrow function body must have a single statement')
    }
    const statement = statements[0] as Tree.ReturnStatement | undefined
    const argument: Tree.Node | null = statement?.argument ? unwrapType(statement.argument) : null
    const isObject = (argument?.type === 'ObjectExpression')

    ctx.report({
      node: arrowFn,
      loc: body.loc,
      message: 'Inline arrow function',
      fix(fixer) {
        let raw = statement && statement.argument
          ? ctx.getTextOf(statement.argument)
          : 'undefined'
        if (isObject)
          raw = `(${raw})`
        return fixer.replaceTextRange(body.range, raw)
      },
    })
  },
}
