#!/usr/bin/env -S node --stack-size=65536

import { Commander } from "@xieyuheng/commander.js"
import { FormatCommand } from "./commands/FormatCommand.ts"
import { ReplCommand } from "./commands/ReplCommand.ts"
import { RunCommand } from "./commands/RunCommand.ts"

async function main() {
  const commander = new Commander()

  commander.use(RunCommand)
  commander.use(ReplCommand)
  commander.use(FormatCommand)

  await commander.run(process.argv)
}

main()
