import { runCode } from "../load/index.ts"
import { type Mod } from "../mod/index.ts"

export function aboutFunction(mod: Mod) {
  runCode(
    mod,
    `\
(define (pipe/fn x fs)
  (cond ((list-empty? fs) x)
        (else (pipe/fn ((car fs) x) (cdr fs)))))
`,
  )
}
