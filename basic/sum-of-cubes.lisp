;; ARGS: 6

(define (main n)
  (block entry
    (= v0 (const 1))
    (= v1 (const 2))
    (= v2 (identity n))
    (= v3 (add v0 v2)) ; n + 1
    (= v4 (mul v2 v3)) ; n(n+1)
    (= v5 (div v4 v1)) ; n(n+1)/2
    (= v6 (mul v5 v5)) ; (n(n+1)/2)^2
    (print v6)))
