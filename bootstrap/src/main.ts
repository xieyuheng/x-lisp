#!/usr/bin/env -S node --stack-size=65536

import { CommandRouter } from "@xieyuheng/command-router.js"
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
  test: "file -- test a x-lisp project (project.json)",
  build: "file -- build a x-lisp project (project.json)",
  clean: "file -- clean a x-lisp project (project.json)",
  "basic:run": "file -- run a basic-lisp file",
  "basic:bundle": "file -- bundle a basic-lisp file",
  "run-via-basic": "file -- run x-lisp code via basic-lisp",
  "compile-to-pass-log": "file -- log passes for snapshot testing",
  "compile-to-basic": "file -- compile x-lisp code to basic-lisp",
}

router.bind(routes, {
  test: async ([file]) => {
    const project = await loadProject(file)
    await project.build()
    await project.test()
  },
  build: async ([file]) => {
    const project = await loadProject(file)
    await project.build()
  },
  clean: async ([file]) => {
    const project = await loadProject(file)
    await project.clean()
  },
  "basic:run": ([file]) => {
    const url = createUrlOrFileUrl(file)
    const dependencies = new Map()
    const mod = B.load(url, dependencies)
    const bundleMod = B.bundle(mod)
    B.run(bundleMod)
  },
  "basic:bundle": ([file]) => {
    const url = createUrlOrFileUrl(file)
    const dependencies = new Map()
    const mod = B.load(url, dependencies)
    const bundleMod = B.bundle(mod)
    console.log(B.prettyMod(globals.maxWidth, bundleMod))
  },
  "run-via-basic": ([file]) => {
    const url = createUrlOrFileUrl(file)
    const dependencies = new Map()
    const mod = L.load(url, dependencies)
    const basicMod = compileToBasic(mod)
    B.run(basicMod)
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
