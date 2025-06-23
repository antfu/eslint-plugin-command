import type { RuleListener, RuleWithMeta, RuleWithMetaAndName } from '@typescript-eslint/utils/eslint-utils'
import type { RuleContext } from '@typescript-eslint/utils/ts-eslint'
import type { Rule } from 'eslint'
import type { Command, Tree } from './types'
import { isFunction, last, toArray } from '@antfu/utils'
import { AST_TOKEN_TYPES } from '@typescript-eslint/utils'

export interface RuleModule<
  T extends readonly unknown[],
> extends Rule.RuleModule {
  defaultOptions: T
}

/**
 * Creates reusable function to create rules with default options and docs URLs.
 *
 * @param urlCreator Creates a documentation URL for a given rule name.
 * @returns Function to create a rule with the docs URL format.
 */
function RuleCreator(urlCreator: (ruleName: string) => string) {
  // This function will get much easier to call when this is merged https://github.com/Microsoft/TypeScript/pull/26349
  // TODO - when the above PR lands; add type checking for the context.report `data` property
  return function createNamedRule<
    TOptions extends readonly unknown[],
    TMessageIds extends string,
  >({
    name,
    meta,
    ...rule
  }: Readonly<RuleWithMetaAndName<TOptions, TMessageIds>>): RuleModule<TOptions> {
    return createRule<TOptions, TMessageIds>({
      meta: {
        ...meta,
        docs: {
          ...meta.docs,
          url: urlCreator(name),
        },
      },
      ...rule,
    })
  }
}

/**
 * Creates a well-typed TSESLint custom ESLint rule without a docs URL.
 *
 * @returns Well-typed TSESLint custom ESLint rule.
 * @remarks It is generally better to provide a docs URL function to RuleCreator.
 */
function createRule<
  TOptions extends readonly unknown[],
  TMessageIds extends string,
>({
  create,
  defaultOptions,
  meta,
}: Readonly<RuleWithMeta<TOptions, TMessageIds>>): RuleModule<TOptions> {
  return {
    create: ((
      context: Readonly<RuleContext<TMessageIds, TOptions>>,
    ): RuleListener => {
      const optionsWithDefault = context.options.map((options, index) => {
        return {
          ...defaultOptions[index] || {},
          ...options || {},
        }
      }) as unknown as TOptions
      return create(context, optionsWithDefault)
    }) as any,
    defaultOptions,
    meta: meta as any,
  }
}

export const createEslintRule = RuleCreator(
  () => 'https://github.com/antfu/eslint-plugin-command',
) as any as <TOptions extends readonly unknown[], TMessageIds extends string>({ name, meta, ...rule }: Readonly<RuleWithMetaAndName<TOptions, TMessageIds>>) => RuleModule<TOptions>

const warned = new Set<string>()

export function warnOnce(message: string) {
  if (warned.has(message))
    return
  warned.add(message)
  console.warn(message)
}

export function defineAlias(command: Command, names: string[]): string[] {
  const { match, commentType = 'line' } = command

  return names.every((name) => {
    const checkLine = () => {
      const tokens = [`/ ${name}`, `@${name}`, `:${name}`]

      return tokens.every((token) => {
        if (isFunction(match))
          return !!match(toLineComment(token))
        else
          return token.match(match) !== null
      })
    }
    const checkBlock = () => {
      const token = `* @${name} `
      if (isFunction(match))
        return !!match(toBlockComment(token))
      else
        return token.match(match) !== null
    }

    if (commentType === 'line')
      return checkLine()
    else if (commentType === 'block')
      return checkBlock()
    else
      return checkLine() && checkBlock()
  },
  )
    ? names
    : ['Error: Have invalid value']
}

export function toLineComment(token: string): Tree.LineComment {
  return {
    type: AST_TOKEN_TYPES.Line,
    value: token.trim(),
    loc: {
      start: {
        column: 0,
        line: 1,
      },
      end: {
        column: token.length,
        line: 1,
      },
    },
    range: [0, token.length + 2],
  }
}

export function toBlockComment(tokens: string | string[]): Tree.BlockComment {
  const values = toArray(tokens).map(token => `* ${token} `)
  const value = values.join('\n').trim()

  return {
    type: AST_TOKEN_TYPES.Block,
    value,
    loc: {
      start: {
        column: 0,
        line: 1,
      },
      end: {
        column: last(values).length,
        line: values.length,
      },
    },
    range: [0, value.length + 4],
  }
}
