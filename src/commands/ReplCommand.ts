import { type Command } from "@xieyuheng/commander.js"
import * as X from "@xieyuheng/x-sexp.js"
import { flags } from "../flags.ts"
import { globals } from "../globals.ts"
import { errorReport } from "../helpers/error/errorReport.ts"
import { getPackageJson } from "../helpers/node/getPackageJson.ts"
import { aboutModule } from "../lang/builtin/aboutModule.ts"
import { importBuiltin } from "../lang/builtin/index.ts"
import { runSexps } from "../lang/load/index.ts"
import { createMod } from "../lang/mod/index.ts"
import { importPrelude } from "../lang/prelude/importPrelude.ts"

export const ReplCommand: Command = {
  name: "repl",
  description: "Start x-lisp REPL",
  help(commander) {
    let message = `The ${this.name} start x-lisp's read-eval-print loop.`
    return message
  },

  async run(commander) {
    globals.commandLineArgs = commander.args.map(String)

    // We always enable debug by default
    flags["debug"] = true

    if (commander.options["no-prelude"]) {
      flags["no-prelude"] = true
    }

    const url = new URL("repl:")
    const mod = createMod(url)
    aboutModule(mod)
    importBuiltin(mod)
    if (!flags["no-prelude"]) {
      importPrelude(mod)
    }

    const repl = X.createRepl({
      welcome: `Welcome to x-lisp.js ${getPackageJson().version}`,
      prompt: ">> ",
      async onSexps(sexps) {
        try {
          runSexps(mod, sexps, { resultPrompt: "=> " })
        } catch (error) {
          console.log(errorReport(error))
        }
      },
    })

    X.replStart(repl)
  },
}
