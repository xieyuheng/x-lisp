(lambda (x) x)

(define apply (lambda (f x) (f x)))
apply
(apply (lambda (x) x))
(apply (lambda (x) x) (lambda (x) x))
