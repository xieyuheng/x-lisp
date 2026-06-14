#!/usr/bin/env -S node

import * as cli from "@xieyuheng/cli.js"
import { errorReport } from "@xieyuheng/helpers.js/error"
import { getPackageJson } from "@xieyuheng/helpers.js/node"
import * as S from "@xieyuheng/sexp.js"
import * as fs from "node:fs"
import Path from "node:path"
import { fileURLToPath } from "node:url"
import * as M from "./meta/index.ts"
import * as X86 from "./x86/index.ts"

const { version } = getPackageJson(fileURLToPath(import.meta.url))

const router = cli.createRouter("meta-lisp.js", version)

router.defineRoutes([
  "check --config --dump",
  "build-xvm --config --dump --basic",
  "build-x86 --config --dump --basic",
  "test-xvm  --config --profile --builtin",
  "test-x86  --config --profile",
  "assemble-x86-flat <input> <output>",
  "assemble-x86-exe <input> <output>",
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

  "build-xvm": ({ options }) => {
    const configPath =
      options["--config"] || Path.join(process.cwd(), "meta-package.json")
    const pkg = M.loadPackage("self", configPath)
    if ("--dump" in options) pkg.config.compiler.dump = "true"
    if ("--basic" in options) pkg.config.compiler.basic = "true"
    M.validateCompilerOptions(pkg.config.compiler)
    M.BuildXvmPipeline(pkg)
  },

  "build-x86": ({ options }) => {
    const configPath =
      options["--config"] || Path.join(process.cwd(), "meta-package.json")
    const pkg = M.loadPackage("self", configPath)
    if ("--dump" in options) pkg.config.compiler.dump = "true"
    if ("--basic" in options) pkg.config.compiler.basic = "true"
    M.validateCompilerOptions(pkg.config.compiler)
    M.BuildX86Pipeline(pkg)
  },

  "test-xvm": ({ options }) => {
    const configPath =
      options["--config"] || Path.join(process.cwd(), "meta-package.json")
    const pkg = M.loadPackage("self", configPath)
    if ("--profile" in options) pkg.config.compiler.profile = "true"
    if ("--builtin" in options) pkg.config.compiler.builtin = "true"
    M.validateCompilerOptions(pkg.config.compiler)
    M.TestXvmPipeline(pkg)
  },

  "test-x86": ({ options }) => {
    const configPath =
      options["--config"] || Path.join(process.cwd(), "meta-package.json")
    const pkg = M.loadPackage("self", configPath)
    if ("--profile" in options) pkg.config.compiler.profile = "true"
    M.validateCompilerOptions(pkg.config.compiler)
    M.TestX86Pipeline(pkg)
  },

  "assemble-x86-flat": ({ args: [input, output] }) => {
    const code = fs.readFileSync(input, "utf-8")
    const sexps = S.parseSexps(code, { path: input })
    const stmts = sexps.map((s) => X86.parseStmt(s))
    const mod = X86.createMod()
    X86.BuildPipeline(mod, stmts)
    const flat = X86.assembleFlat(mod)
    fs.writeFileSync(output, flat)
  },

  "assemble-x86-exe": ({ args: [input, output] }) => {
    const code = fs.readFileSync(input, "utf-8")
    const sexps = S.parseSexps(code, { path: input })
    const stmts = sexps.map((s) => X86.parseStmt(s))
    const mod = X86.createMod()
    X86.BuildPipeline(mod, stmts)
    const exe = X86.assembleExe(mod)
    fs.writeFileSync(output, exe)
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
