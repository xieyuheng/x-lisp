(import group-t "group.lisp")
(import category-t "../category/index.lisp")
(import equal-swap equal-map equal-compose "../equality/index.lisp")
(import group-homomorphism-t
        id-group-homomorphism
        compose-group-homomorphism
        "group-homomorphism.lisp")

(define group-category
  (new category-t
    (define object-t group-t)
    (define morphism-t (lambda (G H) (group-homomorphism-t G H)))
    (define id id-group-homomorphism)
    (define compose compose-group-homomorphism)
    ;; NOTE To prove `equal` between objects,
    ;; is to prove `equal` between each property.
    (define id-left
      (the (equal-t (group-homomorphism-t f:dom f:cod)
             (compose-group-homomorphism (id-group-homomorphism f:dom) f)
             f)
        TODO))
    (define id-right
      TODO)
    (define compose-associative
      TODO)))
