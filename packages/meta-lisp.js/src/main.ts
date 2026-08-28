#!/usr/bin/env -S node

import * as cli from "@xieyuheng/cli.js"
import * as Ppml from "@xieyuheng/ppml.js"
import * as S from "@xieyuheng/sexp.js"
import { errorReport } from "@xieyuheng/std.js/error"
import { getPackageJson } from "@xieyuheng/std.js/node"
import * as fs from "node:fs"
import Path from "node:path"
import { fileURLToPath } from "node:url"
import * as B2 from "./basic/index.ts"
import * as Compiler from "./compiler/index.ts"
import * as M from "./meta/index.ts"
import * as X86 from "./x86/index.ts"
import * as Xvm2 from "./xvm2/index.ts"

const { version } = getPackageJson(fileURLToPath(import.meta.url))

const router = cli.createRouter("meta-lisp.js", version)

router.defineRoutes([
  "check --config --dump",
  "build-xvm --config --dump",
  "build-xvm2 --config --dump --entry",
  "build-x86 --config --dump --entry",
  "test-xvm  --config --profile --builtin",
  "test-xvm2 --config --profile --builtin",
  "format-basic <input>",
  "format-xvm2 <input>",
  "assemble-x86 <input> <output> --entry",
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
    M.validateCompilerOptions(pkg.config.compiler)
    Compiler.BuildXvmPipeline(pkg)
  },

  "build-xvm2": ({ options }) => {
    const configPath =
      options["--config"] || Path.join(process.cwd(), "meta-package.json")
    const pkg = M.loadPackage("self", configPath)
    if ("--dump" in options) pkg.config.compiler.dump = "true"
    M.validateCompilerOptions(pkg.config.compiler)
    Compiler.BuildXvm2Pipeline(pkg, options["--entry"])
  },

  "build-x86": ({ options }) => {
    const configPath =
      options["--config"] || Path.join(process.cwd(), "meta-package.json")
    const pkg = M.loadPackage("self", configPath)
    if ("--dump" in options) pkg.config.compiler.dump = "true"
    M.validateCompilerOptions(pkg.config.compiler)
    Compiler.BuildX86Pipeline(pkg, options["--entry"])
  },

  "test-xvm": ({ options }) => {
    const configPath =
      options["--config"] || Path.join(process.cwd(), "meta-package.json")
    const pkg = M.loadPackage("self", configPath)
    if ("--profile" in options) pkg.config.compiler.profile = "true"
    if ("--builtin" in options) pkg.config.compiler.builtin = "true"
    M.validateCompilerOptions(pkg.config.compiler)
    Compiler.TestXvmPipeline(pkg)
  },

  "test-xvm2": ({ options }) => {
    // TODO: 实现 xvm2 的测试管线（加载 bundle.xvm2.exe 并运行 ©run-tests）
  },

  "format-basic": ({ args: [input] }) => {
    if (input === "-") {
      input = "/dev/stdin"
    }
    const code = fs.readFileSync(input, "utf-8")
    const sexps = S.parseSexps(code, { path: input })
    const program = B2.parseProgram(sexps)
    const text =
      Ppml.formatNode(B2.prettyProgram(program), { width: 80 }) + "\n"
    process.stdout.write(text)
  },

  "format-xvm2": ({ args: [input] }) => {
    if (input === "-") {
      input = "/dev/stdin"
    }
    const code = fs.readFileSync(input, "utf-8")
    const sexps = S.parseSexps(code, { path: input })
    const program = Xvm2.parseProgram(sexps)
    const text =
      Ppml.formatNode(Xvm2.prettyProgram(program), { width: 80 }) + "\n"
    process.stdout.write(text)
  },

  "assemble-x86": ({ args: [input, output], options }) => {
    const entryName = options["--entry"]
    const code = fs.readFileSync(input, "utf-8")
    const sexps = S.parseSexps(code, { path: input })
    const stmts = sexps.map((s) => X86.parseStmt(s))
    const program = X86.createProgram()
    X86.BuildPipeline(program, stmts)
    const exe = X86.assembleExe(program, entryName)
    const buf = X86.emitExe(exe)
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
