#!/usr/bin/env -S node --stack-size=65536

import { CommandRouter } from "@xieyuheng/command-router.js"
import * as B from "./basic/index.ts"
import { compilePasses, compileToBasic } from "./compile/index.ts"
import { errorReport } from "./helpers/error/errorReport.ts"
import { createUrlOrFileUrl } from "./helpers/url/createUrlOrFileUrl.ts"
import * as L from "./lang/index.ts"
import { loadProject } from "./project/index.ts"

const router = new CommandRouter("x-lisp-boot", "")

const routes = {
  build: "file -- build a x-lisp project",
  "basic:run": "file -- run a basic-lisp file",
  "basic:bundle": "file -- bundle a basic-lisp file",
  "run-via-basic": "file -- run x-lisp code via basic-lisp",
  "compile-passes": "file -- output all compiler passes for snapshot testing",
  "compile-to-basic": "file -- compile x-lisp code to basic-lisp",
}

// const routes = [
//   "build file -- build a x-lisp project",
//   "basic:run file -- run a basic-lisp file",
//   "basic:bundle file -- bundle a basic-lisp file",
//   "run-via-basic file -- run x-lisp code via basic-lisp",
//   "compile-passes file -- output all compiler passes for snapshot testing",
//   "compile-to-basic file -- compile x-lisp code to basic-lisp",
// ]

router.bind(routes, {
  build: async ([file]) => {
    try {
      const ProjectConfig = await loadProject(file)
      console.log(ProjectConfig)
    } catch (error) {
      console.log(errorReport(error))
      process.exit(1)
    }
  },

  "basic:run": ([file]) => {
    try {
      const url = createUrlOrFileUrl(file)
      const dependencies = new Map()
      const mod = B.bundle(B.load(url, dependencies))
      const context = B.createContext(mod)
      B.call(context, "main", [])
    } catch (error) {
      console.log(errorReport(error))
      process.exit(1)
    }
  },

  "basic:bundle":  ([file]) => {
    try {
      const url = createUrlOrFileUrl(file)
      const dependencies = new Map()
      const mod = B.bundle(B.load(url, dependencies))
      console.log(B.prettyMod(60, mod))
    } catch (error) {
      console.log(errorReport(error))
      process.exit(1)
    }
  },

  "run-via-basic":  ([file]) => {
    try {
      const url = createUrlOrFileUrl(file)
      const dependencies = new Map()
      const mod = L.load(url, dependencies)
      const basicMod = compileToBasic(mod)
      const context = B.createContext(basicMod)
      B.call(context, "main", [])
    } catch (error) {
      console.log(error)
      console.log(errorReport(error))
      process.exit(1)
    }
  },

  "compile-passes":  ([file]) => {
    try {
      const url = createUrlOrFileUrl(file)
      const dependencies = new Map()
      const mod = L.load(url, dependencies)
      compilePasses(mod)
    } catch (error) {
      console.log(errorReport(error))
      process.exit(1)
    }
  },

  "compile-to-basic":  ([file]) => {
    try {
      const url = createUrlOrFileUrl(file)
      const dependencies = new Map()
      const mod = L.load(url, dependencies)
      const basicMod = compileToBasic(mod)
      console.log(B.prettyMod(60, basicMod))
    } catch (error) {
      console.log(errorReport(error))
      process.exit(1)
    }
  },
})

await router.run(process.argv.slice(2))
