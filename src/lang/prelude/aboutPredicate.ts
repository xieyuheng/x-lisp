import { definePrimFn } from "../define/index.ts"
import { the } from "../evaluate/index.ts"
import { runCode } from "../load/index.ts"
import { type Mod } from "../mod/index.ts"

export function aboutPredicate(mod: Mod) {
  definePrimFn(mod, "the", 2, the)

  runCode(
    mod,
    `\
(define (negate p x) (not (p x)))

(define (union-fn ps x)
  (cond ((null? ps) #f)
        (((car ps) x) #t)
        (else (union-fn (cdr ps) x))))

(define (inter-fn ps x)
  (cond ((null? ps) #t)
        ((not ((car ps) x)) #f)
        (else (inter-fn (cdr ps) x))))
`,
  )
}
