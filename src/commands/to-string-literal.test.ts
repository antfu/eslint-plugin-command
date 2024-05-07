import { toStringLiteral as command } from './to-string-literal'
import { $, run } from './_test-utils'

run(
  command,
  {
    code: $`
    // @2sl
    const a = \`a\`; const b = \`b\`; const c = 'c';
    `,
    output: $`
    const a = "a"; const b = "b"; const c = 'c';
    `,
    errors: ['command-fix'],
  },
  // You can specify which one to convert
  {
    code: $`
    // @2sl 2 3
    const a = \`a\`, b = \`b\`, c = \`c\`, d = \`d\`;
    `,
    output: $`
    const a = \`a\`, b = "b", c = "c", d = \`d\`;
    `,
    errors: ['command-fix'],
  },
  // mixed
  {
    code: $`
    // @2sl 1 3
    const a = 'a', b = 'b', c = \`c\`, d = 'd', e = \`e\`, f = \`f\`;
    `,
    output: $`
    const a = 'a', b = 'b', c = "c", d = 'd', e = \`e\`, f = "f";
    `,
    errors: ['command-fix'],
  },
  // `a${b}d` -> `'a' + b + 'd'`
  {
    code: $`
    // @2sl
    const a = \`\${g}a\${a}a\${b}c\${d}e\${a}\`;
    `,
    output: $`
    const a = g + "a" + a + "a" + b + "c" + d + "e" + a;
    `,
    errors: ['command-fix'],
  },
  // escape
  {
    code: $`
    // @2sl
    const a = \`"\\"\\\\"\`
    `,
    output: $`
    const a = "\\"\\\\\\"\\\\\\\\\\""
    `,
    errors: ['command-fix'],
  },
)
