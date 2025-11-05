#!/usr/bin/env -S node --stack-size=65536

import { Commander } from "@xieyuheng/commander.js"
import { CompilePassesCommand } from "./commands/CompilePassesCommand.ts"
import { CompileToBasicCommand } from "./commands/CompileToBasicCommand.ts"
import { InterpretBasicCommand } from "./commands/InterpretBasicCommand.ts"
import { InterpretCommand } from "./commands/InterpretCommand.ts"
import { ReplCommand } from "./commands/ReplCommand.ts"

async function main() {
  const commander = new Commander()

  commander.use(ReplCommand)
  commander.use(InterpretCommand)
  commander.use(InterpretBasicCommand)
  commander.use(CompilePassesCommand)
  commander.use(CompileToBasicCommand)

  await commander.run(process.argv)
}

main()
