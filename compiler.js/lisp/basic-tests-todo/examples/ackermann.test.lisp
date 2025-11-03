;; Compute the Ackermann function recursively.
;; WARNING: Will quickly exceed stack size

(define (main)
  (block entry
    (= x (call ack 3 6))
    (= ok (equal? 509 x))
    (assert ok)
    (return)))

(define (ack m n)
  (block entry
    (= zero (const 0))
    (= one (const 1))
    (= cond-m (equal? m zero))
    (branch cond-m m-zero m-nonzero))

  (block m-zero
    (= tmp (iadd n one))
    (return tmp))

  (block m-nonzero
    (= cond-n (equal? n zero))
    (branch cond-n n-zero n-nonzero))

  (block n-zero
    (= m1 (isub m one))
    (= tmp (call ack m1 one))
    (return tmp))

  (block n-nonzero
    (= m1 (isub m one))
    (= n1 (isub n one))
    (= t1 (call ack m n1))
    (= t2 (call ack m1 t1))
    (return t2)))
