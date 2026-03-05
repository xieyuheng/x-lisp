import * as S from "../lang/index.ts"
import { createRepl, replStart } from "../repl/index.ts"

const repl = createRepl({
  welcome: "Welcome to format-sexp-repl.",
  prompt: "> ",
  onSexps(sexps) {
    for (const sexp of sexps) {
      process.stdout.write(S.formatSexp(sexp))
      process.stdout.write(" ")
    }
    console.log()
  },
  onClose() {
    console.log(`[onClose] bye`)
  },
})

replStart(repl)
