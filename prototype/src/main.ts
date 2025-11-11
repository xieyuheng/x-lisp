#!/usr/bin/env -S node --stack-size=65536

import * as cmd from "@xieyuheng/command.js"
import * as S from "@xieyuheng/x-sexp.js"
import { flags } from "./flags.ts"
import { globals } from "./globals.ts"
import { errorReport } from "./helpers/error/errorReport.ts"
import { getPackageJson } from "./helpers/node/getPackageJson.ts"
import { createUrlOrFileUrl } from "./helpers/url/createUrlOrFileUrl.ts"
import { load, runSexps } from "./lang/load/index.ts"

const { version } = getPackageJson()

const router = cmd.createRouter("x-lisp-proto", version)

const routes = [
  "run file --debug --no-prelude -- run a x-lisp file",
  "repl --no-prelude -- start x-lisp repl",
]

router.bind(routes, {
  run: ([file], options, tokens) => {
    globals.commandLineArgs = tokens

    if (options["--debug"] !== undefined) flags["debug"] = true
    if (options["--no-prelude"] !== undefined) flags["no-prelude"] = true

    const url = createUrlOrFileUrl(file)
    load(url)
  },
  repl: (args, options, tokens) => {
    globals.commandLineArgs = tokens

    flags["debug"] = true
    if (options["--no-prelude"] !== undefined) flags["no-prelude"] = true

    const url = new URL("repl:")
    const mod = load(url)
    const repl = S.createRepl({
      welcome: `Welcome to x-lisp-proto ${version}`,
      prompt: ">> ",
      onSexps: (sexps) => {
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

try {
  await router.run(process.argv.slice(2))
} catch (error) {
  console.log(errorReport(error))
  process.exit(1)
}
