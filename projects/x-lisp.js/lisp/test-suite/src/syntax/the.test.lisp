(claim main (-> void-t))

(define (main)
  (assert-equal 1 (the int-t 1))
  (assert-equal 'a (the symbol-t 'a)))
