import * as cmd from "@xieyuheng/command.js"
import fs from "node:fs"
import * as B from "./basic/index.ts"
import { compileToBasic, compileToPassLog } from "./compile/index.ts"
import { globals } from "./globals.ts"
import { errorReport } from "./helpers/error/errorReport.ts"
import { getPackageJson } from "./helpers/node/getPackageJson.ts"
import { systemShellRun } from "./helpers/system/systemShellRun.ts"
import { createUrl } from "./helpers/url/createUrl.ts"
import * as L from "./lang/index.ts"
import * as M from "./machine/index.ts"
import { loadProject } from "./project/index.ts"

const { version } = getPackageJson()

const router = cmd.createRouter("x-lisp-boot", version)

router.defineRoutes([
  "test --project",
  "build --project",
  "clean --project",
  "lisp:compile-to-pass-log file",
  "lisp:compile-to-basic file",
  "basic:run file",
  "basic:bundle file",
  "machine:transpile-to-x86-assembly file",
  "machine:assemble-x86 file",
])

router.defineHandlers({
  test: async (args, options) => {
    const project = await loadProject(options["--project"])
    await project.test()
  },
  build: async (args, options) => {
    const project = await loadProject(options["--project"])
    await project.build()
  },
  clean: async (args, options) => {
    const project = await loadProject(options["--project"])
    await project.clean()
  },
  "lisp:compile-to-pass-log": ([file]) => {
    const mod = L.loadEntry(createUrl(file))
    compileToPassLog(mod)
  },
  "lisp:compile-to-basic": ([file]) => {
    const mod = L.loadEntry(createUrl(file))
    console.log(B.prettyMod(globals.maxWidth, compileToBasic(mod)))
  },
  "basic:run": ([file]) => {
    const mod = B.loadEntry(createUrl(file))
    B.run(B.bundle(mod))
    process.stdout.write(B.console.consumeOutput())
  },
  "basic:bundle": ([file]) => {
    const mod = B.loadEntry(createUrl(file))
    console.log(B.prettyMod(globals.maxWidth, B.bundle(mod)))
  },
  "machine:transpile-to-x86-assembly": ([file]) => {
    const mod = M.load(createUrl(file))
    const assembleCode = M.transpileToX86Assembly(mod)
    console.log(assembleCode)
  },
  "machine:assemble-x86": ([file]) => {
    const mod = M.load(createUrl(file))
    const assembleCode = M.transpileToX86Assembly(mod)
    fs.writeFileSync(file + ".x86.s", assembleCode)

    {
      const result = systemShellRun("as", [
        file + ".x86.s",
        "-o",
        file + ".x86.o",
      ])
      if (result.stdout) console.log(result.stdout)
      if (result.stderr) console.error(result.stderr)
      if (result.status !== 0) process.exit(result.status)
    }

    {
      const result = systemShellRun("ld", [
        file + ".x86.o",
        "-o",
        file + ".x86",
      ])
      if (result.stdout) console.log(result.stdout)
      if (result.stderr) console.error(result.stderr)
      if (result.status !== 0) process.exit(result.status)
    }
  },
})

try {
  await router.run(process.argv.slice(2))
} catch (error) {
  console.log(errorReport(error))
  process.exit(1)
}
