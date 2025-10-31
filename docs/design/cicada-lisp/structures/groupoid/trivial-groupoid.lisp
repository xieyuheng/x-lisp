(import groupoid-t "groupoid.lisp")
(import isomorphism-t trivial-category "../category/index.lisp")

(define trivial-isomorphism
  (new isomorphism-t
    (define cat trivial-category)
    (define dom sole)
    (define cod sole)
    (define morphism sole)
    (define inverse sole)
    (define inverse-left refl)
    (define inverse-right refl)))

(define trivial-groupoid
  (new (groupoid-t :object trivial)
    ...trivial-category
    (define inverse (lambda (f) sole))
    (define inverse-iso (lambda (f) trivial-isomorphism))))
