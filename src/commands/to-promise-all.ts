import type { Command, Tree } from '../types'

type TargetNode = Tree.VariableDeclaration | Tree.ExpressionStatement
type TargetDeclarator = Tree.VariableDeclarator | Tree.AwaitExpression

export const toPromiseAll: Command = {
  name: 'to-promise-all',
  match: /^[\/@:]\s*(?:to-|2)(?:promise-all|pa)$/,
  action(ctx) {
    const parent = ctx.getParentBlock()
    const nodeStart = ctx.findNodeBelow(isTarget) as TargetNode
    let nodeEnd: Tree.Node = nodeStart
    if (!nodeStart)
      return ctx.reportError('Unable to find variable declaration')
    if (!parent.body.includes(nodeStart))
      return ctx.reportError('Variable declaration is not in the same block')

    function isTarget(node: Tree.Node): node is TargetNode {
      if (node.type === 'VariableDeclaration')
        return node.declarations.some(declarator => declarator.init?.type === 'AwaitExpression')
      else if (node.type === 'ExpressionStatement')
        return node.expression.type === 'AwaitExpression'
      return false
    }

    function getDeclarators(node: TargetNode): TargetDeclarator[] {
      if (node.type === 'VariableDeclaration')
        return node.declarations
      if (node.expression.type === 'AwaitExpression')
        return [node.expression]
      return []
    }

    let declarationType = 'const'
    const declarators: TargetDeclarator[] = []
    for (let i = parent.body.indexOf(nodeStart); i < parent.body.length; i++) {
      const node = parent.body[i]
      if (isTarget(node)) {
        declarators.push(...getDeclarators(node))
        nodeEnd = node
        if (node.type === 'VariableDeclaration' && node.kind !== 'const')
          declarationType = 'let'
      }
      else {
        break
      }
    }

    ctx.removeComment()
    ctx.report({
      loc: {
        start: nodeStart.loc.start,
        end: nodeEnd.loc.end,
      },
      message: 'Convert to `await Promise.all`',
      fix(fixer) {
        const lineIndent = ctx.getIndentOfLine(nodeStart.loc.start.line)
        const isTs = ctx.context.filename.match(/\.[mc]?tsx?$/)

        function unwrapAwait(node: Tree.Node | null) {
          if (node?.type === 'AwaitExpression')
            return node.argument
          return node
        }

        function getId(declarator: TargetDeclarator) {
          if (declarator.type === 'AwaitExpression')
            return '/* discarded */'
          return ctx.getTextOf(declarator.id)
        }

        function getInit(declarator: TargetDeclarator) {
          if (declarator.type === 'AwaitExpression')
            return ctx.getTextOf(declarator.argument)
          return ctx.getTextOf(unwrapAwait(declarator.init))
        }

        const str = [
          `${declarationType} [`,
          ...declarators
            .map(declarator => `${getId(declarator)},`),
          '] = await Promise.all([',
          ...declarators
            .map(declarator => `${getInit(declarator)},`),
          isTs ? '] as const)' : '])',
        ]
          .map((line, idx) => idx ? lineIndent + line : line)
          .join('\n')

        return fixer.replaceTextRange([
          nodeStart.range[0],
          nodeEnd.range[1],
        ], str)
      },
    })
  },
}
