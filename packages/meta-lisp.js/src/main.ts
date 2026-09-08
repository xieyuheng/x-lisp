#!/usr/bin/env -S node

import * as cli from "@xieyuheng/cli.js"
import * as S from "@xieyuheng/sexp.js"
import { errorReport } from "@xieyuheng/std.js/error"
import { getPackageJson } from "@xieyuheng/std.js/node"
import Path from "node:path"
import { fileURLToPath } from "node:url"
import * as XvmBackend from "./xvm-backend/index.ts"
import * as M from "./meta/index.ts"

const { version } = getPackageJson(fileURLToPath(import.meta.url))

const router = cli.createRouter("meta-lisp.js", version)

router.defineRoutes(["check --config --dump", "build --config --dump"])

router.defineHandlers({
  check: ({ options }) => {
    const configPath =
      options["--config"] || Path.join(process.cwd(), "meta-package.json")
    const pkg = M.loadPackage("self", configPath)
    if ("--dump" in options) pkg.config.compiler.dump = "true"
    M.validateCompilerOptions(pkg.config.compiler)

    const closure = M.packageClosureInTopologicalOrder(pkg)
    let outcome: M.Outcome = "OutcomeOk"

    for (const current of closure) {
      if (M.CheckPipeline(current) === "OutcomeError") {
        outcome = "OutcomeError"
      }
    }

    if (outcome === "OutcomeError") process.exit(2)
  },

  build: ({ options }) => {
    const configPath =
      options["--config"] || Path.join(process.cwd(), "meta-package.json")
    const pkg = M.loadPackage("self", configPath)
    if ("--dump" in options) pkg.config.compiler.dump = "true"
    M.validateCompilerOptions(pkg.config.compiler)

    const closure = M.packageClosureInTopologicalOrder(pkg)
    let outcome: M.Outcome = "OutcomeOk"

    for (const current of closure) {
      if (M.CheckPipeline(current) === "OutcomeError") {
        outcome = "OutcomeError"
      }
    }

    if (outcome === "OutcomeError") process.exit(2)

    for (const current of closure) {
      M.CorePipeline(current)
    }

    XvmBackend.BuildPipeline(pkg)
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
