;; Compute the Ackermann function recursively.
;; WARNING: Will quickly exceed stack size

(export ackermann)

(define-function ackermann
  (block entry
    (= m (argument 0))
    (= n (argument 1))
    (= zero (const 0))
    (= one (const 1))
    (= cond-m (call equal? m zero))
    (branch cond-m m-zero m-nonzero))

  (block m-zero
    (= tmp (call iadd n one))
    (return tmp))

  (block m-nonzero
    (= cond-n (call equal? n zero))
    (branch cond-n n-zero n-nonzero))

  (block n-zero
    (= m1 (call isub m one))
    (= tmp (call ackermann m1 one))
    (return tmp))

  (block n-nonzero
    (= m1 (call isub m one))
    (= n1 (call isub n one))
    (= t1 (call ackermann m n1))
    (= t2 (call ackermann m1 t1))
    (return t2)))
