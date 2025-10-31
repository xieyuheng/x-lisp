(import semigroup-t "semigroup.lisp")

(define-class monoid-t (semigroup-t)
  (claim id element-t)
  (claim id-left
    (forall ((x element-t))
      (equal-t element-t (compose id x) x)))
  (claim id-right
    (forall ((x element-t))
      (equal-t element-t (compose x id) x))))
