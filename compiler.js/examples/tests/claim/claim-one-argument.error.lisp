(claim my-add-three (-> int? int? int? int?))
(define (my-add-three x y z) (iadd x (iadd y z)))

(my-add-three 1.0 2 1.0)
