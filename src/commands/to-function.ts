import type { Command, Tree } from '../types'

export const toFunction: Command = {
  name: 'to-function',
  match: /^\s*[\/:@]\s*(to-(?:fn|function)|2f|tf)$/,
  action(ctx) {
    const arrowFn = ctx.findNodeBelow('ArrowFunctionExpression')
    if (!arrowFn)
      return ctx.reportError('Unable to find arrow function to convert')

    let start: Tree.Node = arrowFn
    let id: Tree.Identifier | undefined
    const body = arrowFn.body

    if (arrowFn.parent.type === 'VariableDeclarator' && arrowFn.parent.id.type === 'Identifier') {
      id = arrowFn.parent.id
      if (arrowFn.parent.parent.type === 'VariableDeclaration' && arrowFn.parent.parent.kind === 'const' && arrowFn.parent.parent.declarations.length === 1)
        start = arrowFn.parent.parent
    }
    else if (arrowFn.parent.type === 'Property' && arrowFn.parent.key.type === 'Identifier') {
      id = arrowFn.parent.key
      start = arrowFn.parent.key
    }

    ctx.report({
      node: arrowFn,
      loc: {
        start: start.loc.start,
        end: body.loc.start,
      },
      message: 'Convert to function',
      fix(fixer) {
        const textName = ctx.getTextOf(id)
        const textArgs = arrowFn.params.length
          ? ctx.getTextOf([arrowFn.params[0].range[0], arrowFn.params[arrowFn.params.length - 1].range[1]])
          : ''
        const textBody = body.type === 'BlockStatement'
          ? ctx.getTextOf(body)
          : `{\n  return ${ctx.getTextOf(body)}\n}`
        const textGeneric = ctx.getTextOf(arrowFn.typeParameters)
        const textTypeReturn = ctx.getTextOf(arrowFn.returnType)
        const textAsync = arrowFn.async ? 'async' : ''

        const fnBody = [`${textGeneric}(${textArgs})${textTypeReturn}`, textBody].filter(Boolean).join(' ')

        let final = [textAsync, `function`, textName, fnBody].filter(Boolean).join(' ')

        if (arrowFn.parent.type === 'Property')
          final = [textAsync, textName, fnBody].filter(Boolean).join(' ')

        // console.log({
        //   final,
        //   original: code.slice(start.range[0], arrowFn.range[1]),
        //   p: arrowFn.parent.type,
        // })
        return fixer.replaceTextRange([start.range[0], arrowFn.range[1]], final)
      },
    })
  },
}
