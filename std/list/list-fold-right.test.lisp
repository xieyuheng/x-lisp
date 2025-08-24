(import-all "list-fold-right.lisp")

(assert-equal (list-fold-right [1 2 3 4] iadd 0) 10)
