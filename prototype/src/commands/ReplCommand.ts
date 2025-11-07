import { type Command } from "@xieyuheng/commander.js"
import * as X from "@xieyuheng/x-sexp.js"
import { flags } from "../flags.ts"
import { globals } from "../globals.ts"
import { errorReport } from "../helpers/error/errorReport.ts"
import { getPackageJson } from "../helpers/node/getPackageJson.ts"
import { builtinModule } from "../interpreter/builtin/builtinModule.ts"
import { importBuiltin } from "../interpreter/builtin/index.ts"
import { runSexps } from "../interpreter/load/index.ts"
import { createMod } from "../interpreter/mod/index.ts"
import { importPrelude } from "../interpreter/prelude/importPrelude.ts"

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
    builtinModule(mod)
    importBuiltin(mod)
    if (!flags["no-prelude"]) {
      importPrelude(mod)
    }

    const repl = X.createRepl({
      welcome: `Welcome to x-lisp-proto ${getPackageJson().version}`,
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
