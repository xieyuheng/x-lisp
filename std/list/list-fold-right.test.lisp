(import-all "list-fold-right.lisp")

(assert-equal (list-fold-right [1 2 3 4] iadd 0) 10)
(assert-equal
  (list-fold-right
   [1 2 3 4]
   cons
   [])
  [1 2 3 4])
