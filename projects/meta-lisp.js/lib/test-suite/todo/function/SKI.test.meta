(define (S x y z) (x z (y z)))
(define (K x y) x)
(define (I x) x)

(define (main)
  (S K I))

(define local-SKI
  (= S (lambda (x y z) (x z (y z))))
  (= K (lambda (x y) x))
  (= I (lambda (x) x))
  (@tuple S K I))
