(import-all "list-fold-right.lisp")

(assert-equal (list-fold-right iadd 0 [1 2 3 4]) 10)
(assert-equal (list-fold-right  cons [] [1 2 3 4]) [1 2 3 4])
