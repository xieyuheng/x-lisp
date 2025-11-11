#!/usr/bin/env -S node --stack-size=65536

import * as cmd from "@xieyuheng/command.js"
import * as B from "./basic/index.ts"
import { compileToBasic, compileToPassLog } from "./compile/index.ts"
import { globals } from "./globals.ts"
import { errorReport } from "./helpers/error/errorReport.ts"
import { getPackageJson } from "./helpers/node/getPackageJson.ts"
import { createUrl } from "./helpers/url/createUrl.ts"
import * as L from "./lang/index.ts"
import * as M from "./machine/index.ts"
import { loadProject } from "./project/index.ts"

const { version } = getPackageJson()

const router = cmd.createRouter("x-lisp-boot", version)

router.defineRoutes([
  "test --project",
  "build --project",
  "clean --project",
  "lisp:compile-to-pass-log file",
  "lisp:compile-to-basic file",
  "basic:run file",
  "basic:bundle file",
  "machine:transpile-to-x86-assembly file",
])

router.defineHandlers({
  test: async (args, options) => {
    const project = await loadProject(options["--project"])
    await project.test()
  },
  build: async (args, options) => {
    const project = await loadProject(options["--project"])
    await project.build()
  },
  clean: async (args, options) => {
    const project = await loadProject(options["--project"])
    await project.clean()
  },
  "lisp:compile-to-pass-log": ([file]) => {
    const mod = L.loadEntry(createUrl(file))
    compileToPassLog(mod)
  },
  "lisp:compile-to-basic": ([file]) => {
    const mod = L.loadEntry(createUrl(file))
    console.log(B.prettyMod(globals.maxWidth, compileToBasic(mod)))
  },
  "basic:run": ([file]) => {
    const mod = B.loadEntry(createUrl(file))
    B.run(B.bundle(mod))
    process.stdout.write(B.console.consumeOutput())
  },
  "basic:bundle": ([file]) => {
    const mod = B.loadEntry(createUrl(file))
    console.log(B.prettyMod(globals.maxWidth, B.bundle(mod)))
  },
  "machine:transpile-to-x86-assembly": ([file]) => {
    const mod = M.load(createUrl(file))
    console.log(M.transpileToX86Assembly(mod))
  },
})

try {
  await router.run(process.argv.slice(2))
} catch (error) {
  console.log(errorReport(error))
  process.exit(1)
}
