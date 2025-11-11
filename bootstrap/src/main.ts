#!/usr/bin/env -S node --stack-size=65536

import * as cmd from "@xieyuheng/command.js"
import Path from "node:path"
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

const routes = [
  "test --project -- test a project",
  "build --project -- build a project",
  "clean --project -- clean a project",
  "lisp:compile-to-pass-log file -- log passes for snapshot testing",
  "lisp:compile-to-basic file -- compile x-lisp code to basic-lisp",
  "basic:run file -- run a basic-lisp file",
  "basic:bundle file -- bundle a basic-lisp file",
  "machine:transpile-to-x86-assembly file -- transpile machine-lisp to x86 assembly",
]

router.bind(routes, {
  test: async (args, options) => {
    const projectFile =
      options["--project"] || Path.join(process.cwd(), "project.json")
    const project = await loadProject(projectFile)
    await project.test()
  },
  build: async (args, options) => {
    const projectFile =
      options["--project"] || Path.join(process.cwd(), "project.json")
    const project = await loadProject(projectFile)
    await project.build()
  },
  clean: async (args, options) => {
    const projectFile =
      options["--project"] || Path.join(process.cwd(), "project.json")
    const project = await loadProject(projectFile)
    await project.clean()
  },
  "lisp:compile-to-pass-log": ([file]) => {
    const mod = L.loadEntry(createUrl(file))
    compileToPassLog(mod)
  },
  "lisp:compile-to-basic": ([file]) => {
    const mod = L.loadEntry(createUrl(file))
    const basicMod = compileToBasic(mod)
    console.log(B.prettyMod(globals.maxWidth, basicMod))
  },
  "basic:run": ([file]) => {
    const mod = B.loadEntry(createUrl(file))
    const bundleMod = B.bundle(mod)
    B.run(bundleMod)
    const output = B.console.consumeOutput()
    process.stdout.write(output)
  },
  "basic:bundle": ([file]) => {
    const mod = B.loadEntry(createUrl(file))
    const bundleMod = B.bundle(mod)
    console.log(B.prettyMod(globals.maxWidth, bundleMod))
  },
  "machine:transpile-to-x86-assembly": ([file]) => {
    const mod = M.load(createUrl(file))
    const assemblyCode = M.transpileToX86Assembly(mod)
    console.log(assemblyCode)
  },
})

try {
  await router.run(process.argv.slice(2))
} catch (error) {
  console.log(errorReport(error))
  process.exit(1)
}
