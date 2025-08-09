(claim my-add (-> int? int? int?))
(define (my-add x y) (iadd x y))

(assert (equal? (my-add 1 1) 2))
(assert (equal? (my-add 1.0 1.0) 2.0))
