(claim main (-> void-t))

(define (main)
  (assert-equal [:x 'a :y 'b] '(:x a :y b)))
