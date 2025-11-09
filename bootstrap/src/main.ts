#!/usr/bin/env -S node --stack-size=65536

import { Commander } from "@xieyuheng/commander.js"
import { BundleBasicCommand } from "./commands/BundleBasicCommand.ts"
import { CompilePassesCommand } from "./commands/CompilePassesCommand.ts"
import { CompileToBasicCommand } from "./commands/CompileToBasicCommand.ts"
import { BasicRunCommand } from "./commands/BasicRunCommand.ts"
import { RunViaBasicCommand } from "./commands/RunViaBasicCommand.ts"

async function main() {
  const commander = new Commander()

  commander.use(BasicRunCommand)
  commander.use(BundleBasicCommand)
  commander.use(RunViaBasicCommand)
  commander.use(CompilePassesCommand)
  commander.use(CompileToBasicCommand)

  await commander.run(process.argv)
}

main()
