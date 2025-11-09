#!/usr/bin/env -S node --stack-size=65536

import { Commander } from "@xieyuheng/commander.js"
import { BasicBundleCommand } from "./commands/BasicBundleCommand.ts"
import { BasicRunCommand } from "./commands/BasicRunCommand.ts"
import { CompilePassesCommand } from "./commands/CompilePassesCommand.ts"
import { CompileToBasicCommand } from "./commands/CompileToBasicCommand.ts"
import { RunViaBasicCommand } from "./commands/RunViaBasicCommand.ts"

async function main() {
  const commander = new Commander()

  commander.use(BasicRunCommand)
  commander.use(BasicBundleCommand)
  commander.use(RunViaBasicCommand)
  commander.use(CompilePassesCommand)
  commander.use(CompileToBasicCommand)

  await commander.run(process.argv)
}

main()
