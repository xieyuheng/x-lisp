import { type Command } from "@xieyuheng/commander.js"
import * as X from "@xieyuheng/x-data.js"
import { flags } from "../flags.ts"
import { globals } from "../globals.ts"
import { aboutModule } from "../lang/builtin/aboutModule.ts"
import { importBuiltin } from "../lang/builtin/index.ts"
import { runSexps } from "../lang/load/index.ts"
import { createMod } from "../lang/mod/index.ts"
import { importStdPrelude } from "../lang/prelude/importStdPrelude.ts"
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
    globals.commandLineArgs = commander.args.map(String)

    if (commander.options["debug"]) {
      flags["debug"] = true
    }

    if (commander.options["no-std-prelude"]) {
      flags["no-std-prelude"] = true
    }

    const url = new URL("repl:")
    const mod = createMod(url)
    aboutModule(mod)
    importBuiltin(mod)
    if (!flags["no-std-prelude"]) {
      importStdPrelude(mod)
    }

    const repl = X.createRepl({
      welcome: `Welcome to x-lisp.js ${getPackageJson().version}`,
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
