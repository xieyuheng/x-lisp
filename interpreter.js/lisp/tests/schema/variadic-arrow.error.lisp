(claim sum (*-> int? int?))

(define sum
  (lambda ns
    (match ns
      ([] 0)
      ([n] n)
      ((cons n tail) (iadd n (apply sum tail))))))

(assert-equal 0 (sum))
(assert-equal 1 (sum 1))
(assert-equal 3 (sum 1 2))
(assert-equal 6 (sum 1 2 3))

;; error

(assert-equal 6 (sum 1 2 3.0))
