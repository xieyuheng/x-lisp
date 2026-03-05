(claim main (-> void-t))

(define (main)
  (assert-equal
    1
    (cond
     ((equal? 1 1) 1)
     (else 2)))
  (assert-equal
    2
    (cond
     ((equal? 1 2) 1)
     (else 2)))

  (cond
   ((equal? 1 1) (assert true))
   (else (assert false)))
  (cond
   ((equal? 1 2) (assert false))
   (else (assert true))))
