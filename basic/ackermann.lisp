;; Compute the Ackermann function recursively.
;; WARNING: Will quickly exceed stack size

(define (main)
  (block entry
    (= x (call ack 3 6))
    (print x)))

(define (ack m n)
  (block entry
    (= zero (const 0))
    (= one (const 1))
    (= cond-m (eq m zero))
    (br cond-m m-zero m-nonzero))
  (block m-zero
    (= tmp (add n one))
    (ret tmp))
  (block m-nonzero
    (= cond-n (eq n zero))
    (br cond-n n-zero n-nonzero))
  (block n-zero
    (= m1 (sub m one))
    (= tmp (call ack m1 one))
    (ret tmp))
  (block n-nonzero
    (= m1 (sub m one))
    (= n1 (sub n one))
    (= t1 (call ack m n1))
    (= t2 (call ack m1 t1))
    (ret t2)))
