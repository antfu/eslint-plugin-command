import type { Command } from '../types'

export interface KeepSortedInlineOptions {
  key?: string
  keys?: string[]
}

const reLine = /^[/@:]\s*(?:keep-)?uni(?:que)?$/
const reBlock = /(?:\b|\s)@keep-uni(?:que)?(?:\b|\s|$)/

export const keepUnique: Command = {
  name: 'keep-unique',
  alias: ['uniq'],
  commentType: 'both',
  match: comment => comment.value.trim().match(comment.type === 'Line' ? reLine : reBlock),
  action(ctx) {
    const node = ctx.findNodeBelow('ArrayExpression')
    if (!node)
      return ctx.reportError('Unable to find array to keep unique')

    const set = new Set<string>()
    const removalIndex = new Set<number>()

    node.elements.forEach((item, idx) => {
      if (!item)
        return
      if (item.type !== 'Literal')
        return
      if (set.has(String(item.raw)))
        removalIndex.add(idx)
      else
        set.add(String(item.raw))
    })

    if (removalIndex.size === 0)
      return false

    ctx.report({
      node,
      message: 'Keep unique',
      removeComment: false,
      fix(fixer) {
        const removalRanges = Array.from(removalIndex)
          .map((idx) => {
            const item = node.elements[idx]!
            const nextItem = node.elements[idx + 1]
            if (nextItem)
              return [item.range[0], nextItem.range[0]]
            const nextToken = ctx.source.getTokenAfter(item)
            if (nextToken && nextToken.value === ',')
              return [item.range[0], nextToken.range[1]]
            return item.range
          })
          .sort((a, b) => b[0] - a[0])
        let text = ctx.getTextOf(node)
        for (const [start, end] of removalRanges)
          text = text.slice(0, start - node.range[0]) + text.slice(end - node.range[0])
        return fixer.replaceText(node, text)
      },
    })
  },
}
