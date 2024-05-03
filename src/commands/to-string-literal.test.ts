import { toStringLiteral as command } from './to-string-literal'
import { d, run } from './_test-utils'

run(
  command,
  {
    code: d`
    // @2sl
    const a = \`a\`; const b = \`b\`; const c = 'c';
    `,
    output: d`
    const a = 'a'; const b = 'b'; const c = 'c';
    `,
    errors: ['command-removal', 'command-fix', 'command-fix'],
  },
  // You can specify which one to convert
  {
    code: d`
    // @2sl 2 3
    const a = \`a\`, b = \`b\`, c = \`c\`, d = \`d\`;
    `,
    output: d`
    const a = \`a\`, b = 'b', c = 'c', d = \`d\`;
    `,
    errors: ['command-removal', 'command-fix', 'command-fix'],
  },
  // mixed
  {
    code: d`
    // @2sl 1 3
    const a = 'a', b = 'b', c = \`c\`, d = 'd', e = \`e\`, f = \`f\`;
    `,
    output: d`
    const a = 'a', b = 'b', c = 'c', d = 'd', e = \`e\`, f = 'f';
    `,
    errors: ['command-removal', 'command-fix', 'command-fix'],
  },
  // `a${b}d` -> `'a' + b + 'd'`
  {
    code: d`
    // @2sl
    const a = \`\${g}a\${a}a\${b}c\${d}e\${a}\`;
    `,
    output: d`
    const a = g + 'a' + a + 'a' + b + 'c' + d + 'e' + a;
    `,
    errors: ['command-removal', 'command-fix'],
  },
  // escape
  {
    code: d`
    // @2sl
    const a = \`'\`
    `,
    output: d`
    const a = '\\''
    `,
    errors: ['command-removal', 'command-fix'],
  },
)
