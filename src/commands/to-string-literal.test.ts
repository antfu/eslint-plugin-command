import { toStringLiteral as command } from './to-string-literal'
import { d, run } from './_test-utils'

run(
  command,
  {
    code: d`
    // @2sl
    const a = \`a\${a}\`; const b = \`b\`; const c = 'c';
    `,
    output: d`
    // @2sl
    const a = 'a\${a}'; const b = 'b'; const c = 'c';
    `,
    errors: ['command-fix', 'command-fix'],
  },
  // You can specify which one to convert
  {
    code: d`
    // @2sl 2 3
    const a = \`a\`, b = \`b\`, c = \`c\`, d = \`d\`;
    `,
    output: d`
    // @2sl 2 3
    const a = \`a\`, b = 'b', c = 'c', d = \`d\`;
    `,
    errors: ['command-fix', 'command-fix'],
  },
  // mixed
  {
    code: d`
    // @2sl 1 3
    const a = 'a', b = 'b', c = \`c\`, d = 'd', e = \`e\`, f = \`f\`;
    `,
    output: d`
    // @2sl 1 3
    const a = 'a', b = 'b', c = 'c', d = 'd', e = \`e\`, f = 'f';
    `,
    errors: ['command-fix', 'command-fix'],
  },
)
