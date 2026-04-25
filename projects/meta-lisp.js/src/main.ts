#!/usr/bin/env -S node

import * as cmd from "@xieyuheng/cmd.js"
import { errorReport } from "@xieyuheng/helpers.js/error"
import { getPackageJson } from "@xieyuheng/helpers.js/node"
import * as S from "@xieyuheng/sexp.js"
import { fileURLToPath } from "node:url"
import * as M from "./meta/index.ts"

const { version } = getPackageJson(fileURLToPath(import.meta.url))

const router = cmd.createRouter("meta-lisp-compile.js", version)

router.defineRoutes([
  "check --config --verbose",
  "build --config --dump --basic",
  "test --config --builtin",
  "clean --config",
])

router.defineHandlers({
  check: ({ options }) => {
    const project = M.loadProject(options["--config"])
    M.projectCheck(project, {
      verbose: options["--verbose"] !== undefined
    })
  },

  build: ({ options }) => {
    const project = M.loadProject(options["--config"])
    M.projectBuild(project, {
      dump: options["--dump"] !== undefined,
      basic: options["--basic"] !== undefined,
    })
  },

  test: ({ options }) => {
    const project = M.loadProject(options["--config"])
    M.projectTest(project, { builtin: options["--builtin"] })
  },

  clean: ({ options }) => {
    const project = M.loadProject(options["--config"])
    M.projectClean(project)
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
