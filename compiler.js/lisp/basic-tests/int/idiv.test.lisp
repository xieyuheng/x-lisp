(define (main)
  (block entry
    (= v0 (const 9))
    (= v1 (const -20))
    (= res (call idiv v0 v1))
    (= expected (const 0))
    (= ok (call equal? res expected))
    (assert ok)
    (return)))
