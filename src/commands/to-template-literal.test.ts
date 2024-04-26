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
    const a = \`a\${a}\`, b = \`b\`, c = \`c\`, d = 2;
    `,
    errors: ['command-removal', 'command-fix'],
  },
  // You can specify which one to convert
  {
    code: d`
    // @2tl 1 4
    const a = 'a', b = 'b', c = 'c', d = 'd';
    `,
    output: d`
    const a = \`a\`, b = 'b', c = 'c', d = \`d\`;
    `,
    errors: ['command-removal', 'command-fix', 'command-fix'],
  },
  // mixed
  {
    code: d`
    // @2tl 1 3
    const a = \`a\`; const b = \`b\`; const c = 'c'; const d = \`d\`; const e = 'e'; const f = 'f';
    `,
    output: d`
    const a = \`a\`; const b = \`b\`; const c = \`c\`; const d = \`d\`; const e = 'e'; const f = \`f\`;
    `,
    errors: ['command-removal', 'command-fix', 'command-fix'],
  },
  // 'a' + b + 'c' -> `a${b}c`
  {
    code: d`
    // @2tl
    const a = 'a' + b + 'c';
    `,
    output: d`
    const a = \`a\${b}c\`;
    `,
    errors: ['command-removal', 'command-fix'],
  },
  {
    code: d`
    // @2tl
    const b = b + 'c' + d + 'e' + f + z + 'g' + h + 'i' + j;
    `,
    output: d`
    const b = \`\${b}c\${d}e\${f}\${z}g\${h}i\${j}\`;
    `,
    errors: ['command-removal', 'command-fix'],
  },
  {
    code: d`
    // @2tl
    const a = a + b + c;
    `,
    output: d`
    const a = \`\${a}\${b}\${c}\`;
    `,
    errors: ['command-removal', 'command-fix'],
  },
  {
    code: d`
    // @2tl 2 4
    const a = a + b; const d = d + 'e'; const c = '3'; const d = '4';
    `,
    output: d`
    const a = a + b; const d = \`\${d}e\`; const c = '3'; const d = \`4\`;
    `,
    errors: ['command-removal', 'command-fix', 'command-fix'],
  },
  {
    code: d`
    // @2tl 1 2
    const a = '4' + b; const d = d + 'e'; const c = '3'; const d = '4';
    `,
    output: d`
    const a = \`4\${b}\`; const d = \`\${d}e\`; const c = '3'; const d = '4';
    `,
    errors: ['command-removal', 'command-fix', 'command-fix'],
  },
)
