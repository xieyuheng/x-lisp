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
  "build --config --verbose --dump --basic",
  "test  --config --verbose --profile --builtin",
  "clean --config",
])

router.defineHandlers({
  check: ({ options }) => {
    const project = M.loadProject(options["--config"])
    M.CheckPipeline(project, {
      verbose: options["--verbose"] !== undefined,
    })
  },

  build: ({ options }) => {
    const project = M.loadProject(options["--config"])
    M.BuildPipeline(project, {
      dump: options["--dump"] !== undefined,
      basic: options["--basic"] !== undefined,
      verbose: options["--verbose"] !== undefined,
    })
  },

  test: ({ options }) => {
    const project = M.loadProject(options["--config"])
    M.TestPipeline(project, {
      builtin: options["--builtin"] !== undefined,
      profile: options["--profile"] !== undefined,
      verbose: options["--verbose"] !== undefined,
    })
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
