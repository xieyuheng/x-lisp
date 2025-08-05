(import one "./module-one.lisp")
(import two "./module-two.lisp")

(assert (equal? one 1))
(assert (equal? two 2))

(import (rename one ione) "./module-one.lisp")
(import (rename two itwo) "./module-two.lisp")

(assert (equal? ione 1))
(assert (equal? itwo 2))
