(define (gcd a b)
  (if (equal? b 0)
    a
    (gcd b (imod a b))))

(define (main)
  (assert-equal 1 (gcd 13 7))
  (assert-equal 4 (gcd 12 8)))
