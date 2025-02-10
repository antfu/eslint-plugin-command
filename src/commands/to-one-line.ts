import type { Command, NodeType, Tree } from '../types'

export const toOneLine: Command = {
  name: 'to-one-line',
  match: /^[/@:]\s*(?:to-one-line|21l|tol)$/,
  action(ctx) {
    const node = ctx.findNodeBelow(
      'VariableDeclaration',
      'AssignmentExpression',
      'CallExpression',
      'FunctionDeclaration',
      'FunctionExpression',
      'ReturnStatement',
    )
    if (!node)
      return ctx.reportError('Unable to find node to convert')

    let target: Tree.Node | null = null

    // For a variable declaration we use the initializer.
    if (node.type === 'VariableDeclaration') {
      const decl = node.declarations[0]
      if (decl && decl.init && isAllowedType(decl.init.type))
        target = decl.init
    }
    // For an assignment we use the right side.
    else if (node.type === 'AssignmentExpression') {
      if (node.right && isAllowedType(node.right.type))
        target = node.right
    }
    // In a call we search the arguments.
    else if (node.type === 'CallExpression') {
      target = node.arguments.find(arg => isAllowedType(arg.type)) || null
    }
    // In a function we search the parameters.
    else if (
      node.type === 'FunctionDeclaration'
      || node.type === 'FunctionExpression'
    ) {
      target = node.params.find(param => isAllowedType(param.type)) || null
    }
    // For a return statement we use its argument.
    else if (node.type === 'ReturnStatement') {
      if (node.argument && isAllowedType(node.argument.type))
        target = node.argument
    }

    if (!target)
      return ctx.reportError('Unable to find object/array literal or pattern to convert')

    // Get the text of the node to reformat it.
    const original = ctx.getTextOf(target)
    // Replace line breaks with spaces and remove extra spaces.
    let oneLine = original.replace(/\n/g, ' ').replace(/\s{2,}/g, ' ').trim()
    // Remove a comma that comes before a closing bracket or brace.
    oneLine = oneLine.replace(/,\s*([}\]])/g, '$1')

    if (target.type === 'ArrayExpression' || target.type === 'ArrayPattern') {
      // For arrays, add a missing space before a closing bracket.
      oneLine = oneLine.replace(/\[\s+/g, '[').replace(/\s+\]/g, ']')
    }
    else {
      // For objects, add a missing space before a closing bracket or brace.
      oneLine = oneLine.replace(/([^ \t])([}\]])/g, '$1 $2')
      // Add a space between a ']' and a '}' if they touch.
      oneLine = oneLine.replace(/\](\})/g, '] $1')
    }

    // Fix any nested array formatting.
    oneLine = oneLine.replace(/\[\s+/g, '[').replace(/\s+\]/g, ']')

    ctx.report({
      node: target,
      message: 'Convert object/array to one line',
      fix: fixer => fixer.replaceTextRange(target.range, oneLine),
    })

    function isAllowedType(type: NodeType): boolean {
      return (
        type === 'ObjectExpression'
        || type === 'ArrayExpression'
        || type === 'ObjectPattern'
        || type === 'ArrayPattern'
      )
    }
  },
}
