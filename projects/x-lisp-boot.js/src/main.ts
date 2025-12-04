#!/usr/bin/env -S node --stack-size=65536

import * as cmd from "@xieyuheng/command.js"
import { getPackageJson } from "@xieyuheng/helpers.js/node"
import { createUrl } from "@xieyuheng/helpers.js/url"
import fs from "node:fs"
import { fileURLToPath } from "node:url"
import * as B from "./basic/index.ts"
import { globals } from "./globals.ts"
import * as X from "./lang/index.ts"
import * as M from "./machine/index.ts"
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
  "basic:bundle file",
  "machine:transpile-to-x86-assembly file",
  "machine:assemble-x86 file",
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
  "basic:bundle": ({ args: [file] }) => {
    const mod = B.loadEntry(createUrl(file))
    console.log(B.prettyMod(globals.maxWidth, B.bundle(mod)))
  },
  "machine:transpile-to-x86-assembly": ({ args: [file] }) => {
    const mod = M.load(createUrl(file))
    console.log(mod)
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

await router.run(process.argv.slice(2))

// try {
//   await router.run(process.argv.slice(2))
// } catch (error) {
//   console.log(errorReport(error))
//   process.exit(1)
// }
