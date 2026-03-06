(claim identity
  (polymorphic (A)
    (-> A A)))

(define (identity x) x)

(claim main (-> void-t))

(define (main)
  (= add1 (iadd 1))
  (assert-equal 2 (add1 1))
  (= add1 (identity (iadd (identity 1))))
  (assert-equal 2 (add1 1)))
