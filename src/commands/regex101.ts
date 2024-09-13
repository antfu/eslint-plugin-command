import type { Command, Tree } from '../types'
import { parseComment } from '@es-joy/jsdoccomment'

// @regex101 https://regex101.com/?regex=%60%60%60%28.*%29%5Cn%28%5B%5Cs%5CS%5D*%29%5Cn%60%60%60&flavor=javascript
const reCodeBlock = /```(.*)\n([\s\S]*)\n```/

export const regex101: Command = {
  name: 'regex101',
  /**
   * @regex101 https://regex101.com/?regex=%28%5Cb%7C%5Cs%7C%5E%29%28%40regex101%29%28%5Cs%5CS%2B%29%3F%28%5Cb%7C%5Cs%7C%24%29&flavor=javascript
   */
  match: /(\b|\s|^)(@regex101)(\s\S+)?(\b|\s|$)/,
  commentType: 'both',
  action(ctx) {
    const literal = ctx.findNodeBelow((n) => {
      return n.type === 'Literal' && 'regex' in n
    }) as Tree.RegExpLiteral | undefined
    if (!literal)
      return ctx.reportError('Unable to find a regexp literal to generate')

    const [
      _fullStr = '',
      spaceBefore = '',
      commandStr = '',
      existingUrl = '',
      _spaceAfter = '',
    ] = ctx.matches as string[]

    let example: string | undefined

    if (ctx.comment.value.includes('```') && ctx.comment.value.includes('@example')) {
      try {
        const parsed = parseComment(ctx.comment, '')
        const tag = parsed.tags.find(t => t.tag === 'example')
        const description = tag?.description
        const code = description?.match(reCodeBlock)?.[2].trim()
        if (code)
          example = code
      }
      catch {}
    }

    // docs: https://github.com/firasdib/Regex101/wiki/FAQ#how-to-prefill-the-fields-on-the-interface-via-url
    const query = new URLSearchParams()
    query.set('regex', literal.regex.pattern)
    if (literal.regex.flags)
      query.set('flags', literal.regex.flags)
    query.set('flavor', 'javascript')
    if (example)
      query.set('testString', example)
    const url = `https://regex101.com/?${query}`

    if (existingUrl.trim() === url.trim())
      return

    const indexStart = ctx.comment.range[0] + ctx.matches.index! + spaceBefore.length + 2 /** comment prefix */
    const indexEnd = indexStart + commandStr.length + existingUrl.length

    ctx.report({
      loc: {
        start: ctx.source.getLocFromIndex(indexStart),
        end: ctx.source.getLocFromIndex(indexEnd),
      },
      removeComment: false,
      message: `Update the regex101 link`,
      fix(fixer) {
        return fixer.replaceTextRange([indexStart, indexEnd], `@regex101 ${url}`)
      },
    })
  },
}
