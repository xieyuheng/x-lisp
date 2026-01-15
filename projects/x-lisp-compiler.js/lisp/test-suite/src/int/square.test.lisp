(import "square" square)

(define (main)
  (assert-equal 81 (square (square 3))))
