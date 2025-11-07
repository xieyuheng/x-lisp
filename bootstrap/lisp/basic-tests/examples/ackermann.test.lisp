(import-all "ackermann")

(define-function main
  (block entry
    (= x (const 3))
    (= y (const 6))
    (= result (call ackermann x y))
    (= expected (const 509))
    (= ok (call equal? result expected))
    (assert ok)
    (return)))
