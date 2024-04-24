import type { TSESTree } from '@typescript-eslint/utils'
import type { Command } from '../types'

const command: Command = {
  name: 'to-function',
  match: /^\/\s*(to-(?:fn|function)|2f|tf)$/,
  action(ctx) {
    const arrowFn = ctx.getNodeBelow('ArrowFunctionExpression')
    if (!arrowFn)
      return ctx.reportError('Unable to find arrow function to convert')

    let start: TSESTree.Node = arrowFn
    let id: TSESTree.Identifier | undefined
    const body = arrowFn.body

    if (arrowFn.parent.type === 'VariableDeclarator' && arrowFn.parent.id.type === 'Identifier') {
      id = arrowFn.parent.id
      if (arrowFn.parent.parent.type === 'VariableDeclaration' && arrowFn.parent.parent.kind === 'const' && arrowFn.parent.parent.declarations.length === 1)
        start = arrowFn.parent.parent
    }

    ctx.removeComment()
    ctx.report({
      node: arrowFn,
      loc: {
        start: start.loc.start,
        end: body.loc.start,
      },
      message: 'Convert to function',
      fix(fixer) {
        const code = ctx.context.sourceCode.text
        const textName = id
          ? code.slice(id.range[0], id.range[1])
          : ''
        const textArgs = arrowFn.params.length
          ? code.slice(arrowFn.params[0].range[0], arrowFn.params[arrowFn.params.length - 1].range[1])
          : ''
        const textBody = body.type === 'BlockStatement'
          ? code.slice(body.range[0], body.range[1])
          : `{\n  return ${code.slice(body.range[0], body.range[1])}\n}`
        const textGeneric = arrowFn.typeParameters
          ? code.slice(arrowFn.typeParameters.range[0], arrowFn.typeParameters.range[1])
          : ''
        const textTypeReturn = arrowFn.returnType
          ? code.slice(arrowFn.returnType.range[0], arrowFn.returnType.range[1])
          : ''
        const textAsync = arrowFn.async ? 'async' : ''

        const final = [textAsync, `function`, textName, `${textGeneric}(${textArgs})${textTypeReturn}`, textBody].filter(Boolean).join(' ')

        return fixer.replaceTextRange([start.range[0], arrowFn.range[1]], final)
      },
    })
  },
}

export default command
