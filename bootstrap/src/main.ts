#!/usr/bin/env -S node --stack-size=65536

import * as cmd from "@xieyuheng/command.js"
import fs from "node:fs"
import * as B from "./basic/index.ts"
import { globals } from "./globals.ts"
import { errorReport } from "./helpers/error/errorReport.ts"
import { getPackageJson } from "./helpers/node/getPackageJson.ts"
import { createUrl } from "./helpers/url/createUrl.ts"
import * as L from "./lang/index.ts"
import * as M from "./machine/index.ts"
import {
  loadModuleProject,
  loadProject,
  projectBuild,
  projectClean,
  projectTest,
} from "./project/index.ts"
import * as Services from "./services/index.ts"

const { version } = getPackageJson()

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
  "machine:transpile-to-x86-assembly file",
  "machine:assemble-x86 file",
])

router.defineHandlers({
  "module:test": ({ args: [file] }) => projectTest(loadModuleProject(file)),
  "module:build": ({ args: [file] }) => projectBuild(loadModuleProject(file)),
  "project:test": ({ options }) => projectTest(loadProject(options["--config"])),
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
  "machine:transpile-to-x86-assembly": ({ args: [file] }) => {
    const mod = M.load(createUrl(file))
    const assemblyCode = M.transpileToX86Assembly(mod)
    console.log(assemblyCode)
  },
  "machine:assemble-x86": ({ args: [file] }) => {
    const mod = M.load(createUrl(file))
    const assemblyCode = M.transpileToX86Assembly(mod)
    const assemblyFile = file + ".x86.s"
    fs.writeFileSync(assemblyFile, assemblyCode)
    Services.assembleX86File(assemblyFile)
  },
})

try {
  await router.run(process.argv.slice(2))
} catch (error) {
  console.log(errorReport(error))
  // console.log(error)
  process.exit(1)
}
