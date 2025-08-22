import { type Command } from "@xieyuheng/commander.js"
import * as X from "@xieyuheng/x-data.js"
import { runSexps } from "../lang/load/index.ts"
import { createMod } from "../lang/mod/index.ts"
import { aboutModule } from "../lang/prelude/aboutModule.ts"
import { importPrelude } from "../lang/prelude/index.ts"
import { errorReport } from "../utils/error/errorReport.ts"
import { getPackageJson } from "../utils/node/getPackageJson.ts"

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

    const { version } = getPackageJson()
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
