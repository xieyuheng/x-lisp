(define (main)
  (block entry
    (= v0 (const 9))
    (= v1 (const -20))
    (= res (idiv v0 v1))
    (= ok (equal? res 0))
    (assert ok)
    (return)))
