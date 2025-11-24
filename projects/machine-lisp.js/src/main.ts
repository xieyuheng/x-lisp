#!/usr/bin/env -S node --stack-size=65536

import * as cmd from "@xieyuheng/command.js"
import { errorReport } from "@xieyuheng/helpers.js/error"
import { getPackageJson } from "@xieyuheng/helpers.js/node"
import { createUrl } from "@xieyuheng/helpers.js/url"
import fs from "node:fs"
import { fileURLToPath } from "node:url"
import * as M from "./machine/index.ts"
import * as Services from "./services/index.ts"

const { version } = getPackageJson(fileURLToPath(import.meta.url))

const router = cmd.createRouter("x-lisp-boot", version)

router.defineRoutes(["transpile-to-x86-assembly file", "assemble-x86 file"])

router.defineHandlers({
  "transpile-to-x86-assembly": ({ args: [file] }) => {
    const mod = M.load(createUrl(file))
    const assemblyCode = M.transpileToX86Assembly(mod)
    console.log(assemblyCode)
  },
  "assemble-x86": ({ args: [file] }) => {
    const mod = M.load(createUrl(file))
    const assemblyCode = M.transpileToX86Assembly(mod)
    const assemblyFile = file + ".x86.s"
    fs.writeFileSync(assemblyFile, assemblyCode)
    Services.assembleX86File(assemblyFile)
  },
})

try {
  await router.run(process.argv.slice(2))
} catch (error) {
  console.log(errorReport(error))
  // console.log(error)
  process.exit(1)
}
