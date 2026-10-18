#!/usr/bin/env -S node

import * as Cli from "@xieyuheng/cli.ts"
import * as Ppml from "@xieyuheng/ppml.ts"
import * as S from "@xieyuheng/sexp.ts"
import { errorReport } from "@xieyuheng/std.ts/error"
import { getPackageJson } from "@xieyuheng/std.ts/node"
import * as fs from "node:fs"
import { fileURLToPath } from "node:url"
import * as B from "./basic/index.ts"

const { version } = getPackageJson(fileURLToPath(import.meta.url))

const router = Cli.makeRouter("basic-lisp.ts", version)

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
      const program = B.parseProgram(sexps)
      const text =
        Ppml.formatNode(B.prettyProgram(program), { width: 80 }) + "\n"
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
