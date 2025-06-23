import type { Command, Tree } from '../types'
import { defineAlias } from '../utils'

export const toDynamicImport: Command = {
  name: 'to-dynamic-import',
  get alias() {
    return defineAlias(this, ['dynamic-import'])
  },
  match: /^\s*[/:@]\s*(?:to-|2)?(?:dynamic|d)(?:-?import)?$/i,
  action(ctx) {
    const node = ctx.findNodeBelow('ImportDeclaration')
    if (!node)
      return ctx.reportError('Unable to find import statement to convert')

    let namespace: string | undefined

    if (node.importKind === 'type')
      return ctx.reportError('Unable to convert type import to dynamic import')

    const typeSpecifiers: Tree.ImportSpecifier[] = []

    const destructure = node.specifiers
      .map((specifier) => {
        if (specifier.type === 'ImportSpecifier') {
          if (specifier.importKind === 'type') {
            typeSpecifiers.push(specifier)
            return null
          }
          if (specifier.imported.type === 'Identifier' && specifier.local.name === specifier.imported.name)
            return ctx.getTextOf(specifier.imported)
          else
            return `${ctx.getTextOf(specifier.imported)}: ${ctx.getTextOf(specifier.local)}`
        }
        else if (specifier.type === 'ImportDefaultSpecifier') {
          return `default: ${ctx.getTextOf(specifier.local)}`
        }
        else if (specifier.type === 'ImportNamespaceSpecifier') {
          namespace = ctx.getTextOf(specifier.local)
          return null
        }
        return null
      })
      .filter(Boolean)
      .join(', ')

    let str = namespace
      ? `const ${namespace} = await import(${ctx.getTextOf(node.source)})`
      : `const { ${destructure} } = await import(${ctx.getTextOf(node.source)})`

    if (typeSpecifiers.length)
      str = `import { ${typeSpecifiers.map(s => ctx.getTextOf(s)).join(', ')} } from ${ctx.getTextOf(node.source)}\n${str}`

    ctx.report({
      node,
      message: 'Convert to dynamic import',
      fix: fixer => fixer.replaceText(node, str),
    })
  },
}
