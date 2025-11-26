#!/usr/bin/env -S node --stack-size=65536

import * as B from "@xieyuheng/basic-lisp.js"
import * as cmd from "@xieyuheng/command.js"
import { errorReport } from "@xieyuheng/helpers.js/error"
import { getPackageJson } from "@xieyuheng/helpers.js/node"
import { createUrl } from "@xieyuheng/helpers.js/url"
import { fileURLToPath } from "node:url"
import { globals } from "./globals.ts"
import * as X from "./lang/index.ts"
import {
  loadModuleProject,
  loadProject,
  projectBuild,
  projectClean,
  projectTest,
} from "./project/index.ts"
import * as Services from "./services/index.ts"

const { version } = getPackageJson(fileURLToPath(import.meta.url))

const router = cmd.createRouter("x-lisp-boot.js", version)

router.defineRoutes([
  "module:test file",
  "module:build file",
  "project:test --config",
  "project:build --config",
  "project:clean --config",
  "file:compile-to-pass-log file",
  "file:compile-to-basic file",
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
  "file:compile-to-pass-log": ({ args: [file] }) => {
    const mod = X.loadEntry(createUrl(file))
    Services.compileLangToPassLog(mod)
  },
  "file:compile-to-basic": ({ args: [file] }) => {
    const mod = X.loadEntry(createUrl(file))
    console.log(B.prettyMod(globals.maxWidth, Services.compileXToBasic(mod)))
  },
})

await router.run(process.argv.slice(2))

// try {
//   await router.run(process.argv.slice(2))
// } catch (error) {
//   console.log(errorReport(error))
//   process.exit(1)
// }
