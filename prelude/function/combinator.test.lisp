(import-all "index")

(assert-equal 1 (identity 1))
(assert-equal 1 ((specific identity int?) 1))

(assert-equal 1 (constant 1 "a"))
(assert-equal 1 ((specific constant int?) 1 "a"))

(assert-equal 2 (drop (iadd 1) "a" 1))
(assert-equal 2 ((specific drop int? int?)
                 (iadd 1) "a" 1))

(define (iadd3 x y z) (iadd (iadd x y) z))
(assert-equal 3 (drop (iadd3 1) "a" 1 1))
(assert-equal 3 ((specific drop int? (-> int? int?))
                 (iadd3 1) "a" 1 1))

(assert-equal 2 (dup iadd 1))
(assert-equal 2 ((specific dup int? int?)
                 iadd 1))

(assert-equal (cons 1 [2 3]) (swap cons [2 3] 1))
(assert-equal (cons 1 [2 3]) ((specific swap int? (list? int?) (list? int?))
                              cons [2 3] 1))
