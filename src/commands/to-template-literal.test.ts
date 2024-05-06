import { toTemplateLiteral as command } from './to-template-literal'
import { $, run } from './_test-utils'

run(
  command,
  {
    code: $`
    // @2tl
    const a = \`a\${a}\`, b = \`b\`, c = "c", d = 2;
    `,
    output: $`
    const a = \`a\${a}\`, b = \`b\`, c = \`c\`, d = 2;
    `,
    errors: ['command-removal', 'command-fix'],
  },
  // You can specify which one to convert
  {
    code: $`
    // @2tl 1 4
    const a = 'a', b = 'b', c = 'c', d = 'd';
    `,
    output: $`
    const a = \`a\`, b = 'b', c = 'c', d = \`d\`;
    `,
    errors: ['command-removal', 'command-fix', 'command-fix'],
  },
  // mixed
  {
    code: $`
    // @2tl 1 3
    const a = \`a\`; const b = \`b\`; const c = 'c'; const d = \`d\`; const e = 'e'; const f = 'f';
    `,
    output: $`
    const a = \`a\`; const b = \`b\`; const c = \`c\`; const d = \`d\`; const e = 'e'; const f = \`f\`;
    `,
    errors: ['command-removal', 'command-fix', 'command-fix'],
  },
  // 'a' + b + 'c' -> `a${b}c`
  {
    code: $`
    // @2tl
    const a = 'a' + b + 'c';
    `,
    output: $`
    const a = \`a\${b}c\`;
    `,
    errors: ['command-removal', 'command-fix'],
  },
  {
    code: $`
    // @2tl
    const b = b + 'c' + d + 'e' + f + z + 'g' + h + 'i' + j;
    `,
    output: $`
    const b = \`\${b}c\${d}e\${f}\${z}g\${h}i\${j}\`;
    `,
    errors: ['command-removal', 'command-fix'],
  },
  {
    code: $`
    // @2tl
    const a = a + b + c;
    `,
    output: $`
    const a = \`\${a}\${b}\${c}\`;
    `,
    errors: ['command-removal', 'command-fix'],
  },
  {
    code: $`
    // @2tl 2 4
    const a = a + b; const d = d + 'e'; const c = '3'; const d = '4';
    `,
    output: $`
    const a = a + b; const d = \`\${d}e\`; const c = '3'; const d = \`4\`;
    `,
    errors: ['command-removal', 'command-fix', 'command-fix'],
  },
  {
    code: $`
    // @2tl 1 2
    const a = '4' + b; const d = d + 'e'; const c = '3'; const d = '4';
    `,
    output: $`
    const a = \`4\${b}\`; const d = \`\${d}e\`; const c = '3'; const d = '4';
    `,
    errors: ['command-removal', 'command-fix', 'command-fix'],
  },
  // escape
  {
    code: $`
    // @2tl
    const a = "\`"
    `,
    output: $`
    const a = \`\\\`\`
    `,
    errors: ['command-removal', 'command-fix'],
  },
  {
    code: $`
    // @2tl
    const a = str + "\`" 
    `,
    output: $`
    const a = \`\${str}\\\`\` 
    `,
    errors: ['command-removal', 'command-fix'],
  },
  {
    code: $`
    // @2tl
    const a = "\${str}"
    `,
    output: $`
    const a = \`\\\${str}\`
    `,
    errors: ['command-removal', 'command-fix'],
  },
)
