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
    const pkg = M.loadPackage("self", configPath)
    if ("--dump" in options) pkg.config.compiler.dump = "true"
    M.validateCompilerOptions(pkg.config.compiler)
    const outcome = M.CheckPipeline(pkg)
    if (outcome === "OutcomeError") process.exit(2)
  },

  build: ({ options }) => {
    const configPath =
      options["--config"] || Path.join(process.cwd(), "meta-package.json")
    const pkg = M.loadPackage("self", configPath)
    if ("--dump" in options) pkg.config.compiler.dump = "true"
    if ("--basic" in options) pkg.config.compiler.basic = "true"
    M.validateCompilerOptions(pkg.config.compiler)
    M.BuildPipeline(pkg)
  },

  test: ({ options }) => {
    const configPath =
      options["--config"] || Path.join(process.cwd(), "meta-package.json")
    const pkg = M.loadPackage("self", configPath)
    if ("--profile" in options) pkg.config.compiler.profile = "true"
    if ("--builtin" in options) pkg.config.compiler.builtin = "true"
    M.validateCompilerOptions(pkg.config.compiler)
    M.TestPipeline(pkg)
  },
})

try {
  await router.run(process.argv.slice(2))
} catch (error) {
  if (error instanceof S.ErrorWithSourceLocation) {
    console.log(errorReport(error))
  } else {
    console.error(error)
  }

  process.exit(1)
}
