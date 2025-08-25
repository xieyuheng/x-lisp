(import-all "../function/index.lisp")
(import-all "list-fold-left.lisp")

(assert-equal (list-fold-left iadd 0 [1 2 3 4]) 10)
(assert-equal (list-fold-left (swap cons) [] [1 2 3 4]) [4 3 2 1])
