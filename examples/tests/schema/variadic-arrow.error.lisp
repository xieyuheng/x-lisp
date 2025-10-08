(claim sum (*-> int? int?))

(define sum
  (lambda ns
    (match ns
      ([] 0)
      ([n] n)
      ((cons n tail) (iadd n (apply sum tail))))))

(assert-equal 6 (sum 1 2 3))

(assert-equal 6 (sum 1 2 3.0))
