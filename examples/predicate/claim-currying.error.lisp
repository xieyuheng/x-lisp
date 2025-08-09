(claim my-mul (-> int? int? int?))
(define my-mul
  (lambda (x)
    (lambda (y)
      (imul x y))))

(assert (equal? (my-mul 2 2) 4))
(assert (equal? (my-mul 2.0 2.0) 4.0))
