#!/usr/bin/env -S node --stack-size=65536

import * as cmd from "@xieyuheng/command.js"
import { flags } from "./flags.ts"
import { globals } from "./globals.ts"
import { errorReport } from "./helpers/error/errorReport.ts"
import { getPackageJson } from "./helpers/node/getPackageJson.ts"
import { createUrl } from "./helpers/url/createUrl.ts"
import { load } from "./lang/load/index.ts"
import { startRepl } from "./services/startRepl.ts"

const { version } = getPackageJson()

const router = cmd.createRouter("x-lisp-proto", version)

const routes = ["run file --debug --no-prelude", "repl --no-prelude"]

router.bind(routes, {
  run: ([file], options, tokens) => {
    globals.commandLineArgs = tokens

    if (options["--debug"] !== undefined) flags["debug"] = true
    if (options["--no-prelude"] !== undefined) flags["no-prelude"] = true

    const url = createUrl(file)
    load(url)
  },
  repl: (args, options, tokens) => {
    globals.commandLineArgs = tokens

    flags["debug"] = true
    if (options["--no-prelude"] !== undefined) flags["no-prelude"] = true

    startRepl()
  },
})

// router.bind(routes, {
//   run: {
//     middleware: [setupGlobals(), setupFlags()],
//     handler: ([file]) => load(createUrl(file)),
//   },
//   repl: {
//     middleware: [setupGlobals(), setupFlags(), enableDebug()],
//     handler: () => startRepl(),
//   },
// })

try {
  await router.run(process.argv.slice(2))
} catch (error) {
  console.log(errorReport(error))
  process.exit(1)
}
