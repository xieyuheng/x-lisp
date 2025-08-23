(import-all "list-take.lisp")

(assert-equal (list-take [1 2 3] 0) [])
(assert-equal (list-take [1 2 3] 1) [1])
(assert-equal (list-take [1 2 3] 2) [1 2])
(assert-equal (list-take [1 2 3] 3) [1 2 3])
(assert-equal (list-take [1 2 3] 4) [1 2 3])
