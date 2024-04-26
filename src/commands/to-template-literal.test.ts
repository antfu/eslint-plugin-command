import { toTemplateLiteral as command } from './to-template-literal'
import { d, run } from './_test-utils'

run(
  command,
  {
    code: d`
    // @2tl
    const a = \`a\${a}\`, b = \`b\`, c = "c", d = 2;
    `,
    output: d`
    // @2tl
    const a = \`a\${a}\`, b = \`b\`, c = \`c\`, d = 2;
    `,
    errors: ['command-fix'],
  },
  // You can specify which one to convert
  {
    code: d`
    // @2tl 1 4
    const a = 'a', b = 'b', c = 'c', d = 'd';
    `,
    output: d`
    // @2tl 1 4
    const a = \`a\`, b = 'b', c = 'c', d = \`d\`;
    `,
    errors: ['command-fix', 'command-fix'],
  },
  // mixed
  {
    code: d`
    // @2tl 1 3
    const a = \`a\`; const b = \`b\`; const c = 'c'; const d = \`d\`; const e = 'e'; const f = 'f';
    `,
    output: d`
    // @2tl 1 3
    const a = \`a\`; const b = \`b\`; const c = \`c\`; const d = \`d\`; const e = 'e'; const f = \`f\`;
    `,
    errors: ['command-fix', 'command-fix'],
  },
)
