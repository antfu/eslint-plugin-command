import { interconvertStringTemplateLiteral as command } from './interconvert-string-template-literal'
import { d, run } from './_test-utils'

run(
  command,
  {
    code: d`
    // @2sl
    const a = \`a\${a}\`, b = \`b\`, c = "c";
    `,
    output: d`
    // @2sl
    const a = 'a\${a}', b = 'b', c = "c";
    `,
    errors: ['command-fix', 'command-fix'],
  },
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
    // @2sl 2 3
    const a = \`a\`, b = \`b\`, c = \`c\`, d = \`d\`;
    `,
    output: d`
    // @2sl 2 3
    const a = \`a\`, b = 'b', c = 'c', d = \`d\`;
    `,
    errors: ['command-fix', 'command-fix'],
  },
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
  // hybrid, the numbers should be the same type
  {
    code: d`
    // @2sl 1 2
    const a = 'a', b = 'b', c = \`c\`, d = 'd', e = \`e\`;
    `,
    output: d`
    // @2sl 1 2
    const a = 'a', b = 'b', c = 'c', d = 'd', e = 'e';
    `,
    errors: ['command-fix', 'command-fix'],
  },
  {
    code: d`
    // @2tl 1 2
    const a = \`a\`; const b = \`b\`; const c = 'c'; const d = \`d\`; const e = 'e';
    `,
    output: d`
    // @2tl 1 2
    const a = \`a\`; const b = \`b\`; const c = \`c\`; const d = \`d\`; const e = \`e\`;
    `,
    errors: ['command-fix', 'command-fix'],
  },
)
