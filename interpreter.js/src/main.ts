#!/usr/bin/env -S node --stack-size=65536

import { Commander } from "@xieyuheng/commander.js"
import { InterpretCommand } from "./commands/InterpretCommand.ts"
import { ReplCommand } from "./commands/ReplCommand.ts"

async function main() {
  const commander = new Commander()

  commander.use(ReplCommand)
  commander.use(InterpretCommand)

  await commander.run(process.argv)
}

main()
