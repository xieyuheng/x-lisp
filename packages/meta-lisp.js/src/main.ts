#!/usr/bin/env -S node

import * as cli from "@xieyuheng/cli.js"
import * as Ppml from "@xieyuheng/ppml.js"
import * as S from "@xieyuheng/sexp.js"
import { errorReport } from "@xieyuheng/std.js/error"
import { getPackageJson } from "@xieyuheng/std.js/node"
import * as fs from "node:fs"
import Path from "node:path"
import { fileURLToPath } from "node:url"
import * as B from "./basic/index.ts"
import * as X86Backend from "./compiler/x86-backend/index.ts"
import * as XvmBackend from "./compiler/xvm-backend/index.ts"
import * as M from "./meta/index.ts"
import * as Tlv from "./tlv/index.ts"
import * as X86 from "./x86/index.ts"
import * as Xvm from "./xvm/index.ts"

const { version } = getPackageJson(fileURLToPath(import.meta.url))

const router = cli.createRouter("meta-lisp.js", version)

router.defineRoutes([
  "check --config --dump",
  "build --config --dump",
  "basic:format <input>",
  "xvm:format <input>",
  "xvm:info <input>",
  "xvm:assemble <input> <output>",
  "xvm:disassemble <input>",
  "x86:assemble <input> <output>",
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
    M.validateCompilerOptions(pkg.config.compiler)
    M.CorePipeline(pkg)
    XvmBackend.BuildPipeline(pkg)
    X86Backend.BuildPipeline(pkg)
  },

  "basic:format": ({ args: [input] }) => {
    if (input === "-") {
      input = "/dev/stdin"
    }
    const code = fs.readFileSync(input, "utf-8")
    const sexps = S.parseSexps(code, { path: input })
    const program = B.parseProgram(sexps)
    const text =
      Ppml.formatNode(B.prettyProgram(program), { width: 80 }) + "\n"
    process.stdout.write(text)
  },

  "xvm:format": ({ args: [input] }) => {
    if (input === "-") {
      input = "/dev/stdin"
    }
    const code = fs.readFileSync(input, "utf-8")
    const sexps = S.parseSexps(code, { path: input })
    const program = Xvm.parseProgram(sexps)
    const text =
      Ppml.formatNode(Xvm.prettyProgram(program), { width: 80 }) + "\n"
    process.stdout.write(text)
  },

  "xvm:info": ({ args: [input] }) => {
    const bytes = new Uint8Array(fs.readFileSync(input))
    process.stdout.write(Xvm.formatTlvInfo(bytes))
  },

  "xvm:assemble": ({ args: [input, output] }) => {
    const code = fs.readFileSync(input, "utf-8")
    const sexps = S.parseSexps(code, { path: input })
    const program = Xvm.parseProgram(sexps)
    const exe = Xvm.assembleProgram(program)
    const tlv = Xvm.encodeExe(exe)
    const buf = Tlv.encodeTlv(tlv)
    fs.writeFileSync(output, buf)
  },

  "xvm:disassemble": ({ args: [input] }) => {
    const bytes = new Uint8Array(fs.readFileSync(input))
    const tlv = Tlv.decodeTlv(bytes)
    const exe = Xvm.decodeExe(tlv)
    const program = Xvm.disassembleExe(exe)
    const text = Xvm.formatProgram(program)
    process.stdout.write(text)
  },

  "x86:assemble": ({ args: [input, output] }) => {
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
