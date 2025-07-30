#!/usr/bin/env -S node

import { Commander } from "@xieyuheng/commander.js"
import { RunCommand } from "./commands/RunCommand.ts"

async function main() {
  const commander = new Commander()
  commander.use(RunCommand)
  await commander.run(process.argv)
}

main()
