(import semigroup-t "semigroup.lisp")

(define trivial-semigroup
  (new semigroup-t
    (define element-t trivial-t)
    (define compose (lambda (x y) sole))
    (define compose-associative (lambda (x y z) refl))))
