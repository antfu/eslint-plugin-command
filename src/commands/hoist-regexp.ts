import type { Command, Tree } from '../types'

export const hoistRegExp: Command = {
  name: 'hoist-regexp',
  match: /^\s*[/:@]\s*(?:hoist-|h)reg(?:exp?)?(?:\s+(\S+)\s*)?$/,
  action(ctx) {
    const regexNode = ctx.findNodeBelow((node): node is Tree.RegExpLiteral => node.type === 'Literal' && 'regex' in node) as Tree.RegExpLiteral
    if (!regexNode)
      return ctx.reportError('No regular expression literal found')

    const topNodes = ctx.source.ast.body as Tree.Node[]
    const scope = ctx.source.getScope(regexNode)

    let parent = regexNode.parent as Tree.Node | undefined
    while (parent && !topNodes.includes(parent))
      parent = parent.parent
    if (!parent)
      return ctx.reportError('Failed to find top-level node')

    let name = ctx.matches[1]
    if (name) {
      if (scope.references.find(ref => ref.identifier.name === name))
        return ctx.reportError(`Variable '${name}' is already in scope`)
    }
    else {
      let baseName = regexNode.regex.pattern
        .replace(/\W/g, '_')
        .replace(/_{2,}/g, '_')
        .replace(/^_+|_+$/, '')
        .toLowerCase()

      if (baseName.length > 0)
        baseName = baseName[0].toUpperCase() + baseName.slice(1)

      let i = 0
      name = `re${baseName}`
      while (scope.references.find(ref => ref.identifier.name === name)) {
        i++
        name = `${baseName}${i}`
      }
    }

    ctx.report({
      node: regexNode,
      message: `Hoist regular expression to ${name}`,
      *fix(fixer) {
        yield fixer.insertTextBefore(parent, `const ${name} = ${ctx.source.getText(regexNode)}\n`)
        yield fixer.replaceText(regexNode, name)
      },
    })
  },
}
