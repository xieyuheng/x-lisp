(import monoid-t "monoid.lisp")

(define-class group-t (monoid-t)
  (claim inverse (-> element-t element-t))
  (claim inverse-left
    (forall ((x element-t))
      (equal-t element-t
        (compose (inverse x) x)
        id)))
  (claim inverse-right
    (forall ((x element-t))
      (equal-t element-t
        (compose x (inverse x))
        id))))

(claim group-div
  (forall ((g group-t))
    (-> g:element-t g:element-t g:element-t)))
(define (group-div g x y) (g:compose x (g:inverse y)))
