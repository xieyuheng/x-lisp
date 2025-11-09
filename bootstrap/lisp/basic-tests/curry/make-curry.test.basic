(define-function main
  (block entry
    (= zero (const 0))
    (= one (const 1))
    (= two (const 2))
    (= iadd-fn (const (@function iadd 2)))
    (= iadd1 (call make-curry iadd-fn one one))
    (call curry-put! zero one iadd1)
    (= x (const 5))
    (= result (apply iadd1 x))
    (= expected (const 6))
    (= ok (call equal? result expected))
    (assert ok)
    (return)))
