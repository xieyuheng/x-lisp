(import-all "list-fold-right")

(assert-equal 10 (list-fold-right iadd 0 [1 2 3 4]))
(assert-equal [1 2 3 4] (list-fold-right cons [] [1 2 3 4]))
(assert-equal [1 2 3 4] ((specific list-fold-right int? (list? int?))
                         cons [] [1 2 3 4]))
