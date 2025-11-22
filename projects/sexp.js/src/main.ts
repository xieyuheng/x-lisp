import * as Cmd from "@xieyuheng/command.js"
import { errorReport } from "@xieyuheng/helpers.js/error"
import { getPackageJson } from "@xieyuheng/helpers.js/node"
import fs from "node:fs"
import { fileURLToPath } from "node:url"
import * as S from "./index.ts"

const { version } = getPackageJson(fileURLToPath(import.meta.url))

const router = Cmd.createRouter("sexp.js", version)

router.defineRoutes(["format file -- format a file"])

router.defineHandlers({
  format: ({ args: [file] }) => {
    const text = fs.readFileSync(file, "utf8")
    const sexps = S.parseSexps(text)
    for (const sexp of sexps) {
      console.log(S.prettySexp(60, sexp))
      console.log()
    }
  },
})

try {
  await router.run(process.argv.slice(2))
} catch (error) {
  console.log(errorReport(error))
  process.exit(1)
}
