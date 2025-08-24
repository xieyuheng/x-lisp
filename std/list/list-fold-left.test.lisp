(import-all "list-fold-left.lisp")

(assert-equal (list-fold-left [1 2 3 4] iadd 0) 10)
(assert-equal
  (list-fold-left
   [1 2 3 4]
   (lambda (tail head) (cons head tail))
   [])
  [4 3 2 1])
