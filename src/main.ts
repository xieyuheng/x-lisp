#!/usr/bin/env -S node

import { Commander } from "@xieyuheng/commander.js"
import { DebugCommand } from "./commands/DebugCommand.ts"
import { RunCommand } from "./commands/RunCommand.ts"

async function main() {
  const commander = new Commander()

  commander.use(RunCommand)
  commander.use(DebugCommand)

  await commander.run(process.argv)
}

main()
