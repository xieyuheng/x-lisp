(define-type bool-t [#atom #bool])
(define-type int-t [#atom #int])
(define-type float-t [#atom #float])

;; bool

(claim not (-> bool-t bool-t))

;; int

(claim int-positive? (-> int-t bool-t))
(claim int-non-negative? (-> int-t bool-t))
(claim int-non-zero? (-> int-t bool-t))
(claim ineg (-> int-t int-t))
(claim iadd (-> int-t int-t int-t))
(claim isub (-> int-t int-t int-t))
(claim imul (-> int-t int-t int-t))
(claim idiv (-> int-t int-t int-t))
(claim imod (-> int-t int-t int-t))
(claim int-max (-> int-t int-t int-t))
(claim int-min (-> int-t int-t int-t))
(claim int-greater? (-> int-t int-t bool-t))
(claim int-less? (-> int-t int-t bool-t))
(claim int-greater-or-equal? (-> int-t int-t bool-t))
(claim int-less-or-equal? (-> int-t int-t bool-t))

;; float

(claim fneg (-> float-t float-t))
(claim fadd (-> float-t float-t float-t))
(claim fsub (-> float-t float-t float-t))
(claim fmul (-> float-t float-t float-t))
(claim fdiv (-> float-t float-t float-t))
(claim fmod (-> float-t float-t float-t))
(claim float-max (-> float-t float-t float-t))
(claim float-min (-> float-t float-t float-t))
(claim float-greater? (-> float-t float-t bool-t))
(claim float-less? (-> float-t float-t bool-t))
(claim float-greater-or-equal? (-> float-t float-t bool-t))
(claim float-small-or-equal? (-> float-t float-t bool-t))
