import type { Command, Tree } from '../types'
import { getNodesByIndexes, parseToNumberArray } from './_utils'

export const toStringLiteral: Command = {
  name: 'to-string-literal',
  alias: ['to-sl', '2string-literal', '2sl'],
  match: /^\s*[/:@]\s*(?:to-|2)?(?:string-literal|sl)\s*(\S.*)?$/,
  action(ctx) {
    const numbers = ctx.matches[1]
    // From integers 1-based to 0-based to match array indexes
    const indexes = parseToNumberArray(numbers, true).map(n => n - 1)
    const nodes = ctx.findNodeBelow({
      types: ['TemplateLiteral'],
      shallow: true,
      findAll: true,
    })
    if (!nodes?.length)
      return ctx.reportError('No template literals found')

    ctx.report({
      nodes,
      message: 'Convert to string literal',
      * fix(fixer) {
        for (const node of getNodesByIndexes(nodes, indexes)) {
          const ids = extractIdentifiers(node)
          let raw = JSON.stringify(ctx.source.getText(node).slice(1, -1)).slice(1, -1)

          if (ids.length)
            raw = toStringWithIds(raw, node, ids)
          else
            raw = `"${raw}"`

          yield fixer.replaceTextRange(node.range, raw)
        }
      },
    })
  },
}

interface Identifier {
  name: string
  range: [number, number]
}

function extractIdentifiers(node: Tree.TemplateLiteral) {
  const ids: Identifier[] = []
  for (const child of node.expressions) {
    if (child.type === 'Identifier')
      ids.push({ name: child.name, range: child.range })
    // TODO: sub expressions, e.g. `${a + b}` -> '' + a + b + ''
  }
  return ids
}

function toStringWithIds(raw: string, node: Tree.TemplateLiteral, ids: Identifier[]) {
  let hasStart = false
  let hasEnd = false
  ids.forEach(({ name, range }, index) => {
    let startStr = `" + `
    let endStr = ` + "`

    if (index === 0) {
      hasStart = range[0] - /* `${ */3 === node.range[0]
      if (hasStart)
        startStr = ''
    }
    if (index === ids.length - 1) {
      hasEnd = range[1] + /* }` */2 === node.range[1]
      if (hasEnd)
        endStr = ''
    }

    raw = raw.replace(`\${${name}}`, `${startStr}${name}${endStr}`)
  })
  return `${hasStart ? '' : `"`}${raw}${hasEnd ? '' : `"`}`
}
