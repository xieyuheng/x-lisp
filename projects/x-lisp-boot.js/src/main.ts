#!/usr/bin/env -S node

import * as cmd from "@xieyuheng/cmd.js"
import { getPackageJson } from "@xieyuheng/helpers.js/node"
import { createUrl } from "@xieyuheng/helpers.js/url"
import fs from "node:fs"
import { fileURLToPath } from "node:url"
import * as B from "./basic/index.ts"
import { globals } from "./globals.ts"
import * as L from "./lisp/index.ts"
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
    const mod = L.loadEntry(createUrl(file))
    Services.compileLispToPassLog(mod)
  },
  "file:compile-to-basic": ({ args: [file] }) => {
    const mod = L.loadEntry(createUrl(file))
    console.log(B.prettyMod(globals.width, Services.compileLispToBasic(mod)))
  },
  "basic:bundle": ({ args: [file] }) => {
    const mod = B.loadEntry(createUrl(file))
    console.log(B.prettyMod(globals.width, B.bundle(mod)))
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
