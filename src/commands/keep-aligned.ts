import type { Command } from '../types'

const reLine = /^[/@:]\s*keep-aligned(?<repeat>\*?)(?<symbols>(\s+\S+)+)$/

export const keepAligned: Command = {
  name: 'keep-aligned',
  commentType: 'line',
  match: comment => comment.value.trim().match(reLine),
  action(ctx) {
    // this command applies to any node below
    const node = ctx.findNodeBelow(() => true)
    if (!node)
      return

    const alignmentSymbols = ctx.matches.groups?.symbols?.trim().split(/\s+/)
    if (!alignmentSymbols)
      return ctx.reportError('No alignment symbols provided')
    const repeat = ctx.matches.groups?.repeat

    const nLeadingSpaces = node.range[0] - ctx.comment.range[1] - 1
    const text = ctx.context.sourceCode.getText(node, nLeadingSpaces)
    const lines = text.split('\n')
    const symbolIndices: number[] = []

    const nSymbols = alignmentSymbols.length
    if (nSymbols === 0)
      return ctx.reportError('No alignment symbols provided')

    const n = repeat ? Number.MAX_SAFE_INTEGER : nSymbols
    let lastPos = 0
    for (let i = 0; i < n && i < 20; i++) {
      const symbol = alignmentSymbols[i % nSymbols]
      const maxIndex = lines.reduce((maxIndex, line) =>
        Math.max(line.indexOf(symbol, lastPos), maxIndex), -1)
      symbolIndices.push(maxIndex)

      if (maxIndex < 0) {
        if (!repeat)
          return ctx.reportError(`Alignment symbol "${symbol}" not found`)
        else
          break
      }

      for (let j = 0; j < lines.length; j++) {
        const line = lines[j]
        const index = line.indexOf(symbol, lastPos)
        if (index < 0)
          continue
        if (index !== maxIndex) {
          const padding = maxIndex - index
          lines[j] = line.slice(0, index) + ' '.repeat(padding) + line.slice(index)
        }
      }
      lastPos = maxIndex + symbol.length
    }

    const modifiedText = lines.join('\n')
    if (text === modifiedText)
      return

    ctx.report({
      node,
      message: 'Keep aligned',
      removeComment: false,
      fix: fixer => fixer.replaceText(node, modifiedText.slice(nLeadingSpaces)),
    })
  },
}
