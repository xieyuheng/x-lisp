import { runCode } from "../load/index.ts"
import { type Mod } from "../mod/index.ts"

export function builtinOrdering(mod: Mod) {
  runCode(
    mod,
    `\
(export
  ordering?
  ordering-before?
  ordering-same?
  ordering-after?
  ordering-reverse
  ordering-negate)

(define (ordering? x)
  (or
    (ordering-before? x)
    (ordering-same? x)
    (ordering-after? x)))

(define ordering-before? (equal? -1))
(define ordering-same? (equal? 0))
(define ordering-after? (equal? 1))

(define (ordering-reverse compare x y)
  (ordering-negate (compare x y)))

(define ordering-negate ineg)
`,
  )
}
