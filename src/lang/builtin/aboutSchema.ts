import { runCode } from "../load/index.ts"
import { type Mod } from "../mod/index.ts"

export function aboutSchema(mod: Mod) {
  runCode(
    mod,
    `\
(export union-fn inter-fn)

(define (union-fn ps x)
  (cond ((list-empty? ps) #f)
        (((car ps) x) #t)
        (else (union-fn (cdr ps) x))))

(define (inter-fn ps x)
  (cond ((list-empty? ps) #t)
        ((not ((car ps) x)) #f)
        (else (inter-fn (cdr ps) x))))
`,
  )
}
