import type { Command } from '../types'

export const toArrow: Command = {
  name: 'to-arrow',
  match: /^[\/:@]\s*(to-arrow|2a|ta)$/,
  action(ctx) {
    const fn = ctx.findNodeBelow('FunctionDeclaration', 'FunctionExpression')
    if (!fn)
      return ctx.reportError('Unable to find function declaration to convert')

    const id = fn.id
    const body = fn.body

    let rangeStart = fn.range[0]
    const rangeEnd = fn.range[1]

    ctx.removeComment()
    ctx.report({
      node: fn,
      loc: {
        start: fn.loc.start,
        end: body.loc.start,
      },
      message: 'Convert to arrow function',
      fix(fixer) {
        let textName = ctx.getTextOf(id)
        const textArgs = fn.params.length
          ? ctx.getTextOf([fn.params[0].range[0], fn.params[fn.params.length - 1].range[1]])
          : ''
        const textBody = body.type === 'BlockStatement'
          ? ctx.getTextOf(body)
          : `{\n  return ${ctx.getTextOf(body)}\n}`
        const textGeneric = ctx.getTextOf(fn.typeParameters)
        const textTypeReturn = ctx.getTextOf(fn.returnType)
        const textAsync = fn.async ? 'async' : ''

        let final = [textAsync, `${textGeneric}(${textArgs})${textTypeReturn} =>`, textBody].filter(Boolean).join(' ')

        // For function declaration
        if (fn.type === 'FunctionDeclaration' && textName) {
          final = `const ${textName} = ${final}`
        }

        // For object methods
        else if (fn.parent.type === 'Property') {
          rangeStart = fn.parent.range[0]
          textName = ctx.getTextOf(fn.parent.key)
          final = `${textName}: ${final}`
        }

        // For class methods
        else if (fn.parent.type === 'MethodDefinition') {
          rangeStart = fn.parent.range[0]
          textName = ctx.getTextOf(fn.parent.key)
          final = `${textName} = ${final}`
        }

        // console.log({
        //   final,
        //   original: code.slice(rangeStart, rangeEnd),
        //   p: fn.parent.type,
        // })
        return fixer.replaceTextRange([rangeStart, rangeEnd], final)
      },
    })
  },
}
