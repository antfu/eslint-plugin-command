import type { Command, CommandContext, Tree } from '../types'

export interface KeepSortedInlineOptions {
  key?: string
  keys?: string[]
}

const reLine = /^[/@:]\s*(?:keep-sorted|sorted)\s*(\{.*\})?$/
const reBlock = /(?:\b|\s)@keep-sorted\s*(\{.*\})?(?:\b|\s|$)/

export const keepSorted: Command = {
  name: 'keep-sorted',
  commentType: 'both',
  match: comment => comment.value.trim().match(comment.type === 'Line' ? reLine : reBlock),
  action(ctx) {
    const optionsRaw = ctx.matches[1] || '{}'
    let options: KeepSortedInlineOptions | null = null
    try {
      options = JSON.parse(optionsRaw)
    }
    catch {
      return ctx.reportError(`Failed to parse options: ${optionsRaw}`)
    }

    let node = ctx.findNodeBelow(
      'ObjectExpression',
      'ObjectPattern',
      'ArrayExpression',
      'TSInterfaceBody',
      'TSTypeLiteral',
      'TSSatisfiesExpression',
    ) || ctx.findNodeBelow(
      'ExportNamedDeclaration',
    )

    // Unwrap TSSatisfiesExpression
    if (node?.type === 'TSSatisfiesExpression') {
      if (node.expression.type !== 'ArrayExpression' && node.expression.type !== 'ObjectExpression') {
        node = undefined
      }
      else {
        node = node.expression
      }
    }

    if (!node)
      return ctx.reportError('Unable to find object/array/interface to sort')

    const objectKeys = [
      options?.key,
      ...(options?.keys || []),
    ].filter(x => x != null) as string[]

    if (objectKeys.length > 0 && node.type !== 'ArrayExpression')
      return ctx.reportError(`Only arrays can be sorted by keys, but got ${node.type}`)

    if (node.type === 'ObjectExpression') {
      return sort(
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
      return sort(
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
      return sort(
        ctx,
        node,
        node.body,
        (prop) => {
          if (prop.type === 'TSPropertySignature')
            return getString(prop.key)
          return null
        },
        false,
      )
    }
    else if (node.type === 'TSTypeLiteral') {
      return sort(
        ctx,
        node,
        node.members,
        (prop) => {
          if (prop.type === 'TSPropertySignature')
            return getString(prop.key)
          return null
        },
        false,
      )
    }
    else if (node.type === 'ExportNamedDeclaration') {
      return sort(
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
    else {
      return false
    }
  },
}

function sort<T extends Tree.Node>(
  ctx: CommandContext,
  node: Tree.Node,
  list: T[],
  getName: (node: T) => string | (string | null)[] | null,
  insertComma = true,
): false | void {
  const firstToken = ctx.context.sourceCode.getFirstToken(node)!
  const lastToken = ctx.context.sourceCode.getLastToken(node)!
  if (!firstToken || !lastToken)
    return ctx.reportError('Unable to find object/array/interface to sort')

  if (list.length < 2)
    return false

  const reordered = list.slice()
  const ranges = new Map<typeof list[number], [number, number, string]>()
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
    const nextToken = ctx.context.sourceCode.getTokenAfter(item)
    if (nextToken?.type === 'Punctuator' && nextToken.value === ',')
      lastRange = nextToken.range[1]
    const nextChar = ctx.context.sourceCode.getText()[lastRange]

    // Insert comma if it's the last item without a comma
    let text = ctx.getTextOf([rangeEnd, lastRange])
    if (nextToken === lastToken && insertComma)
      text += ','

    // Include subsequent newlines
    if (nextChar === '\n') {
      lastRange++
      text += '\n'
    }

    ranges.set(item, [rangeEnd, lastRange, text])
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
    return false

  const newContent = reordered
    .map(i => ranges.get(i)![2])
    .join('')

  // console.log({
  //   reordered,
  //   newContent,
  //   oldContent: ctx.context.sourceCode.text.slice(rangeStart, rangeEnd),
  // })

  ctx.report({
    node,
    message: 'Keep sorted',
    removeComment: false,
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
