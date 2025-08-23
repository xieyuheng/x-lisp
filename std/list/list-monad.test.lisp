(import-all "list-monad.lisp")

(assert-equal (list-unit 1) [1])

(assert-equal (list-append-map [1 2 3] list-unit) [1 2 3])
(assert-equal ((list-lift list-unit) [1 2 3]) [1 2 3])
(assert-equal (pipe [1 2 3] (list-lift list-unit)) [1 2 3])
