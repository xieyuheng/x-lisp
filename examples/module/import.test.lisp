(import "one.lisp" one)
(import "two.lisp" two)

(assert (equal? one 1))
(assert (equal? two 2))

(import "one.lisp" (rename one ione))
(import "two.lisp" (rename two itwo))

(assert (equal? ione 1))
(assert (equal? itwo 2))
