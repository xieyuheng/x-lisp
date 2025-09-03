import { runCode } from "../load/index.ts"
import { type Mod } from "../mod/index.ts"

export function aboutFunction(mod: Mod) {
  runCode(
    mod,
    `\
(export pipe/fn compose/fn)

(define (pipe/fn x fs)
  (cond ((list-empty? fs) x)
        (else (pipe/fn ((list-head fs) x) (list-tail fs)))))

(define (compose/fn fs x)
  (cond ((list-empty? fs) x)
        (else (compose/fn (list-init fs) ((list-last fs) x)))))
`,
  )
}
