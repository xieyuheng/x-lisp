(define (swap f x y) (f y x))

(define (drop f)
  (lambda (dropped x) (f x)))

(define (dup f)
  (lambda (x) (f x x)))
