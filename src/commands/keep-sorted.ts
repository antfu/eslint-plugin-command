import type { TSESTree } from '@typescript-eslint/typescript-estree'
import type { Command } from '../types'

const command: Command = {
  name: 'keep-sorted',
  match: /^[\/@:]\s*(keep-sorted|sorted)$/,
  action(ctx) {
    const node = ctx.getNodeBelow('ObjectExpression', 'ArrayExpression')
    if (!node)
      return ctx.reportError('Unable to find object/array to sort')

    const firstToken = ctx.context.sourceCode.getFirstToken(node)!
    const lastToken = ctx.context.sourceCode.getLastToken(node)!
    if (!firstToken || !lastToken)
      return ctx.reportError('Unable to find object/array to sort')

    function sort<T extends TSESTree.Node>(list: T[], getName: (node: T) => string | null): void {
      if (list.length < 2)
        return

      const reordered = list.slice()
      const ranges = new Map<typeof list[number], [number, number]>()
      const names = new Map<typeof list[number], string | null>()

      const rangeStart = Math.max(
        firstToken.range[1],
        ctx.context.sourceCode.getIndexFromLoc({
          line: list[0].loc.start.line,
          column: 0,
        }),
      )
      let rangeEnd = rangeStart
      for (let i = 0; i < list.length; i++) {
        const item = list[i]
        const name = getName(item)
        names.set(item, name)

        let lastRange = item.range[1]
        const endStartToken = ctx.context.sourceCode.getTokenByRangeStart(lastRange)
        if (endStartToken?.type === 'Punctuator' && endStartToken.value === ',')
          lastRange = endStartToken.range[1]
        if (ctx.context.sourceCode.getText()[lastRange] === '\n')
          lastRange++
        ranges.set(item, [rangeEnd, lastRange])
        rangeEnd = lastRange
      }

      const segments: [number, number][] = []
      let segmentStart: number = -1
      for (let i = 0; i < list.length; i++) {
        if (names.get(list[i]) == null) {
          if (segmentStart > -1)
            segments.push([segmentStart, i])
          segmentStart = -1
        }
        else {
          if (segmentStart === -1)
            segmentStart = i
        }
      }
      if (segmentStart > -1 && segmentStart !== list.length - 1)
        segments.push([segmentStart, list.length])

      for (const [start, end] of segments) {
        reordered.splice(
          start,
          end - start,
          ...reordered
            .slice(start, end)
            .sort((a, b) => {
              const nameA = names.get(a)!
              const nameB = names.get(b)!
              return nameA < nameB ? -1 : nameA > nameB ? 1 : 0
            }),
        )
      }

      const changed = reordered.some((prop, i) => prop !== list[i])
      if (!changed)
        return

      const newContent = reordered.map((i) => {
        const range = ranges.get(i)!
        return ctx.context.sourceCode.text.slice(range[0], range[1])
      }).join('')

      // console.log({
      //   newContent,
      //   oldContent: ctx.context.sourceCode.text.slice(rangeStart, rangeEnd),
      // })

      ctx.report({
        node,
        loc: {
          start: node.loc.start,
          end: node.loc.end,
        },
        message: 'Keep sorted',
        fix(fixer) {
          return fixer.replaceTextRange([rangeStart, rangeEnd], newContent)
        },
      })
    }

    if (node.type === 'ObjectExpression') {
      sort(
        node.properties,
        (prop) => {
          if (prop.type === 'Property' && prop.key.type === 'Identifier')
            return prop.key.name
          return null
        },
      )
    }
    else if (node.type === 'ArrayExpression') {
      sort(
        node.elements.filter(Boolean) as (TSESTree.Expression | TSESTree.SpreadElement)[],
        (element) => {
          if (element.type === 'Identifier')
            return element.name
          if (element.type === 'Literal')
            return String(element.value)
          return null
        },
      )
    }
  },
}

export default command
