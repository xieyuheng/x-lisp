#!/usr/bin/env -S node --stack-size=65536

import * as cmd from "@xieyuheng/command.js"
import { errorReport } from "@xieyuheng/helpers.js/error"
import { getPackageJson } from "@xieyuheng/helpers.js/node"
import { createUrl } from "@xieyuheng/helpers.js/url"
import { fileURLToPath } from "node:url"
import { globals } from "./globals.ts"
import * as B from "./lang/index.ts"

const { version } = getPackageJson(fileURLToPath(import.meta.url))

const router = cmd.createRouter("basic-lisp.js", version)

router.defineRoutes(["run file", "bundle file"])

router.defineHandlers({
  run: ({ args: [file] }) => {
    const mod = B.loadEntry(createUrl(file))
    B.run(B.bundle(mod))
    process.stdout.write(B.console.consumeOutput())
  },
  bundle: ({ args: [file] }) => {
    const mod = B.loadEntry(createUrl(file))
    console.log(B.prettyMod(globals.maxWidth, B.bundle(mod)))
  },
})

try {
  await router.run(process.argv.slice(2))
} catch (error) {
  console.log(errorReport(error))
  // console.log(error)
  process.exit(1)
}
