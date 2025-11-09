#!/usr/bin/env -S node --stack-size=65536

import { CommandRouter } from "@xieyuheng/command-router.js"
import Path from "node:path"
import * as B from "./basic/index.ts"
import { compileToBasic, compileToPassLog } from "./compile/index.ts"
import { globals } from "./globals.ts"
import { errorReport } from "./helpers/error/errorReport.ts"
import { getPackageJson } from "./helpers/node/getPackageJson.ts"
import { createUrlOrFileUrl } from "./helpers/url/createUrlOrFileUrl.ts"
import * as L from "./lang/index.ts"
import { loadProject } from "./project/index.ts"

const { version } = getPackageJson()

const router = new CommandRouter("x-lisp-boot", version)

const routes = {
  test: "--project -- test a project",
  build: "--project -- build a project",
  clean: "--project -- clean a project",
  "basic:run": "file -- run a basic-lisp file",
  "basic:bundle": "file -- bundle a basic-lisp file",
  "compile-to-pass-log": "file -- log passes for snapshot testing",
  "compile-to-basic": "file -- compile x-lisp code to basic-lisp",
}

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
  "basic:run": ([file]) => {
    const url = createUrlOrFileUrl(file)
    const dependencies = new Map()
    const mod = B.load(url, dependencies)
    const bundleMod = B.bundle(mod)
    B.run(bundleMod)
    const output = B.console.consumeOutput()
    process.stdout.write(output)
  },
  "basic:bundle": ([file]) => {
    const url = createUrlOrFileUrl(file)
    const dependencies = new Map()
    const mod = B.load(url, dependencies)
    const bundleMod = B.bundle(mod)
    console.log(B.prettyMod(globals.maxWidth, bundleMod))
  },
  "compile-to-pass-log": ([file]) => {
    const url = createUrlOrFileUrl(file)
    const dependencies = new Map()
    const mod = L.load(url, dependencies)
    compileToPassLog(mod)
  },
  "compile-to-basic": ([file]) => {
    const url = createUrlOrFileUrl(file)
    const dependencies = new Map()
    const mod = L.load(url, dependencies)
    const basicMod = compileToBasic(mod)
    console.log(B.prettyMod(globals.maxWidth, basicMod))
  },
})

try {
  await router.run(process.argv.slice(2))
} catch (error) {
  console.log(errorReport(error))
  process.exit(1)
}
