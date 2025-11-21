(assert-equal (cond (#t 1) (else 2)) 1)
(assert-equal (cond (#f 1) (else 2)) 2)
