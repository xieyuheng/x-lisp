(import "module-one.lisp" one)
(import "module-two.lisp" two)

(assert (equal? one 1))
(assert (equal? two 2))
