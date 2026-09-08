#!/usr/bin/env -S node

import * as cli from "@xieyuheng/cli.js"
import * as S from "@xieyuheng/sexp.js"
import { errorReport } from "@xieyuheng/std.js/error"
import { getPackageJson } from "@xieyuheng/std.js/node"
import * as fs from "node:fs"
import { fileURLToPath } from "node:url"
import * as X86 from "./x86/index.ts"

const { version } = getPackageJson(fileURLToPath(import.meta.url))

const router = cli.createRouter("x86-lisp.js", version)

router.defineRoutes(["assemble <input> <output>"])

router.defineHandlers({
  assemble: ({ args: [input, output] }) => {
    const code = fs.readFileSync(input, "utf-8")
    const sexps = S.parseSexps(code, { path: input })
    const stmts = sexps.map((s) => X86.parseStmt(s))
    const program = X86.createProgram()
    X86.BuildPipeline(program, stmts)
    const object = X86.assembleObject(program)
    const buf = X86.emitElfObject(object)
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
