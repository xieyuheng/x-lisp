(import-all "index")

(assert-equal 1 (identity 1))
(assert-equal 1 ((specific identity int?) 1))

(assert-equal 1 (constant 1 "a"))
(assert-equal 1 ((specific constant int?) 1 "a"))

(assert-equal (cons 1 [2 3]) (swap cons [2 3] 1))
(assert-equal (cons 1 [2 3]) ((specific swap int? (list? int?) (list? int?))
                              cons [2 3] 1))
