import type { Command } from '../types'

export const toArrow: Command = {
  name: 'to-arrow',
  match: /^[\/:@]\s*(to-arrow|2a|ta)$/,
  action(ctx) {
    const fn = ctx.getNodeBelow('FunctionDeclaration', 'FunctionExpression')
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
        const code = ctx.context.sourceCode.text
        let textName = id
          ? code.slice(id.range[0], id.range[1])
          : ''
        const textArgs = fn.params.length
          ? code.slice(fn.params[0].range[0], fn.params[fn.params.length - 1].range[1])
          : ''
        const textBody = body.type === 'BlockStatement'
          ? code.slice(body.range[0], body.range[1])
          : `{\n  return ${code.slice(body.range[0], body.range[1])}\n}`
        const textGeneric = fn.typeParameters
          ? code.slice(fn.typeParameters.range[0], fn.typeParameters.range[1])
          : ''
        const textTypeReturn = fn.returnType
          ? code.slice(fn.returnType.range[0], fn.returnType.range[1])
          : ''
        const textAsync = fn.async ? 'async' : ''

        let final = [textAsync, `${textGeneric}(${textArgs})${textTypeReturn} =>`, textBody].filter(Boolean).join(' ')

        // For function declaration
        if (fn.type === 'FunctionDeclaration' && textName) {
          final = `const ${textName} = ${final}`
        }

        // For object methods
        else if (fn.parent.type === 'Property') {
          rangeStart = fn.parent.range[0]
          textName = code.slice(fn.parent.key.range[0], fn.parent.key.range[1])
          final = `${textName}: ${final}`
        }

        // For class methods
        else if (fn.parent.type === 'MethodDefinition') {
          rangeStart = fn.parent.range[0]
          textName = code.slice(fn.parent.key.range[0], fn.parent.key.range[1])
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
