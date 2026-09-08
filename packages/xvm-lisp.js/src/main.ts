#!/usr/bin/env -S node

import * as cli from "@xieyuheng/cli.js"
import * as Ppml from "@xieyuheng/ppml.js"
import * as S from "@xieyuheng/sexp.js"
import { errorReport } from "@xieyuheng/std.js/error"
import { getPackageJson } from "@xieyuheng/std.js/node"
import * as fs from "node:fs"
import { fileURLToPath } from "node:url"
import * as Tlv from "./tlv/index.ts"
import * as Xvm from "./xvm/index.ts"

const { version } = getPackageJson(fileURLToPath(import.meta.url))

const router = cli.createRouter("xvm-lisp.js", version)

router.defineRoutes([
  "format <input>",
  "info <input>",
  "assemble <input> <output>",
  "disassemble <input>",
])

router.defineHandlers({
  format: ({ args: [input] }) => {
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

  info: ({ args: [input] }) => {
    const bytes = new Uint8Array(fs.readFileSync(input))
    process.stdout.write(Xvm.formatTlvInfo(bytes))
  },

  assemble: ({ args: [input, output] }) => {
    const code = fs.readFileSync(input, "utf-8")
    const sexps = S.parseSexps(code, { path: input })
    const program = Xvm.parseProgram(sexps)
    const exe = Xvm.assembleProgram(program)
    const tlv = Xvm.encodeExe(exe)
    const buf = Tlv.encodeTlv(tlv)
    fs.writeFileSync(output, buf)
  },

  disassemble: ({ args: [input] }) => {
    const bytes = new Uint8Array(fs.readFileSync(input))
    const tlv = Tlv.decodeTlv(bytes)
    const exe = Xvm.decodeExe(tlv)
    const program = Xvm.disassembleExe(exe)
    const text = Xvm.formatProgram(program)
    process.stdout.write(text)
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
