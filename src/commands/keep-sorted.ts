import type { Command, CommandContext, Tree } from '../types'

export interface KeepSortedInlineOptions {
  key?: string
  keys?: string[]
}

export const keepSorted: Command = {
  name: 'keep-sorted',
  match: /^[\/@:]\s*(?:keep-sorted|sorted)\s*({.*})?$/,
  action(ctx) {
    const optionsRaw = ctx.matches[1] || '{}'
    let options: KeepSortedInlineOptions | null = null
    try {
      options = JSON.parse(optionsRaw)
    }
    catch (e) {
      return ctx.reportError(`Failed to parse options: ${optionsRaw}`)
    }

    const node = ctx.findNodeBelow(
      'ObjectExpression',
      'ObjectPattern',
      'ArrayExpression',
      'TSInterfaceBody',
      'TSTypeLiteral',
    ) || ctx.findNodeBelow(
      'ExportNamedDeclaration',
    )
    if (!node)
      return ctx.reportError('Unable to find object/array/interface to sort')

    const objectKeys = [
      options?.key,
      ...(options?.keys || []),
    ].filter(x => x != null) as string[]

    if (objectKeys.length > 0 && node.type !== 'ArrayExpression')
      return ctx.reportError(`Only arrays can be sorted by keys, but got ${node.type}`)

    if (node.type === 'ObjectExpression') {
      sort(
        ctx,
        node,
        node.properties,
        (prop) => {
          if (prop.type === 'Property')
            return getString(prop.key)
          return null
        },
      )
    }
    else if (node.type === 'ObjectPattern') {
      sort(
        ctx,
        node,
        node.properties,
        (prop) => {
          if (prop.type === 'Property')
            return getString(prop.key)
          return null
        },
      )
    }
    else if (node.type === 'ArrayExpression') {
      sort(
        ctx,
        node,
        node.elements.filter(Boolean) as (Tree.Expression | Tree.SpreadElement)[],
        (element) => {
          if (objectKeys.length) {
            if (element.type === 'ObjectExpression') {
              return objectKeys
                .map((key) => {
                  for (const prop of element.properties) {
                    if (prop.type === 'Property' && getString(prop.key) === key)
                      return getString(prop.value)
                  }
                  return null
                })
            }
            else {
              return null
            }
          }
          return getString(element)
        },
      )
    }
    else if (node.type === 'TSInterfaceBody') {
      sort(
        ctx,
        node,
        node.body,
        (prop) => {
          if (prop.type === 'TSPropertySignature')
            return getString(prop.key)
          return null
        },
      )
    }
    else if (node.type === 'TSTypeLiteral') {
      sort(
        ctx,
        node,
        node.members,
        (prop) => {
          if (prop.type === 'TSPropertySignature')
            return getString(prop.key)
          return null
        },
      )
    }
    else if (node.type === 'ExportNamedDeclaration') {
      sort(
        ctx,
        node,
        node.specifiers,
        (prop) => {
          if (prop.type === 'ExportSpecifier')
            return getString(prop.exported)
          return null
        },
      )
    }
  },
}

function sort<T extends Tree.Node>(
  ctx: CommandContext,
  node: Tree.Node,
  list: T[],
  getName: (node: T) => string | (string | null)[] | null,
): void {
  const firstToken = ctx.context.sourceCode.getFirstToken(node)!
  const lastToken = ctx.context.sourceCode.getLastToken(node)!
  if (!firstToken || !lastToken)
    return ctx.reportError('Unable to find object/array/interface to sort')

  if (list.length < 2)
    return

  const reordered = list.slice()
  const ranges = new Map<typeof list[number], [number, number]>()
  const names = new Map<typeof list[number], (string | null)[] | null>()

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
    let name = getName(item)
    if (typeof name === 'string')
      name = [name]
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
          const nameA: (string | null)[] = names.get(a)!
          const nameB: (string | null)[] = names.get(b)!

          const length = Math.max(nameA.length, nameB.length)
          for (let i = 0; i < length; i++) {
            const a = nameA[i]
            const b = nameB[i]
            if (a == null || b == null || a === b)
              continue
            return a.localeCompare(b)
          }
          return 0
        }),
    )
  }

  const changed = reordered.some((prop, i) => prop !== list[i])
  if (!changed)
    return

  const newContent = reordered.map((i, index) => {
    const range = ranges.get(i)!
    const content = ctx.context.sourceCode.text.slice(range[0], range[1])
    const oldRange = list.at(index)!.range
    const lastToken = ctx.context.sourceCode.getTokenByRangeStart(oldRange[1])
    const needInsertComma = lastToken?.type === 'Punctuator' && lastToken.value === ','
    return needInsertComma
      ? insertComma(content)
      : removeComma(content)
  }).join('')

  // console.log({
  //   newContent,
  //   oldContent: ctx.context.sourceCode.text.slice(rangeStart, rangeEnd),
  // })

  ctx.report({
    node,
    message: 'Keep sorted',
    fix(fixer) {
      return fixer.replaceTextRange([rangeStart, rangeEnd], newContent)
    },
  })
}

function getString(node: Tree.Node): string | null {
  if (node.type === 'Identifier')
    return node.name
  if (node.type === 'Literal')
    return String(node.raw)
  return null
}

function insertComma(text: string): string {
  if (text.at(-1) === ',')
    return text
  if (text.at(-1) === '\n') {
    if (text.at(-2) === ',')
      return text
    return `${text.slice(0, -1)},\n`
  }
  return `${text},`
}

function removeComma(text: string): string {
  if (text.at(-1) === ',')
    return text.slice(0, -1)

  if (text.at(-1) === '\n' && text.at(-2) === ',')
    return `${text.slice(0, -2)}\n`

  return text
}
