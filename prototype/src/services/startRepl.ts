import * as S from "@xieyuheng/x-sexp.js"
import { errorReport } from "../helpers/error/errorReport.ts"
import { getPackageJson } from "../helpers/node/getPackageJson.ts"
import { load, runSexps } from "../lang/load/index.ts"

export function startRepl(): void {
  const { version } = getPackageJson()

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
