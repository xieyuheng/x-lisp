(define (main)
  (block entry
    (= x (call sum-of-cubes 6))
    (= ok (equal? 441 x))
    (assert ok)
    (return)))

(define (sum-of-cubes n)
  (block entry
    (= v0 (const 1))
    (= v1 (const 2))
    (= v2 (identity n))
    (= v3 (iadd v0 v2)) ; n + 1
    (= v4 (imul v2 v3)) ; n(n+1)
    (= v5 (idiv v4 v1)) ; n(n+1)/2
    (= v6 (imul v5 v5)) ; (n(n+1)/2)^2
    (return v6)))
