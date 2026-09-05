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
import * as X86Backend from "./compiler/x86-backend/index.ts"
import * as Xvm2Backend from "./compiler/xvm-backend/index.ts"
import * as M from "./meta/index.ts"
import * as Tlv from "./tlv/index.ts"
import * as X86 from "./x86/index.ts"
import * as Xvm2 from "./xvm/index.ts"

const { version } = getPackageJson(fileURLToPath(import.meta.url))

const router = cli.createRouter("meta-lisp.js", version)

router.defineRoutes([
  "check --config --dump",
  "build-xvm --config --dump",
  "build-x86 --config --dump",
  "test-xvm --config",
  "format-basic <input>",
  "format-xvm <input>",
  "info-xvm <input>",
  "assemble-xvm <input> <output>",
  "disassemble-xvm <input> <output>",
  "assemble-x86 <input> <output>",
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
    Xvm2Backend.BuildPipeline(pkg)
  },

  "build-x86": ({ options }) => {
    const configPath =
      options["--config"] || Path.join(process.cwd(), "meta-package.json")
    const pkg = M.loadPackage("self", configPath)
    if ("--dump" in options) pkg.config.compiler.dump = "true"
    M.validateCompilerOptions(pkg.config.compiler)
    X86Backend.BuildPipeline(pkg)
  },

  "test-xvm": ({ options }) => {
    const configPath =
      options["--config"] || Path.join(process.cwd(), "meta-package.json")
    const pkg = M.loadPackage("self", configPath)
    M.validateCompilerOptions(pkg.config.compiler)
    Xvm2Backend.TestPipeline(pkg)
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

  "format-xvm": ({ args: [input] }) => {
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

  "info-xvm": ({ args: [input] }) => {
    const bytes = new Uint8Array(fs.readFileSync(input))
    process.stdout.write(Xvm2.formatTlvInfo(bytes))
  },

  "assemble-xvm": ({ args: [input, output] }) => {
    const code = fs.readFileSync(input, "utf-8")
    const sexps = S.parseSexps(code, { path: input })
    const program = Xvm2.parseProgram(sexps)
    const exe = Xvm2.assembleProgram(program)
    const tlv = Xvm2.encodeExe(exe)
    const buf = Tlv.encodeTlv(tlv)
    fs.writeFileSync(output, buf)
  },

  "disassemble-xvm": ({ args: [input, output] }) => {
    const bytes = new Uint8Array(fs.readFileSync(input))
    const tlv = Tlv.decodeTlv(bytes)
    const exe = Xvm2.decodeExe(tlv)
    const program = Xvm2.disassembleExe(exe)
    const text = Xvm2.formatProgram(program)
    fs.writeFileSync(output, text)
  },

  "assemble-x86": ({ args: [input, output] }) => {
    const code = fs.readFileSync(input, "utf-8")
    const sexps = S.parseSexps(code, { path: input })
    const stmts = sexps.map((s) => X86.parseStmt(s))
    const program = X86.createProgram()
    X86.BuildPipeline(program, stmts)
    const exe = X86.assembleExe(program)
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
