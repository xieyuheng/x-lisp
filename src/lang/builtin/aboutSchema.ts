import { runCode } from "../load/index.ts"
import { type Mod } from "../mod/index.ts"

export function aboutSchema(mod: Mod) {
  runCode(
    mod,
    `\
(export negate union-fn inter-fn)

(define (negate p x) (not (p x)))

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
