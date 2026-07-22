#!/usr/bin/env -S node

import * as cli from "@xieyuheng/cli.js"
import * as Ppml from "@xieyuheng/ppml.js"
import * as S from "@xieyuheng/sexp.js"
import { errorReport } from "@xieyuheng/std.js/error"
import { getPackageJson } from "@xieyuheng/std.js/node"
import * as fs from "node:fs"
import Path from "node:path"
import { fileURLToPath } from "node:url"
import * as B2 from "./basic2/index.ts"
import * as Pkg from "./package/index.ts"
import * as Pipelines from "./pipelines/index.ts"
import * as X86 from "./x86/index.ts"

const { version } = getPackageJson(fileURLToPath(import.meta.url))

const router = cli.createRouter("meta-lisp.js", version)

router.defineRoutes([
  "check --config --dump",
  "build-xvm --config --dump",
  "build-x86 --config --dump",
  "test-xvm  --config --profile --builtin",
  "format-basic2 <input>",
  "assemble-x86-xexe <input> <output> --entry",
])

router.defineHandlers({
  check: ({ options }) => {
    const configPath =
      options["--config"] || Path.join(process.cwd(), "meta-package.json")
    const pkg = Pkg.loadPackage("self", configPath)
    if ("--dump" in options) pkg.config.compiler.dump = "true"
    Pkg.validateCompilerOptions(pkg.config.compiler)
    const outcome = Pipelines.CheckPipeline(pkg)
    if (outcome === "OutcomeError") process.exit(2)
  },

  "build-xvm": ({ options }) => {
    const configPath =
      options["--config"] || Path.join(process.cwd(), "meta-package.json")
    const pkg = Pkg.loadPackage("self", configPath)
    if ("--dump" in options) pkg.config.compiler.dump = "true"
    Pkg.validateCompilerOptions(pkg.config.compiler)
    Pipelines.BuildXvmPipeline(pkg)
  },

  "build-x86": ({ options }) => {
    const configPath =
      options["--config"] || Path.join(process.cwd(), "meta-package.json")
    const pkg = Pkg.loadPackage("self", configPath)
    if ("--dump" in options) pkg.config.compiler.dump = "true"
    Pkg.validateCompilerOptions(pkg.config.compiler)
    Pipelines.BuildX86Pipeline(pkg)
  },

  "test-xvm": ({ options }) => {
    const configPath =
      options["--config"] || Path.join(process.cwd(), "meta-package.json")
    const pkg = Pkg.loadPackage("self", configPath)
    if ("--profile" in options) pkg.config.compiler.profile = "true"
    if ("--builtin" in options) pkg.config.compiler.builtin = "true"
    Pkg.validateCompilerOptions(pkg.config.compiler)
    Pipelines.TestXvmPipeline(pkg)
  },

  "format-basic2": ({ args: [input] }) => {
    if (input === "-") {
      input = "/dev/stdin"
    }
    const code = fs.readFileSync(input, "utf-8")
    const sexps = S.parseSexps(code, { path: input })
    const mod = B2.parseMod(sexps)
    const text = Ppml.formatNode(B2.prettyMod(mod), { width: 80 }) + "\n"
    process.stdout.write(text)
  },

  "assemble-x86-xexe": ({ args: [input, output], options }) => {
    const entryName = options["--entry"]
    const code = fs.readFileSync(input, "utf-8")
    const sexps = S.parseSexps(code, { path: input })
    const stmts = sexps.map((s) => X86.parseStmt(s))
    const mod = X86.createMod()
    X86.BuildPipeline(mod, stmts)
    const xexe = X86.assembleXexe(mod, entryName)
    const buf = X86.emitXexe(xexe)
    fs.writeFileSync(output, buf)
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
