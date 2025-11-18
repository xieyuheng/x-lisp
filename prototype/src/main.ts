#!/usr/bin/env -S node --stack-size=65536

import * as Cmd from "@xieyuheng/command.js"
import { flags } from "./flags.ts"
import { globals } from "./globals.ts"
import { errorReport } from "./helpers/error/errorReport.ts"
import { getPackageJson } from "./helpers/node/getPackageJson.ts"
import { createUrl } from "./helpers/url/createUrl.ts"
import { load } from "./lang/load/index.ts"
import { startRepl } from "./services/startRepl.ts"

const { version } = getPackageJson()

const router = Cmd.createRouter("x-lisp-proto", version)

router.defineRoutes(["run file --debug --no-prelude", "repl --no-prelude"])

router.defineHandlers({
  run: {
    middleware: [setupGlobals(), setupFlags()],
    handler: ({ args: [file] }) => load(createUrl(file)),
  },
  repl: {
    middleware: [setupGlobals(), setupFlags(), enableDebug()],
    handler() {
      startRepl()
    },
  },
})

try {
  await router.run(process.argv.slice(2))
} catch (error) {
  console.log(errorReport(error))
  process.exit(1)
}

// Middleware

function setupGlobals(): Cmd.Middleware {
  return (ctx, next) => {
    globals.commandLineArgs = ctx.tokens
    return next(ctx)
  }
}

function setupFlags(): Cmd.Middleware {
  return (ctx, next) => {
    if (ctx.options["--debug"] !== undefined) flags["debug"] = true
    if (ctx.options["--no-prelude"] !== undefined) flags["no-prelude"] = true
    return next(ctx)
  }
}
function enableDebug(): Cmd.Middleware {
  return (ctx, next) => {
    flags["debug"] = true
    return next(ctx)
  }
}
