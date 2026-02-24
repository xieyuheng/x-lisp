(define-type bool-t [#atom #bool])
(define-type int-t [#atom #int])
(define-type float-t [#atom #float])
(define-type string-t [#atom #string])
(define-type symbol-t [#atom #symbol])
(define-type hashtag-t [#atom #hashtag])
(define-type void-t [#atom #void])
(define-type null-t [#atom #null])
(define-type any-t [#any])

;; value

(claim any? (-> any-t bool-t))
(claim same? (-> any-t any-t bool-t))
(claim equal? (-> any-t any-t bool-t))
(claim hash-code (-> any-t int-t))
(claim total-compare (-> any-t any-t int-t))

;; assert

(claim assert (-> bool-t void-t))
(claim assert-not (-> bool-t void-t))
(claim assert-equal (-> any-t any-t void-t))
(claim assert-not-equal (-> any-t any-t void-t))

;; console

(claim print (-> any-t void-t))
(claim println (-> any-t void-t))
(claim write (-> string-t void-t))
(claim newline (-> void-t))

;; bool

(claim true bool-t)
(claim false bool-t)
(claim bool? (-> any-t bool-t))
(claim not (-> bool-t bool-t))

;; null

(claim null null-t)
(claim null? (-> any-t bool-t))

;; void

(claim void void-t)
(claim void? (-> any-t bool-t))

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

;; random

(claim random-int (-> int-t int-t int-t))
(claim random-float (-> float-t float-t float-t))
(claim random-dice (-> int-t))
