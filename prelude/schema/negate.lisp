(export negate)

(claim negate
  (polymorphic (A)
    (-> (-> A bool?) (-> A bool?))))

(define (negate p x)
  (not (p x)))
