(import "module-one.lisp" one)
(import "module-two.lisp" two)

(assert (equal? one 1))
(assert (equal? two 2))

(import "module-one.lisp" (rename one ione))
(import "module-two.lisp" (rename two itwo))

(assert (equal? ione 1))
(assert (equal? itwo 2))
