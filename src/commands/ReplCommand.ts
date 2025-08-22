import { type Command } from "@xieyuheng/commander.js"
import * as X from "@xieyuheng/x-data.js"
import fs from "node:fs"
import Path from "node:path"
import { fileURLToPath } from "node:url"
import { runSexps } from "../lang/load/index.ts"
import { createMod } from "../lang/mod/index.ts"
import { aboutModule } from "../lang/prelude/aboutModule.ts"
import { importPrelude } from "../lang/prelude/index.ts"
import { errorReport } from "../utils/error/errorReport.ts"

export const ReplCommand: Command = {
  name: "repl",
  description: "Start the REPL",
  help(commander) {
    let message = `The ${this.name} start the read-eval-print loop.\n`
    return message
  },

  async run(commander) {
    const url = new URL("repl:")
    const mod = createMod(url)
    importPrelude(mod)
    aboutModule(mod)

    const currentDir = Path.dirname(fileURLToPath(import.meta.url))
    const packageFile = Path.join(currentDir, "../../package.json")
    const packageText = fs.readFileSync(packageFile, "utf8")
    const packageJson = JSON.parse(packageText)
    const version = packageJson["version"]

    const repl = X.createRepl({
      welcome: `Welcome to occam-lisp.js ${version}`,
      prompt: "> ",
      async onSexps(sexps) {
        try {
          runSexps(mod, sexps)
        } catch (error) {
          console.log(errorReport(error))
        }
      },
    })

    X.replStart(repl)
  },
}
