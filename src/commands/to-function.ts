import type { TSESTree } from '@typescript-eslint/utils'
import type { Command } from '../types'

const command: Command = {
  name: 'to-function',
  match: /^:to-(fn|function)$/,
  action({ context, comment, reportError, report }) {
    const token = context.sourceCode.getTokenAfter(comment)
    if (!token)
      return reportError('No token found')
    const root = context.sourceCode.getNodeByRangeIndex(token!.range[0])
    if (!root)
      return reportError('No node found')

    const result = (() => {
      let node: TSESTree.Node = root
      if (node.type === 'ExportNamedDeclaration')
        node = node.declaration!

      if (node.type !== 'VariableDeclaration')
        return false

      const declaration = node.declarations[0]

      if (declaration.init?.type !== 'ArrowFunctionExpression')
        return
      if (declaration.id?.type !== 'Identifier')
        return
      if (declaration.id.typeAnnotation)
        return
      if (
        declaration.init.body.type !== 'BlockStatement'
        && declaration.id?.loc.start.line === declaration.init?.body.loc.end.line
      )
        return

      const arrowFn = declaration.init
      const body = declaration.init.body
      const id = declaration.id

      report({
        node,
        loc: {
          start: id.loc.start,
          end: body.loc.start,
        },
        message: 'Convert to function',
        fix(fixer) {
          const code = context.sourceCode.text
          const textName = code.slice(id.range[0], id.range[1])
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
          const textAsync = arrowFn.async ? 'async ' : ''

          const final = `${textAsync}function ${textName} ${textGeneric}(${textArgs})${textTypeReturn} ${textBody}`

          return fixer.replaceTextRange([node.range[0], node.range[1]], final)
        },
      })
      return true
    })()

    if (!result)
      return reportError('Unable to convert to function')
  },
}

export default command
