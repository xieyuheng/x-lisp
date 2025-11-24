#!/usr/bin/env -S node --stack-size=65536

import * as B from "@xieyuheng/basic-lisp.js"
import * as cmd from "@xieyuheng/command.js"
import { errorReport } from "@xieyuheng/helpers.js/error"
import { getPackageJson } from "@xieyuheng/helpers.js/node"
import { createUrl } from "@xieyuheng/helpers.js/url"
import { fileURLToPath } from "node:url"
import { globals } from "./globals.ts"
import * as L from "./lang/index.ts"
import {
  loadModuleProject,
  loadProject,
  projectBuild,
  projectClean,
  projectTest,
} from "./project/index.ts"
import * as Services from "./services/index.ts"

const { version } = getPackageJson(fileURLToPath(import.meta.url))

const router = cmd.createRouter("x-lisp-boot", version)

router.defineRoutes([
  "module:test file",
  "module:build file",
  "project:test --config",
  "project:build --config",
  "project:clean --config",
  "lisp:compile-to-pass-log file",
  "lisp:compile-to-basic file",
  "basic:run file",
  "basic:bundle file",
])

router.defineHandlers({
  "module:test": ({ args: [file] }) => projectTest(loadModuleProject(file)),
  "module:build": ({ args: [file] }) => projectBuild(loadModuleProject(file)),
  "project:test": ({ options }) =>
    projectTest(loadProject(options["--config"])),
  "project:build": ({ options }) =>
    projectBuild(loadProject(options["--config"])),
  "project:clean": ({ options }) =>
    projectClean(loadProject(options["--config"])),
  "lisp:compile-to-pass-log": ({ args: [file] }) => {
    const mod = L.loadEntry(createUrl(file))
    Services.compileLangToPassLog(mod)
  },
  "lisp:compile-to-basic": ({ args: [file] }) => {
    const mod = L.loadEntry(createUrl(file))
    console.log(B.prettyMod(globals.maxWidth, Services.compileLangToBasic(mod)))
  },
  "basic:run": ({ args: [file] }) => {
    const mod = B.loadEntry(createUrl(file))
    B.run(B.bundle(mod))
    process.stdout.write(B.console.consumeOutput())
  },
  "basic:bundle": ({ args: [file] }) => {
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
