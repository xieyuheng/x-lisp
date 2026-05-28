#!/usr/bin/env -S node

import * as cli from "@xieyuheng/cli.js"
import { errorReport } from "@xieyuheng/helpers.js/error"
import { getPackageJson } from "@xieyuheng/helpers.js/node"
import * as S from "@xieyuheng/sexp.js"
import Path from "node:path"
import { fileURLToPath } from "node:url"
import * as M from "./meta/index.ts"

const { version } = getPackageJson(fileURLToPath(import.meta.url))

const router = cli.createRouter("meta-lisp-compile.js", version)

router.defineRoutes([
  "check --config --dump",
  "build --config --dump --basic",
  "test  --config --profile --builtin",
])

router.defineHandlers({
  check: ({ options }) => {
    const configPath =
      options["--config"] || Path.join(process.cwd(), "meta-package.json")
    const pkg = M.loadPackage(configPath)
    const compilerOptions = new Map()
    if ("--dump" in options) compilerOptions.set("dump", "true")
    M.CheckPipeline(pkg, compilerOptions)
  },

  build: ({ options }) => {
    const configPath =
      options["--config"] || Path.join(process.cwd(), "meta-package.json")
    const pkg = M.loadPackage(configPath)
    const compilerOptions = new Map()
    if ("--dump" in options) compilerOptions.set("dump", "true")
    if ("--basic" in options) compilerOptions.set("basic", "true")
    M.BuildPipeline(pkg, compilerOptions)
  },

  test: ({ options }) => {
    const configPath =
      options["--config"] || Path.join(process.cwd(), "meta-package.json")
    const pkg = M.loadPackage(configPath)
    const compilerOptions = new Map()
    if ("--profile" in options) compilerOptions.set("profile", "true")
    if ("--builtin" in options) compilerOptions.set("builtin", "true")
    M.TestPipeline(pkg, compilerOptions)
  },
})

try {
  await router.run(process.argv.slice(2))
} catch (error) {
  if (error instanceof S.ErrorWithSourceLocation) {
    console.log(errorReport(error))
  } else {
    throw error
  }
}
