#!/usr/bin/env -S node

import { Commander } from "@xieyuheng/commander.js"
import { ReplCommand } from "./commands/ReplCommand.ts"
import { RunCommand } from "./commands/RunCommand.ts"

async function main() {
  const commander = new Commander()

  commander.use(RunCommand)
  commander.use(ReplCommand)

  await commander.run(process.argv)
}

main()
