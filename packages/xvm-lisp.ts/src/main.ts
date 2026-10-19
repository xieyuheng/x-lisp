#!/usr/bin/env -S node

import * as fs from "node:fs"
import { fileURLToPath } from "node:url"

import * as Cli from "@xieyuheng/cli.ts"
import * as Ppml from "@xieyuheng/ppml.ts"
import * as S from "@xieyuheng/sexp.ts"
import { errorReport } from "@xieyuheng/std.ts/error"
import { getPackageJson } from "@xieyuheng/std.ts/node"

import * as Tlv from "./tlv/index.ts"
import * as Xvm from "./xvm/index.ts"

const { version } = getPackageJson(fileURLToPath(import.meta.url))

const router = Cli.makeRouter("xvm-lisp.ts", version)

router.defineRoutes([
  {
    path: ["format"],
    args: ["input"],
    handler: ({ args: [input] }) => {
      if (input === "-") {
        input = "/dev/stdin"
      }
      const code = fs.readFileSync(input, "utf-8")
      const sexps = S.parseSexps({ path: input }, code)
      const program = Xvm.parseProgram(sexps)
      const text =
        Ppml.formatNode(Xvm.prettyProgram(program), { width: 80 }) + "\n"
      process.stdout.write(text)
    },
  },
  {
    path: ["info"],
    args: ["input"],
    handler: ({ args: [input] }) => {
      const bytes = new Uint8Array(fs.readFileSync(input))
      process.stdout.write(Xvm.formatTlvInfo(bytes))
    },
  },
  {
    path: ["assemble"],
    args: ["input", "output"],
    handler: ({ args: [input, output] }) => {
      const code = fs.readFileSync(input, "utf-8")
      const sexps = S.parseSexps({ path: input }, code)
      const program = Xvm.parseProgram(sexps)
      const exe = Xvm.assembleProgram(program)
      const tlv = Xvm.encodeExe(exe)
      const buf = Tlv.encodeTlv(tlv)
      fs.writeFileSync(output, buf)
    },
  },
  {
    path: ["disassemble"],
    args: ["input"],
    handler: ({ args: [input] }) => {
      const bytes = new Uint8Array(fs.readFileSync(input))
      const tlv = Tlv.decodeTlv(bytes)
      const exe = Xvm.decodeExe(tlv)
      const program = Xvm.disassembleExe(exe)
      const text = Xvm.formatProgram(program)
      process.stdout.write(text)
    },
  },
])

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
