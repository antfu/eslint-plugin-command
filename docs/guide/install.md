# Installation

Install the `eslint-plugin-command` package:

```bash
npm i eslint-plugin-command -D
```

In your flat config `eslint.config.mjs`:

```js
// eslint.config.mjs
import command from 'eslint-plugin-command/config'

export default [
  // ... your other flat config
  command(),
]
```

## Custom Commands

It's also possible to define your custom commands.

```js
// eslint.config.mjs
import command from 'eslint-plugin-command/config'
import { builtinCommands, defineCommand } from 'eslint-plugin-command/commands'

const myCommand = defineCommand({
  name: 'my-command',
  // RegExp to match the command comment (without leading `//`)
  match: /^@my-command$/,
  action(context) {
    // Do something with the context
  },
})

export default [
  // ... your other flat config
  command({
    commands: [
      ...builtinCommands,
      myCommand,
    ]
  }),
]
```

You can refer to [the built-in commands as examples](https://github.com/antfu/eslint-plugin-command/tree/main/src/commands).

## VSCode Snippets

You can use the following VSCode snippets to quickly insert the command comments:

<<< @/docs/guide/snippets.json
