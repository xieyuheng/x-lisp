import { runCode } from "../load/index.ts"
import { type Mod } from "../mod/index.ts"

export function aboutSortOrder(mod: Mod) {
  runCode(
    mod,
    `\
(export
  sort-order?
  sort-order-before?
  sort-order-same?
  sort-order-after?
  sort-order-reverse
  sort-order-negate)

(define sort-order?
  (union
    sort-order-before?
    sort-order-same?
    sort-order-after?))

(define sort-order-before? (equal? -1))
(define sort-order-same? (equal? 0))
(define sort-order-after? (equal? 1))

(define (sort-order-reverse compare x y)
  (sort-order-negate (compare x y)))

(define sort-order-negate ineg)
`,
  )
}
