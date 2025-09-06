import { definePrimitiveFunction, provide } from "../define/index.ts"
import { validateOrFail } from "../evaluate/index.ts"
import { runCode } from "../load/index.ts"
import { type Mod } from "../mod/index.ts"

export function aboutPredicate(mod: Mod) {
  provide(mod, ["the"])

  definePrimitiveFunction(mod, "the", 2, validateOrFail)

  runCode(
    mod,
    `\
(export negate union/fn inter/fn)

(define (negate p x) (not (p x)))

(define (union/fn ps x)
  (cond ((list-empty? ps) #f)
        (((car ps) x) #t)
        (else (union/fn (cdr ps) x))))

(define (inter/fn ps x)
  (cond ((list-empty? ps) #t)
        ((not ((car ps) x)) #f)
        (else (inter/fn (cdr ps) x))))
`,
  )
}
