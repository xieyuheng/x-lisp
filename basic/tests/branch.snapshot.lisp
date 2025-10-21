(define (main)
  (block entry
    (= x (call zero? 1))
    (print x)
    (= y (call zero? 0))
    (print y)
    (return)))

(define (zero? x)
  (block entry
    (= b (eq? x 0))
    (branch b then else))

  (block then
    (return #t))

  (block else
    (return #f)))
