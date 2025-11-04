(define (main)
  (block entry
    (= one (const 1))
    (= zero (const 0))
    (= x (call zero? one))
    (= x.1 (call not x))
    (assert x.1)
    (= y (call zero? zero))
    (assert y)
    (return)))

(define (zero? x)
  (block entry
    (= zero (const 0))
    (= b (call equal? x zero))
    (branch b then else))

  (block then
    (= true (const #t))
    (return true))

  (block else
    (= false (const #f))
    (return false)))
