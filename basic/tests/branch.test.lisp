(define (main)
  (block entry
    (= b (eq? 1 2))
    (branch b then else))

  (block then
    (print #t)
    (return))

  (block else
    (print #f)
    (return)))
