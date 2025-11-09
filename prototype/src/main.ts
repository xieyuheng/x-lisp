#!/usr/bin/env -S node --stack-size=65536

import { CommandRouter } from "@xieyuheng/command-router.js"
import * as S from "@xieyuheng/x-sexp.js"
import { flags } from "./flags.ts"
import { globals } from "./globals.ts"
import { errorReport } from "./helpers/error/errorReport.ts"
import { getPackageJson } from "./helpers/node/getPackageJson.ts"
import { createUrlOrFileUrl } from "./helpers/url/createUrlOrFileUrl.ts"
import { builtinModule } from "./lang/builtin/builtinModule.ts"
import { importBuiltin } from "./lang/builtin/index.ts"
import { load, runSexps } from "./lang/load/index.ts"
import { createMod } from "./lang/mod/index.ts"
import { importPrelude } from "./lang/prelude/importPrelude.ts"

const router = new CommandRouter("x-lisp-proto", "")

const routes = {
  run: "file --debug --no-prelude -- run a x-lisp file",
  repl: "--no-prelude -- start x-lisp repl",
}

router.bind(routes, {
  run: (args, options) => {
    globals.commandLineArgs = args.map(String).slice(1)

    if (options["--debug"] !== undefined) {
      flags["debug"] = true
    }

    if (options["--no-prelude"] !== undefined) {
      flags["no-prelude"] = true
    }

    if (typeof args[0] !== "string") {
      let message = `[run] expect the first argument to be a path`
      message += `\n  first argument: ${args[0]}`
      throw new Error(message)
    }

    try {
      const url = createUrlOrFileUrl(args[0])
      load(url)
    } catch (error) {
      console.log(errorReport(error))
      process.exit(1)
    }
  },

  repl: (args, options) => {
    globals.commandLineArgs = args.map(String)

    // We always enable debug by default
    flags["debug"] = true

    if (options["--no-prelude"] !== undefined) {
      flags["no-prelude"] = true
    }

    const url = new URL("repl:")
    const mod = createMod(url)
    builtinModule(mod)
    importBuiltin(mod)
    if (!flags["no-prelude"]) {
      importPrelude(mod)
    }

    const repl = S.createRepl({
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

    S.replStart(repl)
  },
})

await router.run(process.argv.slice(2))
