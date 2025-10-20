#!/usr/bin/env -S node --stack-size=65536

import { Commander } from "@xieyuheng/commander.js"
import { BasicRunCommand } from "./commands/BasicRunCommand.ts"
import { ReplCommand } from "./commands/ReplCommand.ts"
import { RunCommand } from "./commands/RunCommand.ts"

async function main() {
  const commander = new Commander()

  commander.use(RunCommand)
  commander.use(ReplCommand)
  commander.use(BasicRunCommand)

  await commander.run(process.argv)
}

main()
