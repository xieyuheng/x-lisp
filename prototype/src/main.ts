#!/usr/bin/env -S node --stack-size=65536

import { Commander } from "@xieyuheng/commander.js"
import { ReplCommand } from "./commands/ReplCommand.ts"
import { RunCommand } from "./commands/RunCommand.ts"

async function main() {
  const commander = new Commander()

  commander.use(ReplCommand)
  commander.use(RunCommand)

  await commander.run(process.argv)
}

main()
