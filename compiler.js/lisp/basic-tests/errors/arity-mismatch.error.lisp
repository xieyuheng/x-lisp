(define-function (main)
  (block entry
    (= one (const 1))
    (= x (call iadd one))
    (call print x)
    (return)))
