(import "module-one.lisp" (rename one ione))
(import "module-two.lisp" (rename two itwo))

(assert-equal ione 1)
(assert-equal itwo 2)
