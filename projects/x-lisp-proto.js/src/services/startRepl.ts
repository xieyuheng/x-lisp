import { errorReport } from "@xieyuheng/helpers.js/error"
import { getPackageJson } from "@xieyuheng/helpers.js/node"
import * as S from "@xieyuheng/x-sexp.js"
import { fileURLToPath } from "node:url"
import { load, runSexps } from "../lang/load/index.ts"

export function startRepl(): void {
  const { version } = getPackageJson(fileURLToPath(import.meta.url))

  const url = new URL("repl:")
  const mod = load(url)
  const repl = S.createRepl({
    welcome: `Welcome to x-lisp-proto ${version}`,
    prompt: ">> ",
    onSexps: (sexps) => {
      try {
        runSexps(mod, sexps, { resultPrompt: "=> " })
      } catch (error) {
        console.log(errorReport(error))
      }
    },
  })

  S.replStart(repl)
}
