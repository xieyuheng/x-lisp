(import-all "../function")
(import-all "list-fold-left")

(assert-equal 10 (list-fold-left iadd 0 [1 2 3 4]))
(assert-equal [4 3 2 1] (list-fold-left (swap cons) [] [1 2 3 4]))
(assert-equal [4 3 2 1] ((specific list-fold-left int? (list? int?))
                         (swap cons) [] [1 2 3 4]))
