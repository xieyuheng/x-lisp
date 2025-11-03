(define (main)
  (block entry
    (= x (call zero? 1))
    (= x.1 (not x))
    (assert x.1)
    (= y (call zero? 0))
    (assert y)
    (return)))

(define (zero? x)
  (block entry
    (= b (equal? x 0))
    (branch b then else))

  (block then
    (return #t))

  (block else
    (return #f)))
