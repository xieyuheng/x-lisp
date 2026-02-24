(import "square" square)

(claim main (-> void-t))

(define (main)
  (assert-equal 81 (square (square 3))))
